import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { CounterStoreProvider } from '@/provider/counterProvider'
import { QueryProvider } from '@/provider/queryProvider'
import { routers } from '@/routes/routes'
import './assets/css/App.css'
import mixpanel from 'mixpanel-browser'

if (import.meta.env.NODE_ENV === 'production') {
  mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN, {
    track_pageview: true,
    persistence: 'localStorage',
    debug: false,
  })
}

function App() {
  return (
    <QueryProvider>
      <CounterStoreProvider>
        <BrowserRouter>
          <Routes>
            <Route>
              {routers.map((route) => (
                <Route key={route.id} path={route.href} element={route.element} />
              ))}
              <Route path='*' element={<Navigate to='/' replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CounterStoreProvider>
    </QueryProvider>
  )
}

export default App
