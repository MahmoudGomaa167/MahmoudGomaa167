import React, { useContext, useEffect, useState } from 'react'
import styles from './MovieCard.module.css'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons'
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons'
import UserContext from '../../UserContext'


const MovieCard = ({movie}) => {
  const [isFavoured, setIsFavoured] = useState(false)
  const {user} = useContext(UserContext)

  const checkFavourites = () => {
    user?.favourites?.map(fav => {
        if(fav._id === movie._id){
            setIsFavoured(true)
        }
    })
}

useEffect(() => {
  checkFavourites()
}, [user, isFavoured])

  return (
   
        <div className={`${styles.movieCard} me-md-3`}>
           <Link className='text-white text-decoration-none' to={`/movieDetails/${movie._id}`}>
             <img className={`${styles.movieImage}`} src={movie?.poster_image} alt={movie?.title} />
             <h5 className='text-center mt-2'>{movie?.title}</h5>
             <FontAwesomeIcon icon={isFavoured ? solidStar : regularStar} />
           </Link>
        
        
    </div>
  )
}

export default MovieCard
