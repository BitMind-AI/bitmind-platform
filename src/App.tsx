import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { supabase } from './lib/supabase'
import { Session } from '@supabase/supabase-js'

import { capitalizeFirstLetter } from './utils/helpers'

import { SupabaseProvider } from './providers/SupabaseProvider'
import { NotificationsProvider } from './providers/NotificationsProvider'

import Home from './pages/app/Home'
import Compute from './pages/app/Compute'
import Template from './pages/app/Template'
import Review from './pages/app/Review'
import Editor from './pages/app/Editor'
import Performance from './pages/app/Performance'
import Earnings from './pages/app/Earnings'
import Account from './pages/app/Account'
import Admin from './pages/app/Admin'

import SignIn from './pages/auth/SignIn'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'

import Error from './pages/Error'
import NotFound from './pages/NotFound'

import Terms from './pages/legal/Terms'
import Privacy from './pages/legal/Privacy'
import Support from './pages/Support'

import AppLayout from './layouts/AppLayout'
import Loader from './components/Loader'
import Notifications from './components/Notifications'

export type Snippet = {
  id: string
  title: string
  code: string
  packages: string[]
  user_id: string
}

export default function App() {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)
  const [theme, setTheme] = useState(localStorage.theme || 'light')

  const { pathname } = useLocation()

  const queryClient = new QueryClient()

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setSession(session)
      setLoading(false)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!['/'].includes(pathname)) {
      const routeTitles = {
        signin: 'Sign In',
        'forgot-password': 'Forgot Password',
        terms: 'Terms of Service',
        privacy: 'Privacy Policy'
      } as { [key: string]: string }
      const routeName = pathname.split('/')[1]
      const title = routeTitles[routeName] || capitalizeFirstLetter(routeName)
      document.title = `BitMind | ${title}`
    } else {
      document.title = `BitMind`
    }
  }, [pathname])

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation()

    if (!session?.user) {
      return <Navigate to="/signin" state={{ from: location }} replace />
    }

    return children
  }

  if (loading) return <Loader />

  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseProvider session={session}>
        <NotificationsProvider>
          <>
            <div className="h-full">
              <Routes>
                <Route
                  element={<AppLayout theme={theme} setTheme={setTheme} />}
                >
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Home />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="compute"
                    element={
                      <ProtectedRoute>
                        <Compute />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="template"
                    element={
                      <ProtectedRoute>
                        <Template />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="review"
                    element={
                      <ProtectedRoute>
                        <Review />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="editor"
                    element={
                      <ProtectedRoute>
                        <Editor theme={theme} />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="performance"
                    element={
                      <ProtectedRoute>
                        <Performance />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="earnings"
                    element={
                      <ProtectedRoute>
                        <Earnings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="account"
                    element={
                      <ProtectedRoute>
                        <Account />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="admin"
                    element={
                      <ProtectedRoute>
                        <Admin />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="terms" element={<Terms />} />
                  <Route path="privacy" element={<Privacy />} />
                  <Route path="support" element={<Support />} />
                </Route>
                <Route path="signin" element={<SignIn />} />
                <Route path="register" element={<Register />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="error" element={<Error />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Notifications />
          </>
        </NotificationsProvider>
      </SupabaseProvider>
    </QueryClientProvider>
  )
}
