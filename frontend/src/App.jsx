import React from 'react'
import { Routes, Route } from "react-router-dom";
import { TheaterProvider } from './context/TheaterContext';
import AuthWithLocation from './pages/Login';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/DashBoard';
import Path from './pages/Route'



export const serverurl="http://localhost:8080"

const App = () => {
  return (
    <TheaterProvider>
      <Routes>
        <Route path="/" element={<AuthWithLocation />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/route" element={<Path />} />
      </Routes>
    </TheaterProvider>
  )
}

export default App
