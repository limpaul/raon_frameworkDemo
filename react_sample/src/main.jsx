import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import TranskeySample from './components/transkey/TranskeySample.jsx'
import MtranskeySample from './components/mtranskey/MtranskeySample.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NxKeySample from './components/nxkey/NxKeySample.jsx'
import NxKeyE2ESample from './components/nxkey/NxKeyE2ESample.jsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/transkey",
    element: <TranskeySample />,
  },
  {
    path: "/mtranskey",
    element: <MtranskeySample />,
  },
  {
    path: "/nxkey",
    element: <NxKeySample/>,
  },
  {
    path: "/nxkey/e2e",
    element: <NxKeyE2ESample/>,
  },
]);

createRoot(document.getElementById('root')).render(
  
    <RouterProvider router={router}/>
)
