import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import React from 'react'; // React 17 이전 버전에서는 반드시 추가
import ReactDOM from 'react-dom/client'; // 필요한 다른 모듈도 import


createRoot(document.getElementById('root')).render(
    <App />
)
