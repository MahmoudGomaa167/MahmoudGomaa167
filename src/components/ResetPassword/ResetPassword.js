import React, {useState} from 'react'
import styles from './ResetPassword.module.css'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { ClockLoader } from 'react-spinners';
import jwtDecode from 'jwt-decode';

const schema = yup.object({
    verificationKey: yup.string().required('Verification Key is required')
})

const ResetPassword = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })

    const onSubmit = async (data) => {
        setLoading(true)
        try {
            const token = localStorage.getItem('userResetToken')
            const request = await axios.patch('https://mahmoud-my-movies-app.herokuapp.com/resetPassword', data, { headers: { 'Authorization': `Bearer ${token}` } })
            const { message } = request.data
            if (message === 'Done') {
                toast.success('Done, Please Reset your password', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setLoading(false)
                navigate('/changePassword')
            }
        } catch (error) {
            const { message } = error.response.data
            if (message === 'invalid verification key') {
                toast.error('invalid verification key', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setLoading(false)

            } else if (message === 'invalid user') {
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
                console.log(message)
                toast.error('failed to verify', {
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

    const resendKey = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem('userResetToken')
            const decoded = jwtDecode(token)
            const id = decoded._id
            const request = await axios.patch(`https://mahmoud-my-movies-app.herokuapp.com/resendKey/${id}`)
            const { message } = request.data
            if (message === 'Code sent successfully') {
                toast.success('Code Sent Successfully', {
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
                toast.error('failed to resend the key', {
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
        <main className={`${styles.resetPage}`}>
            <div className={`${styles.overlay}`}></div>

            <div className={`${styles.formContainer} mt-4`}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h1 className='text-center text-white'>Reset Password</h1>

                    <div className="mb-3">
                        <label htmlFor="verificationKey" className="form-label">Verification Key</label>
                        <input type="text" className="form-control" id="verificationKey" {...register('verificationKey')} />
                        <p className='alert-danger'>{errors.verificationKey?.message}</p>
                    </div>

                    <button type="submit" className="btn btn-danger mb-3">Submit</button>
                    <button type="button" className="btn btn-success" onClick={resendKey}>Resend Key</button>

                    <p className='mt-3'>already have an account? <Link to='/login'>Sign In</Link></p>
                </form>
            </div>
            <div className={`${styles.spinner}`} style={{ display: loading ? 'flex' : 'none' }}>
                <ClockLoader size={150} color='#fff' />
            </div>

        </main>
    )
}

export default ResetPassword