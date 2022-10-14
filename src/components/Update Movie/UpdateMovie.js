import React, { useEffect, useState, useContext } from 'react'
import styles from './UpdateMovie.module.css'
import axios from 'axios'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom'
import MovieContext from '../../MovieContext';
import { ClockLoader } from 'react-spinners';


const schema = yup.object({
    title: yup.string().required('Title is required').min(3, 'Minimum length is 3 chars').max(50, 'Maximum length is 50 chars'),
    description: yup.string().required('Description is required'),
    poster_image: yup.string().required('Poster Image is required'),
    backdrop_image: yup.string().required('Backdrop Image is required'),
    year: yup.string().required('Year is required').matches(/^(1|2){1}[0-9]{3}$/, "Must be 4 digits starting with 1 or 2"),
    rate: yup.string().required('Rate is required').matches(/^[0-9]{1}(\.[0-9])?$/, "Must be a number with no or one decimal number"),
    type: yup.string().typeError('Type is required').required('Type is required').matches(/^(movie|tv){1}$/, 'Must be movie or tv'),
    genre: yup.array(yup.string()).typeError('Genre is required').required('Genre is required')
})

const UpdateMovie = () => {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const { id } = useParams()
    const navigate = useNavigate()
    const { movie } = useContext(MovieContext)
    const token = localStorage.getItem('userToken')

    async function fetchCategories() {
        try {
            const request = await axios.get('https://mahmoud-my-movies-app.herokuapp.com/getCategories', { headers: { 'Authorization': `Bearer ${token}` } })
            setCategories(request.data.categories)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchCategories()
        handleValue()
    }, [movie])

    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema)
    })

    const onSubmit = async (data) => {
        setLoading(true)
        try {
            const request = await axios.put(`https://mahmoud-my-movies-app.herokuapp.com/updateMovie/${id}`, data, { headers: { 'Authorization': `Bearer ${token}` } })
            const { message } = request.data
            if (message === 'Movie updated successfully') {
                toast.success('Movie Updated Successfully', {
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
            if (message === 'invalid movie') {
                toast.error('Invalid Movie', {
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
                toast.error('Failed to update the movie', {
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

    const handleDelete = async () => {
        setLoading(true)
        try {
            const request = await axios.delete(`https://mahmoud-my-movies-app.herokuapp.com/deleteMovie/${id}`, { headers: { 'Authorization': `Bearer ${token}` } })
            const { message } = request.data
            if (message === 'Movie Deleted Successfully') {
                toast.success('Movie Deleted Successfully', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setLoading(false)
                navigate('/home')
            }
        } catch (error) {
            const { message } = error.response.data
            toast.error('Failed to delete the movie', {
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

    const handleValue = () => {
        setValue('title', movie?.title, { shouldTouch: false });
        setValue('description', movie?.description, { shouldTouch: false })
        setValue('poster_image', movie?.poster_image, { shouldTouch: false })
        setValue('backdrop_image', movie?.backdrop_image, { shouldTouch: false })
        setValue('year', movie?.year, { shouldTouch: false })
        setValue('rate', movie?.rate, { shouldTouch: false })
        setValue('type', movie?.type, { shouldTouch: false })
        setValue('genre', movie?.genre, { shouldTouch: false })
    }

    return (
        <main className={`${styles.updateMovie} py-5`}>
            <div className='container pt-5'>
                <h2 className='text-center mb-3'>Update The Movie</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Movie Name</label>
                        <input type="text" className="form-control" id="name"  {...register('title')} />
                        <p>{errors.title?.message}</p>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Movie Description</label>
                        <textarea className='form-control' id='description' rows="5" {...register('description')}></textarea>
                        <p>{errors.description?.message}</p>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="poster_image" className="form-label">Movie Poster Image</label>
                        <input type="text" className="form-control" id="poster_image"  {...register('poster_image')} />
                        <p>{errors.poster_image?.message}</p>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="backdrop_image" className="form-label">Movie Backdrop Image</label>
                        <input type="text" className="form-control" id="backdrop_image"  {...register('backdrop_image')} />
                        <p>{errors.backdrop_image?.message}</p>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="year" className="form-label">Movie Year</label>
                        <input type="text" className="form-control" id="year"  {...register('year')} />
                        <p>{errors.year?.message}</p>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="rate" className="form-label">Movie Rate</label>
                        <input type="text" className="form-control" id="rate" {...register('rate')} />
                        <p>{errors.rate?.message}</p>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="type" className="form-label">Movie Type</label>
                        <div className='d-flex align-items-center justify-content-start'>
                            <div className='me-5'>
                                <input className="form-check-input me-1" type="radio" name="movie" id="movie" value="movie" {...register('type')} />
                                <label className="form-check-label" htmlFor="movie">
                                    Movie
                                </label>
                            </div>

                            <div>
                                <input className="form-check-input me-1" type="radio" name="tv" id="tv" value="tv" {...register('type')} />
                                <label className="form-check-label" htmlFor="tv">
                                    TV Show
                                </label>
                            </div>
                        </div>
                        <p>{errors.type?.message}</p>
                    </div>
                    <div className="mb-3">
                        <p className="form-label">Movie Genres</p>
                        {categories && categories.map((category) => (
                            <span key={category._id} className='me-3'>
                                <input type="checkbox" className="btn-check" value={category.name} {...register('genre')} id={category._id} />
                                <label className="btn btn-outline-primary text-white mb-3" htmlFor={category._id}>{category.name}</label>
                            </span>
                        ))}
                        <p className='alert-danger'>{errors.genre?.message}</p>
                    </div>


                    <button type='submit' className={`${styles.updateBtn} btn btn-warning me-3 mb-3`}>Update The Movie</button>
                    <button type='button' className={`${styles.deleteBtn} btn btn-danger mb-3`} onClick={handleDelete}>Delete The Movie</button>
                </form>
            </div>
            <div className={`${styles.spinner}`} style={{ display: loading ? 'flex' : 'none' }}>
                <ClockLoader size={150} color='#fff' />
            </div>
        </main>
    )
}

export default UpdateMovie