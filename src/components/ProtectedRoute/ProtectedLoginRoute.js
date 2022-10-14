import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedLoginRoute = () => {
    return !localStorage.getItem('userToken') ? <Outlet /> : <Navigate to={'/home'} replace />
}

export default ProtectedLoginRoute