import React, {useContext, useEffect, useState} from 'react'
import styles from './Home.module.css'
import axios from 'axios'
import Row from '../Row/Row'
import UserContext from '../../UserContext'
import Banner from '../Banner/Banner'

const Home = () => {
  const token = localStorage.getItem('userToken')
  const {user} = useContext(UserContext)
  const [movies, setMovies] = useState([])
  const [tv, setTv] = useState([])
  const [moviesLoading, setMoviesLoading] = useState(true)
  const [tvLoading, setTvLoading] = useState(true)
 


  useEffect(() => {
    fetchMovies() 
    fetchTvShows()
  }, [user])

  async function fetchMovies() {
    try {
      const request = await axios.get('https://mahmoud-my-movies-app.herokuapp.com/movies/movie?size=20', { headers: {'Authorization': `Bearer ${token}`}})
      const {message} = request.data
      if(message === 'Done'){
        setMovies(request.data.movies)
        setMoviesLoading(false)
      }
    } catch (error) {
      console.log(error)
      setMoviesLoading(false)
    }
    
  }

  async function fetchTvShows() {
    try {
      const request = await axios.get('https://mahmoud-my-movies-app.herokuapp.com/movies/tv?size=20', { headers: {'Authorization': `Bearer ${token}`}})
      const {message} = request.data
      if(message === 'Done'){
        setTv(request.data.movies)
        setTvLoading(false)
      }
    } catch (error) {
      console.log(error)
      setTvLoading(false)
    }
    
  }


  return (
    <main className={`${styles.homePage} pt-5`}>
      <Banner/>
      <div className='container'>
        <Row title = 'Trending Movies' type='movie' movies = {movies} loading={moviesLoading} />
        
        <Row title='Trending TV Shows' type='tv' movies={tv} loading={tvLoading}/>
        
      </div>
    </main>
  )
}

export default Home