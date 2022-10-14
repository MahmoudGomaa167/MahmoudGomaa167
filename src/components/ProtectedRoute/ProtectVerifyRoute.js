import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectVerifyRoute = () => {
  return localStorage.getItem('userVerifyToken') ? <Outlet /> : <Navigate to={'/home'} replace />
  
}

export default ProtectVerifyRoute