import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// 1. Importe as ferramentas do React Router
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// 2. Importe seus novos componentes de página
import { LoginPage } from './pages/Login.tsx';
import { RegisterPage } from './pages/Register.tsx';
import { DashboardPage } from './pages/Dashboard.tsx';

// 3. Crie o roteador com a definição das suas rotas
const router = createBrowserRouter([
  {
    path: '/', // A rota raiz, que levará para o App (layout principal)
    element: <App />,
    children: [ // Rotas "filhas" que serão renderizadas dentro do App
      {
        path: '/', // Rota exata da raiz
        element: <DashboardPage />,
      },
      {
        path: '/users/login',
        element: <LoginPage />,
      },
      {
        path: '/users/register',
        element: <RegisterPage />,
      },
      // A rota do dashboard será a mesma da raiz, mas podemos ser explícitos
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
    ]
  },
]);

// 4. Renderize o RouterProvider em vez do App diretamente
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);