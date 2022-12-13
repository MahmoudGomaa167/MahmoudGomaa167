import axios from 'axios';
import { createContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ClockLoader } from 'react-spinners';
import { toast } from 'react-toastify';



const MovieContext = createContext()

export function MovieContextProvider(props) {
    const { id } = useParams()
    const [movie, setMovie] = useState()
    const [movieLoading, setMovieLoading] = useState(true)

    const fetchMovie = async () => {
        setMovieLoading(true)
        try {
            const token = localStorage.getItem('userToken')
            const request = await axios.get(`https://breakable-tan-button.cyclic.app/movie/${id}`, { headers: { 'Authorization': `Bearer ${token}` } })
            const { message } = request.data
            if (message === 'Done') {
                setMovie(request.data.movie)
                setMovieLoading(false)
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
            setMovieLoading(false)
        }
    }

    useEffect(() => {
        fetchMovie()
    }, [])

    return (
        <MovieContext.Provider value={{movie, movieLoading}}>
            {props.children}
        </MovieContext.Provider>
    )
}


export default MovieContext