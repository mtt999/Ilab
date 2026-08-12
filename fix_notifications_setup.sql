-- ============================================================
-- RUN THIS IN SUPABASE SQL EDITOR (labhive project)
-- One-shot fix for all notification delivery issues
-- Safe to re-run — all statements are idempotent
-- ============================================================

-- ── STEP 1: Ensure columns exist ─────────────────────────────
ALTER TABLE notifications
  ADD COLUMN IF NOT EXISTS title  text,
  ADD COLUMN IF NOT EXISTS body   text,
  ADD COLUMN IF NOT EXISTS type   text,
  ADD COLUMN IF NOT EXISTS read   boolean DEFAULT false;

-- ── STEP 2: Drop all existing policies (needed before type change) ─
DO $$ DECLARE r record; BEGIN
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='notifications'
  LOOP EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON notifications'; END LOOP;
END $$;

DO $$ DECLARE r record; BEGIN
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='booking_notifications'
  LOOP EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON booking_notifications'; END LOOP;
END $$;

-- ── STEP 3: Convert user_id to uuid (fixes Realtime 400 errors) ─
DO $$ BEGIN
  ALTER TABLE notifications ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE booking_notifications ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
EXCEPTION WHEN others THEN NULL; END $$;

-- ── STEP 4: notifications — RLS + policies ───────────────────
-- Uses labhive's existing helper functions: my_user_id(), my_solo_id(), is_super_admin()
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY notifications_insert ON notifications
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY notifications_select ON notifications
  FOR SELECT TO authenticated
  USING (
    user_id = my_user_id()
    OR user_id = my_solo_id()
    OR EXISTS (
      SELECT 1 FROM users me
      JOIN users target ON target.id = notifications.user_id
      WHERE me.auth_id::text = auth.uid()::text
        AND me.organization_id = target.organization_id
        AND me.role IN ('admin', 'user')
    )
    OR is_super_admin()
  );

CREATE POLICY notifications_update ON notifications
  FOR UPDATE TO authenticated
  USING  (user_id = my_user_id() OR user_id = my_solo_id())
  WITH CHECK (user_id = my_user_id() OR user_id = my_solo_id());

CREATE POLICY notifications_delete ON notifications
  FOR DELETE TO authenticated
  USING (user_id = my_user_id() OR user_id = my_solo_id());

-- ── STEP 5: notification_prefs — own row + org-wide SELECT ───
ALTER TABLE notification_prefs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS notification_prefs_own ON notification_prefs;
CREATE POLICY notification_prefs_own ON notification_prefs
  FOR ALL TO authenticated
  USING    (user_id::text = my_user_id()::text OR user_id::text = my_solo_id()::text)
  WITH CHECK (user_id::text = my_user_id()::text OR user_id::text = my_solo_id()::text);

DROP POLICY IF EXISTS notification_prefs_select_org ON notification_prefs;
CREATE POLICY notification_prefs_select_org ON notification_prefs
  FOR SELECT TO authenticated
  USING (
    user_id::text = my_user_id()::text
    OR user_id::text = my_solo_id()::text
    OR EXISTS (
      SELECT 1 FROM users me
      JOIN users target ON target.id::text = notification_prefs.user_id::text
      WHERE me.auth_id::text = auth.uid()::text
        AND me.organization_id = target.organization_id
        AND me.role IN ('admin', 'user')
    )
  );

-- ── STEP 6: email_notifications_queue ────────────────────────
CREATE TABLE IF NOT EXISTS email_notifications_queue (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  to_email     text NOT NULL,
  subject      text,
  body         text,
  html_body    text,
  user_id      text,
  type         text,
  sent         boolean DEFAULT false,
  sent_at      timestamptz,
  attempts     integer DEFAULT 0,
  error        text,
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE email_notifications_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS email_queue_insert ON email_notifications_queue;
CREATE POLICY email_queue_insert ON email_notifications_queue
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS email_queue_select ON email_notifications_queue;
CREATE POLICY email_queue_select ON email_notifications_queue
  FOR SELECT TO authenticated
  USING (is_super_admin());

-- ── STEP 7: Realtime publication ─────────────────────────────
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE booking_notifications;
EXCEPTION WHEN others THEN NULL; END $$;

-- ── VERIFICATION ─────────────────────────────────────────────
SELECT 'rls' AS check_type, tablename AS name, rowsecurity::text AS detail
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('notifications','notification_prefs','email_notifications_queue','booking_notifications')
UNION ALL
SELECT 'policy', tablename || '.' || policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('notifications','notification_prefs','email_notifications_queue')
UNION ALL
SELECT 'realtime', tablename, schemaname
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
  AND tablename IN ('notifications','booking_notifications')
UNION ALL
SELECT 'col_type', column_name, data_type
FROM information_schema.columns
WHERE table_name = 'notifications' AND column_name = 'user_id';
