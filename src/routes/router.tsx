import { createBrowserRouter } from 'react-router-dom'
import { RequireAdmin } from './RequireAdmin'
import { Login } from '../pages/Login'
import { Dashboard } from '../pages/Dashboard'
import { Products } from '../pages/Products'
import { Categories } from '../pages/Categories'
import { Orders } from '../pages/Orders'
import { Customers } from '../pages/Customers'
import { Content } from '../pages/Content'
import { Marketing } from '../pages/Marketing'
import { Reports } from '../pages/Reports'
import { Settings } from '../pages/Settings'

export const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  {
    path: '/',
    element: (
      <RequireAdmin>
        <Dashboard />
      </RequireAdmin>
    ),
  },
  {
    path: '/produtos',
    element: (
      <RequireAdmin>
        <Products />
      </RequireAdmin>
    ),
  },
  {
    path: '/categorias',
    element: (
      <RequireAdmin>
        <Categories />
      </RequireAdmin>
    ),
  },
  {
    path: '/encomendas',
    element: (
      <RequireAdmin>
        <Orders />
      </RequireAdmin>
    ),
  },
  {
    path: '/clientes',
    element: (
      <RequireAdmin>
        <Customers />
      </RequireAdmin>
    ),
  },
  {
    path: '/conteudo',
    element: (
      <RequireAdmin>
        <Content />
      </RequireAdmin>
    ),
  },
  {
    path: '/marketing',
    element: (
      <RequireAdmin>
        <Marketing />
      </RequireAdmin>
    ),
  },
  {
    path: '/relatorios',
    element: (
      <RequireAdmin>
        <Reports />
      </RequireAdmin>
    ),
  },
  {
    path: '/definicoes',
    element: (
      <RequireAdmin>
        <Settings />
      </RequireAdmin>
    ),
  },
])
