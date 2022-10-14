import React, { useState } from 'react'
import styles from './ChangePassword.module.css'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { ClockLoader } from 'react-spinners';

const schema = yup.object({
    newPassword: yup.string().required('New Password is required').matches(/^[a-zA-Z0-9]{3,30}$/,  "Minimum of 3 chars or numbers and Maximum of 30 chars or numbers"),
    cNewPassword: yup.string()
        .oneOf([yup.ref('newPassword'), null], 'Passwords must match').required('Confirm New PAssword is required')
})

const ChangePassword = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })


    const onSubmit = async (data) => {
        setLoading(true)
        try {
            const token = localStorage.getItem('userResetToken')
            const request = await axios.patch('https://mahmoud-my-movies-app.herokuapp.com/changePassword', data, { headers: { 'Authorization': `Bearer ${token}` } })
            const { message } = request.data
            if (message === 'password changed successfully') {
                toast.success('password changed successfully', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                navigate('/login')
                setLoading(false)
                localStorage.removeItem('userResetToken')
            }
        } catch (error) {
            const { message } = error.response.data
            if (message === 'invalid user') {
                toast.error('invalid user', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setLoading(false)
            } else {
                toast.error('failed to change password', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setLoading(false)
            }
        }

    }

    return (
        <main className={`${styles.changePage}`}>
            <div className={`${styles.overlay}`}></div>

            <div className={`${styles.formContainer} mt-4`}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h1 className='text-center text-white'>Change Password</h1>

                    <div className="mb-3">
                        <label htmlFor="newPassword" className="form-label">New Password</label>
                        <input type="password" className="form-control" id="newPassword" {...register('newPassword')} />
                        <p className='alert-danger'>{errors.newPassword?.message}</p>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="cNewPassword" className="form-label">Confirm New Password</label>
                        <input type="password" className="form-control" id="cNewPassword" {...register('cNewPassword')} />
                        <p className='alert-danger'>{errors.cNewPassword?.message}</p>
                    </div>

                    <button type="submit" className="btn btn-danger">Submit</button>

                    <p className='mt-3'>already have an account? <Link to='/login'>Sign In</Link></p>
                </form>
            </div>
            <div className={`${styles.spinner}`} style={{ display: loading ? 'flex' : 'none' }}>
                <ClockLoader size={150} color='#fff' />
            </div>
        </main>
    )
}

export default ChangePassword