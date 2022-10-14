import React, { useEffect, useContext, useState } from 'react'
import styles from './UserFavourites.module.css'
import MovieCard from '../MovieCard/MovieCard'
import axios from 'axios'
import Pagination from '../Pagination/Pagination';
import { ClockLoader } from 'react-spinners';
import { toast } from 'react-toastify';


const UserFavourites = () => {
    const [favourites, setFavourites] = useState([])
    const [loading, setLoading] = useState(true)
    const [pageNumber, setPageNumber] = useState(1)
    const [pages, setPages] = useState([])


    const getFavourites = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem('userToken')
            const request = await axios.get(`https://mahmoud-my-movies-app.herokuapp.com/getFavourites?pageNumber=${pageNumber}`, { headers: { 'Authorization': `Bearer ${token}` } })
            const { message } = request.data
            if (message === 'Done') {
                setFavourites(request.data.favourites)
                setPages(request.data.numOfPages)
                setLoading(false)
            }
        } catch (error) {
            toast.error(error.response.data, {
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

    useEffect(() => {
        getFavourites()
    }, [pageNumber])

    return (
        <main className={`${styles.userFavourites} py-5`}>
            <div className='container pt-5'>
                <h1 className='text-center mb-3'>My Favourites</h1>
                <div className='row'>

                    {favourites?.length ?
                        <>
                            {favourites?.map(movie => (
                                <div className='col-lg-3 col-md-4' key={movie?._id}>
                                    <MovieCard movie={movie} />
                                </div>
                            ))}
                            <Pagination setLoading={setLoading} pageNumber={pageNumber} setPageNumber={setPageNumber} pages={pages} setPages={setPages} />
                        </>

                        : <h3 className='text-center' style={{ display: loading ? 'none' : 'block' }}>No movies in your favourites list</h3>}

                </div>
            </div>
            <div className={`${styles.spinner}`} style={{ display: loading ? 'flex' : 'none' }}>
                <ClockLoader size={150} color='#fff' />
            </div>

        </main>
    )
}

export default UserFavourites