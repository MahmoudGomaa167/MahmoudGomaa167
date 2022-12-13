import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../../UserContext'
import styles from './UpdateProfile.module.css'
import axios from 'axios'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { ClockLoader } from 'react-spinners';


const schema = yup.object({
    userName: yup.string().required('User Name is required').min(3, 'User Name minimum length must be 3 chars').max(30, 'User Name maximum length must be 30 chars'),
    email: yup.string().required('Email is required').email('Enter a valid email'),
    gender: yup.string().required('Gender is required').matches(/^(male|female){1}$/, 'Must be male or female'),
    phone: yup.lazy(value => !value ? yup.string() : yup.string().matches(/^01(0|1|2|5){1}[0-9]{8}$/, "Must start with 010, 011, 012 or 015 with 11 numbers"))
})

const UpdateProfile = () => {
    const token = localStorage.getItem('userToken')
    const { user, setUser } = useContext(UserContext)
    const navigate = useNavigate()
    const [file, setFile] = useState(user?.profile_pic)
    const [fileError, setFileError] = useState('')
    const [loading, setLoading] = useState(false)
    let formData = new FormData()

    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema),
        defaultValues: user
    })

    useEffect(() => {
        handlValue()
        setFile(user?.profile_pic)
    }, [user])

    const handlValue = () => {
        setValue('userName', user?.userName, { shouldTouch: false })
        setValue('email', user?.email, { shouldTouch: false })
        setValue('phone', user?.phone, { shouldTouch: false })
        setValue('gender', user?.gender, { shouldTouch: false })
    }

    const handleChange = (e) => {
        if (e.target.files.length === 1 && e.target.files[0].size <= 2000000 && (e.target.files[0].type === "image/png" || e.target.files[0].type === "image/jpg" || e.target.files[0].type === "image/jpeg")) {
            setFile(e.target.files[0])
            setFileError(null)
        } else {
            setFileError('File must be an image with a 2 MB size')
        }
    }


    const onSubmit = async (data) => {
        formData.set('userName', data.userName)
        formData.set('email', data.email)
        formData.set('phone', data.phone)
        formData.set('gender', data.gender)
        formData.append('profile_pic', file)
        setLoading(true)
        try {
            const request = await axios.put('https://breakable-tan-button.cyclic.app/updateUser', formData, { headers: { 'Authorization': `Bearer ${token}` } })
            const { message } = request.data
            if (message === 'User updated successfully') {
                const updatedUser = request.data.user
                toast.success('User Updated Successfully', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setUser(updatedUser)
                setLoading(false)
                navigate('/userProfile')
            } else if (message === 'User updated successfully please verify your new email') {
                const updatedUser = request.data.user
                toast.success('User Updated Successfully, Please Verify Your Email', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                localStorage.setItem('userVerifyToken', request.data.userToken)
                setUser(updatedUser)
                setLoading(false)
                const { _id } = jwtDecode(token)
                const logoutRequest = await axios.patch(`https://breakable-tan-button.cyclic.app/logout/${_id}`, '', { headers: { 'Authorization': `Bearer ${token}` } })
                const { message } = logoutRequest.data
                if (message === 'Logout successfully') {
                    toast.success('Logout Successfully', {
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
                    localStorage.removeItem('userToken')
                }
            }
        } catch (error) {
            const { message } = error.response.data
            if (message === 'invalid user') {
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
            } else {
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
        <main className={`${styles.updateProfile} py-5`}>
            <div className='container pt-5'>
                <h2 className='text-center mb-3'>Update Profile</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">User Name</label>
                        <input type="text" className="form-control" id="name" {...register('userName')} />
                        <p className='alert-warning'>{errors.userName?.message}</p>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" className="form-control" id="email" {...register('email')} />
                        <p className='alert-warning'>{errors.email?.message}</p>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="phone" className="form-label">Phone Number</label>
                        <input type="text" className="form-control" id="phone" {...register('phone')} />
                        <p className='alert-warning'>{errors.phone?.message}</p>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Gender</label>
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
                        <p className='alert-warning'>{errors.gender?.message}</p>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="profilePic" className="form-label">Profile Picture</label>
                        <input className="form-control" type="file" id="profilePic" onChange={handleChange} accept="image/png, image/jpg, image/jpeg" />
                        {fileError && <p className='alert-warning'>{fileError}</p>}
                    </div>

                    <button type='submit' className='btn btn-warning m-auto'>Update Profile</button>
                    <Link to={'/updatePassword'} className='btn btn-success ms-3'>Update Password</Link>
                </form>
            </div>
            <div className={`${styles.spinner}`} style={{ display: loading ? 'flex' : 'none' }}>
                <ClockLoader size={150} color='#fff' />
            </div>
        </main>


    )
}

export default UpdateProfile