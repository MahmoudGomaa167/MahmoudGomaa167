import React, { useContext, useState } from 'react'
import styles from './Login.module.css'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import jwtDecode from 'jwt-decode';
import UserContext from '../../UserContext';
import { ClockLoader } from 'react-spinners';




const schema = yup.object({
    email: yup.string().required('Email is required').email('Please enter a valid email'),
    password: yup.string().required('Password is required').matches(/^[a-zA-Z0-9]{3,30}$/, "Minimum of 3 chars or numbers and Maximum of 30 chars or numbers")
})

const Login = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })

    const { setId } = useContext(UserContext)

    const onSubmit = async (data) => {
        setLoading(true)
        try {
            const request = await axios.post('https://mahmoud-my-movies-app.herokuapp.com/login', data)
            const { message, token } = request.data
            if (message === 'login success') {
                toast.success('Login Successfully', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setLoading(false)
                localStorage.setItem('userToken', token)
                localStorage.removeItem('userVerifyToken')
                localStorage.removeItem('userResetToken')
                const { _id } = jwtDecode(token)
                setId(_id)
                navigate('/home')
            }
        } catch (error) {
            const { message } = error.response.data
            if (message === 'unverified email') {
                toast.error('please check your email to verify', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                navigate('/verifyEmail')
                setLoading(false)
            } else if (message === `Email doesn't exist`) {
                toast.error('email is not exist', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setLoading(false)
            } else if (message === `invalid email or password`) {
                toast.error('Invalid Email or Password', {
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
                toast.error('failed to login', {
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
        <main className={`${styles.loginPage}`}>
            <div className={`${styles.overlay}`}></div>

            <div className={`${styles.formContainer} mt-4`}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h1 className='text-center text-white'>Login</h1>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" className="form-control" id="email" {...register('email')} />
                        <p className='alert-danger'>{errors.email?.message}</p>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="password" {...register('password')} />
                        <p className='alert-danger'>{errors.password?.message}</p>
                    </div>

                    <button type="submit" className="btn btn-danger">Sign In</button>
                    <p><Link to={'/forgetPassword'}>Forget Password ?</Link></p>

                    <p className='mt-3'>Don't have an account? <Link to='/register'>Sign Up</Link></p>
                </form>
            </div>
        <div className={`${styles.spinner}`} style={{display: loading ? 'flex' : 'none'}}>
            <ClockLoader size={150} color='#fff' />
        </div>
        </main>
    )
}

export default Login