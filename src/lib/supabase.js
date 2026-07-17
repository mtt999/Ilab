import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://qhsxtpywfczqopcimykk.supabase.co'
const SUPABASE_KEY = 'sb_publishable_eXj0rGtAqMRX2Q3B9kgc1w_CE8rzWei'

// Auth storage adapter — powers the "Keep me signed in" checkbox.
// The login page sets ilab_keep_signed_in BEFORE calling signInWithPassword:
//   'false'       → tokens go to sessionStorage (signed out when browser closes)
//   anything else → tokens go to localStorage (persistent — the default)
// Each write clears the other store so a stale token from a previous mode can
// never shadow the current session.
const authStorage = {
  getItem: (k) => localStorage.getItem(k) ?? sessionStorage.getItem(k),
  setItem: (k, v) => {
    if (localStorage.getItem('ilab_keep_signed_in') === 'false') {
      sessionStorage.setItem(k, v)
      localStorage.removeItem(k)
    } else {
      localStorage.setItem(k, v)
      sessionStorage.removeItem(k)
    }
  },
  removeItem: (k) => { localStorage.removeItem(k); sessionStorage.removeItem(k) },
}

export const sb = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { storage: authStorage },
  global: {
    fetch: (url, options = {}) => fetch(url, { ...options, cache: 'no-store' }),
  },
})
