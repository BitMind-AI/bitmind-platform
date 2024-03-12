import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'

import { capitalizeFirstLetter } from './utils/helpers'

import { PythonProvider } from 'react-py'
import { NotificationsProvider } from './providers/NotificationsProvider'
import { SupabaseProvider } from './providers/SupabaseProvider'

import Account from './pages/app/Account'
import Compute from './pages/app/Compute'
import Editor from './pages/app/Editor'
import Home from './pages/app/Home'
import Review from './pages/app/Review'
import Template from './pages/app/Template'

import ForgotPassword from './pages/auth/ForgotPassword'
import Register from './pages/auth/Register'
import SignIn from './pages/auth/SignIn'

import Error from './pages/Error'
import NotFound from './pages/NotFound'

import Support from './pages/Support'
import Privacy from './pages/legal/Privacy'
import Terms from './pages/legal/Terms'

import Loader from './components/Loader'
import Notifications from './components/Notifications'
import AppLayout from './layouts/AppLayout'
import api from './utils/api'

export type Snippet = {
  id: string
  title: string
  code: string
  packages: string[]
  user_id: string
}

function App() {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)
  const [theme, setTheme] = useState(localStorage.theme || 'light')

  const { pathname } = useLocation()

  useEffect(() => {
    const load = async () => {
      api(
        '/api/v2/organizations/487ff517-ea8c-4820-bb02-5d14cf486f33/templates',
        {
          method: 'GET', // Specify the request method
          headers: {
            Accept: 'application/json',
            'Coder-Session-Token': 'Pha1F2RHmi-KgHooyTqQcUBEGAJOQjUPe', // Replace 'API_KEY' with your actual API key
          },
        }
      )
        .then((response) => {
          console.log(response) // Handle the response data
        })
        .catch((error) => {
          console.error(error) // Handle any errors
        })
    }
    load()
  }, [])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setSession(session)
      setLoading(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    navigator.serviceWorker
      .register('/react-py-sw.js')
      .then((registration) =>
        console.debug(
          'Service Worker registration successful with scope: ',
          registration.scope
        )
      )
      .catch((err) =>
        console.error('Service Worker registration failed: ', err)
      )
  }, [])

  useEffect(() => {
    if (!['/', '/embed'].includes(pathname)) {
      const routeTitles = {
        signin: 'Sign In',
        'forgot-password': 'Forgot Password',
        terms: 'Terms of Service',
        privacy: 'Privacy Policy',
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
    <PythonProvider lazy={pathname.startsWith('/embed')}>
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
                    path="account"
                    element={
                      <ProtectedRoute>
                        <Account />
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
    </PythonProvider>
  )
}

export default App
