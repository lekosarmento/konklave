import { createClient } from '@supabase/supabase-js'

// Server-only client using the service role key — bypasses RLS.
// NEVER import this in client components or expose to the browser.
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  })
}
