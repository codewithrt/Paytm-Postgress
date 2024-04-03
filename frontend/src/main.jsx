import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './output.css'
import { RecoilRoot } from 'recoil'
import {ToastContainer} from "react-custom-alert"
import "react-custom-alert/dist/index.css"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RecoilRoot>
      <Suspense fallback={<div>Loading ...</div>}>
    <App />
    <ToastContainer floatingTime={3000}/>
    </Suspense>
    </RecoilRoot>
  </React.StrictMode>,
)
