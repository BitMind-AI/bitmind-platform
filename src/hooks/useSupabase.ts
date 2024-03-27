import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

type Profile = {
  id: string
  updated_at: string
  username: string
  full_name: string
  avatar_url: string
  is_admin: boolean
}

export default function useSupabase() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    // Listen for changes in the user session
    const sessionListener = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null)

        // Fetch the profile if the user is logged in
        if (session?.user) {
          try {
            // Fetch the profile based on the user ID
            const { data, error } = await supabase
              .from('profiles')
              .select(
                `id,
                updated_at,
                username,
                full_name,
                avatar_url,
                is_admin`
              )
              .eq('id', session.user.id)
              .single()
            if (error) {
              throw new Error(error.message)
            }
            setProfile(data)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            console.error('Error fetching profile:', error.message)
          }
        } else {
          setProfile(null)
        }
      }
    )

    return () => {
      sessionListener.data.subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (user) {
      const subscription = supabase
        .channel('any')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${user.id}`
          },
          (payload) => {
            setProfile({
              ...profile,
              ...(payload.new as Profile)
            })
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(subscription)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return { user, profile }
}
