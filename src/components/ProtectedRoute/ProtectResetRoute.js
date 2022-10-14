import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectResetRoute = () => {
    return localStorage.getItem('userResetToken') ? <Outlet /> : <Navigate to={'/home'} replace />
}

export default ProtectResetRoute