import React, { useState } from 'react'
import styles from './UpdatePassword.module.css'
import axios from 'axios'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { toast } from 'react-toastify';
import { ClockLoader } from 'react-spinners';



const schema = yup.object({
    oldPassword: yup.string().required('Old Password is required').matches(/^[a-zA-Z0-9]{3,30}$/, 'password must be chars and numbers with minimum of 3 chars and maximum of 30 chars'),
    newPassword: yup.string().required('New Password is required').matches(/^[a-zA-Z0-9]{3,30}$/, 'password must be chars and numbers with minimum of 3 chars and maximum of 30 chars'),
    cNewPassword: yup.string()
        .oneOf([yup.ref('newPassword'), null], 'Passwords must match').required('Confirm New Password is required')
})

const UpdatePassword = () => {
    const token = localStorage.getItem('userToken')
    const [loading, setLoading] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    })

    const onSubmit = async (data) => {
        setLoading(true)
        try {
            const request = await axios.patch(`http://localhost:8000/updatePassword`, data, { headers: { 'Authorization': `Bearer ${token}` } })
            const { message } = request.data
            if (message === 'Password updated successfully') {
                toast.success('Password Updated Successfully', {
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
            if(message === 'Old password is the same as new password'){
                toast.error('Old password is the same as new password', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setLoading(false)
            }else if(message === 'invalid password'){
                toast.error('Invalid Password', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setLoading(false)
            }else if(message === 'invalid user'){
                toast.error('Invalid User', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setLoading(false)
            }else{
                toast.error(message, {
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
        <main className={`${styles.updatePassword} py-5`}>
            <div className='container pt-5'>
                <h2 className='text-center mb-3'>Update Password</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <label htmlFor="oldPassword" className="form-label">Old Password</label>
                        <input type="password" className="form-control" id="oldPassword" {...register('oldPassword')} />
                        <p className='alert-warning'>{errors.oldPassword?.message}</p>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="newPassword" className="form-label">New Password</label>
                        <input type="password" className="form-control" id="newPassword" {...register('newPassword')} />
                        <p className='alert-warning'>{errors.newPassword?.message}</p>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="cNewPassword" className="form-label">Confirm New Password</label>
                        <input type="password" className="form-control" id="cNewPassword" {...register('cNewPassword')} />
                        <p className='alert-warning'>{errors.cNewPassword?.message}</p>
                    </div>


                    <button type='submit' className='btn btn-warning m-auto'>Update Password</button>
                </form>
            </div>
            <div className={`${styles.spinner}`} style={{ display: loading ? 'flex' : 'none' }}>
                <ClockLoader size={150} color='#fff' />
            </div>
        </main>
    )
}

export default UpdatePassword