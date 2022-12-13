import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import styles from './MovieDetails.module.css'
import MovieContext from '../../MovieContext'
import UserContext from '../../UserContext'
import axios from 'axios'
import { toast } from 'react-toastify';
import { ClockLoader } from 'react-spinners';

const MovieDetails = () => {
    const { id } = useParams()
    const token = localStorage.getItem('userToken')
    const {movie, movieLoading} = useContext(MovieContext)
    const { user, setUser } = useContext(UserContext)
    const [isFavoured, setIsFavoured] = useState(false)
    const [loading, setLoading] = useState(false)

    const addToFavourites = async () => {
        setLoading(true)
        try {
            const request = await axios.patch(`https://breakable-tan-button.cyclic.app/addToFavourites/${id}`, '', { headers: { 'Authorization': `Bearer ${token}` } })
            const { message } = request.data
            if (message === 'movie added to favourites successfully') {
                setUser(request.data.user)
                setIsFavoured(true)
                toast.success('Movie Added to Your Favourites List Successfully', {
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

    const removeFromFavourites = async () => {
        setLoading(true)
        try {
            const request = await axios.patch(`https://breakable-tan-button.cyclic.app/removeFromFavourites/${id}`, '', { headers: { 'Authorization': `Bearer ${token}` } })
            const { message } = request.data
            if (message === 'Movie removed from favourites successfully') {
                setUser(request.data.user)
                setIsFavoured(false)
                toast.success('Movie Removed From Your Favourites List Successfully', {
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

    const checkFavourites = () => {
        user?.favourites?.map(movie => {
            if (movie._id === id) {
                setIsFavoured(true)
            }
        })
    }

    useEffect(() => {
        checkFavourites()
    }, [isFavoured])

    return (
        <main className={`${styles.movieDetails} pt-5`} style={{ backgroundImage: `url(${movie?.backdrop_image})` }}>
            <div className={`${styles.overlay}`}></div>
            <div className='container py-5'>
                <div className='row justify-content-between'>
                    <div className='col-md-5'>
                        <div className={`${styles.movieImage}`}>
                            <img src={movie?.poster_image} alt={movie?.title} />
                        </div>
                    </div>

                    <div className='col-md-6'>
                        <div className={`${styles.movieInfo} mt-5`}>
                            <h2>{movie?.title} ({movie?.year})</h2>
                            <p>{movie?.description}</p>
                            <h5>IMDB Rate: {movie?.rate}</h5>
                            <h5>Genres:</h5>
                            {movie?.genre.map(genre => (
                                <span key={genre} className={`${styles.genre} me-3`}>{genre}</span>
                            ))}
                        </div>

                        <div className={`${styles.button} mt-3`}>

                            {isFavoured ?
                                <button className='btn btn-danger me-3 mb-3' onClick={removeFromFavourites}>Remove From Favourites</button> :
                                <button className='btn btn-success me-3 mb-3' onClick={addToFavourites}>Add To Favourites</button>}

                            {user?.role === 'admin' && <Link to={`/updateMovie/${id}`} className='btn btn-warning mb-3'>Update Movie</Link>}

                        </div>
                    </div>
                </div>
            </div>
            <div className={`${styles.spinner}`} style={{ display: loading || movieLoading ? 'flex' : 'none' }}>
                <ClockLoader size={150} color='#fff' />
            </div>
        </main>
    )
}


export default MovieDetails