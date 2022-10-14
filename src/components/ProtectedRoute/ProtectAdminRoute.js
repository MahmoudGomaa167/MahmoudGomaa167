import React, {useContext} from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import UserContext from '../../UserContext'

const ProtectAdminRoute = () => {
    const {user} = useContext(UserContext)
    return localStorage.getItem('userToken') && user?.role === 'admin' ? <Outlet /> : <Navigate to={'/login'} replace />
}

export default ProtectAdminRoute