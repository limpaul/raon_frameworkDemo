import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import TranskeySample from './components/transkey/TranskeySample.jsx'
import MtranskeySample from './components/mtranskey/MtranskeySample.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NxKeySample from './components/nxkey/NxKeySample.jsx'
import NxKeyE2ESample from './components/nxkey/NxKeyE2ESample.jsx'
import BizComponent from './components/biz/BizComponent.jsx'
import MVaccineComponent from './components/vaccine/MVaccineComponent.jsx'


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
  {
    path: "/biz",
    element: <BizComponent/>,
  },
  {
    path: "/mvaccine",
    element: <MVaccineComponent/>,
  },
]);

createRoot(document.getElementById('root')).render(
  
    <RouterProvider router={router}/>
)
