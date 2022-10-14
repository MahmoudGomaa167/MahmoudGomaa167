import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
    return localStorage.getItem('userToken') ? <Outlet /> : <Navigate to={'/login'} replace />

}

export default ProtectedRoute