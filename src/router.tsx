import { createBrowserRouter } from 'react-router-dom'
import RootLayout from '@/components/RootLayout'
import HomePage from '@/pages/HomePage'
import ProjectDetailPage from '@/pages/ProjectDetailPage'
import NotFoundPage from '@/pages/NotFoundPage'

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/projects/:slug', element: <ProjectDetailPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export default router