import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import styles from './Register.module.css'
import axios from 'axios'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { ClockLoader } from 'react-spinners';

const schema = yup.object({
    userName: yup.string().required('User Name is required').min(3, "Minimum of 3 chars").max(30, "Maximum of 30 chars"),
    email: yup.string().required('Email is required').email('Please enter a valid email'),
    password: yup.string().required('Password is required').matches(/^[a-zA-Z0-9]{3,30}$/, "Minimum of 3 chars or numbers and maximum of 30 chars or numbers"),
    cPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required'),
    gender: yup.string().required().matches(/^(male|female){1}$/, "Must be male or female")
})

const Register = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })

    const onSubmit = async (data) => {
        setLoading(true)
        try {
            const request = await axios.post('https://mahmoud-my-movies-app.herokuapp.com/register', data)
            const { message } = request.data
            if (message === 'Registered successfully') {
                toast.success('Registered Successfully, Please check your email', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setLoading(false)
                navigate('/verifyEmail')
                localStorage.setItem('userVerifyToken', request.data.userToken)
            }
        } catch (error) {
            const { message } = error.response.data
            if (message === 'email already registered') {
                toast.error('Email already registered', {
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
                console.log(message)
                toast.error('Failed to register', {
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
        <main className={`${styles.registerPage}`}>
            <div className={`${styles.overlay}`}></div>

            <div className={`${styles.formContainer} mt-5`}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h1 className='text-center text-white'>Register</h1>
                    <div className="mb-2">
                        <label htmlFor="username" className="form-label">User Name</label>
                        <input type="text" className="form-control" id="username" {...register('userName')} />
                        <p className='alert-danger'>{errors.userName?.message}</p>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="username" className="form-label">Gender</label>
                        <div className='d-flex align-items-center justify-content-start'>
                            <div className='me-5'>
                                <input className="form-check-input me-1" type="radio" name="male" id="male" value="male" {...register('gender')} />
                                <label className="form-check-label" htmlFor="male">
                                    Male
                                </label>
                            </div>

                            <div>
                                <input className="form-check-input me-1" type="radio" name="female" id="female" value="female" {...register('gender')} />
                                <label className="form-check-label" htmlFor="female">
                                    Female
                                </label>
                            </div>
                        </div>

                        <p className='alert-danger'>{errors.gender?.message}</p>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" className="form-control" id="email" {...register('email')} />
                        <p className='alert-danger'>{errors.email?.message}</p>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="password" {...register('password')} />
                        <p className='alert-danger'>{errors.password?.message}</p>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <input type="password" className="form-control" id="confirmPassword" {...register('cPassword')} />
                        <p className='alert-danger'>{errors.cPassword?.message}</p>
                    </div>

                    <button type="submit" className="btn btn-danger">Sign Up</button>

                    <p className='mt-3'>already have an account? <Link to='/login'>Sign In</Link></p>
                </form>
            </div>
            <div className={`${styles.spinner}`} style={{display: loading ? 'flex' : 'none'}}>
            <ClockLoader size={150} color='#fff' />
        </div>
        </main>
    )
}

export default Register