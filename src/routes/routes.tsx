import Example from '@/components/Example'
import { Routes } from '@/models/types'
import Home from '@/pages/Home'

export const routers: Routes[] = [
  {
    href: '/',
    id: 'home',
    name: 'Home',
    element: <Home />,
  },
  {
    href: '/example',
    id: 'example',
    name: 'Example',
    element: <Example />,
  },

  // Add other routes as needed
]
