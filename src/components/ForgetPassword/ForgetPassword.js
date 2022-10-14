import React, { useState } from 'react'
import styles from './ForgetPassword.module.css'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { ClockLoader } from 'react-spinners';

const schema = yup.object({
    email: yup.string().required('Email is required').email('Please enter a valid email')
})

const ForgetPassword = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })

    const onSubmit = async (data) => {
        setLoading(true)
        try {
            const request = await axios.post('https://mahmoud-my-movies-app.herokuapp.com/forgetPassword', data)
            const { message, token } = request.data
            if (message === 'code sent successfully') {
                toast.success('Code Sent Successfully', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                localStorage.setItem('userResetToken', token)
                setLoading(false)
                navigate('/resetPassword')
            }
        } catch (error) {
            const { message } = error.response.data
            if (message === 'invalid email') {
                toast.error('invalid email', {
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
                toast.error('failed to send verification key', {
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
        <main className={`${styles.forgetPage}`}>
            <div className={`${styles.overlay}`}></div>

            <div className={`${styles.formContainer} mt-4`}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h1 className='text-center text-white'>Reset Password</h1>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" className="form-control" id="email" {...register('email')} />
                        <p className='alert-danger'>{errors.email?.message}</p>
                    </div>

                    <button type="submit" className="btn btn-danger">Send Verification Code</button>

                    <p className='mt-3'>already have an account? <Link to='/login'>Sign In</Link></p>
                </form>
            </div>
            <div className={`${styles.spinner}`} style={{ display: loading ? 'flex' : 'none' }}>
                <ClockLoader size={150} color='#fff' />
            </div>
        </main>
    )
}

export default ForgetPassword