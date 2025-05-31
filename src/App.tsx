import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryProvider } from '@/provider/queryProvider'
import { NotesStoreProvider } from '@/provider/notesProvider'
import { ThemeProvider } from '@/provider/themeProvider'
import { routers } from '@/routes/routes'
import './assets/css/App.css'

function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <NotesStoreProvider>
          <BrowserRouter>
            <Routes>
              {routers.map((route) => (
                <Route key={route.id} path={route.href} element={route.element} />
              ))}
              <Route path='*' element={<Navigate to='/' replace />} />
            </Routes>
          </BrowserRouter>
        </NotesStoreProvider>
      </ThemeProvider>
    </QueryProvider>
  )
}

export default App
