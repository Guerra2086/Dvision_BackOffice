import { RouterProvider } from 'react-router-dom'
import { AdminAuthProvider } from './context/AdminAuthContext'
import { router } from './routes/router'

function App() {
  return (
    <AdminAuthProvider>
      <RouterProvider router={router} />
    </AdminAuthProvider>
  )
}

export default App
