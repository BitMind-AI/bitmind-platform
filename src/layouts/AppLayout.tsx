import { Outlet } from 'react-router-dom'

import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Home({
  theme,
  setTheme
}: {
  theme: string
  setTheme: (theme: string) => void
}) {
  return (
    <div className="flex h-full min-h-screen min-w-[300px] flex-col">
      <Header theme={theme} setTheme={setTheme} />

      <Outlet />

      <Footer />
    </div>
  )
}
