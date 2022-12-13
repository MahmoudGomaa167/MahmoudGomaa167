import axios from 'axios'
import React, { useState, useEffect } from 'react'
import MovieCard from '../MovieCard/MovieCard'
import Pagination from '../Pagination/Pagination'
import styles from './Movies.module.css'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { ClockLoader } from 'react-spinners';


const schema = yup.object({
  searchKey: yup.string().notRequired(),
  genre: yup.lazy(value => !value ? yup.string() : yup.string().matches(/^(Action|Adventure|Animation|Biography|Comedy|Crime|Drama|Documentary|Fantasy|Family|Historical|Horror|Musical|Mystrey|Romance|Sci-Fi|Thriller|War|Western){1}$/))
})

const Movies = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [pageNumber, setPageNumber] = useState(1)
  const [pages, setPages] = useState([])
  const [categories, setCategories] = useState([])
  const [searchKey, setSearchKey] = useState('')
  const [genre, setGenre] = useState('')
  const token = localStorage.getItem('userToken')

  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema)
  })



  useEffect(() => {
    fetchMovies({ searchKey, genre })
    fetchCategories()
  }, [pageNumber])

  async function fetchCategories() {
    try {
      const request = await axios.get('https://breakable-tan-button.cyclic.app/getCategories', { headers: { 'Authorization': `Bearer ${token}` } })
      setCategories(request.data.categories)
    } catch (error) {
      console.log(error)
    }
  }

  async function fetchMovies(data = {}) {
    try {
      setSearchKey(data?.searchKey)
      setGenre(data?.genre)
      const request = await axios.get(`https://breakable-tan-button.cyclic.app/movies/movie?pageNumber=${pageNumber}&searchKey=${data?.searchKey}&genre=${data?.genre}`, { headers: { 'Authorization': `Bearer ${token}` } })
      const { message } = request.data
      if (message === 'Done') {
        setMovies(request.data.movies)
        setPages(request.data.numOfPages)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
    }

  }

  const handleSearch = (data) => {
    if (!data.searchKey && !data.genre) {
      fetchMovies(data)
      setPageNumber(1)
      setLoading(true)
    } else {
      setLoading(true)
      setPageNumber(1)
      fetchMovies(data)
    }
  }

  return (
    <main className={`${styles.moviesPage} py-5`}>
      <div className='container pt-5'>
        <h1 className='text-center mb-3'>Movies</h1>

        <form>
          <div className="mb-3">
            <input type="text" className="form-control" id="searchKey" aria-describedby="searchKey" placeholder='Search...' {...register('searchKey')} />
          </div>
          <div className='d-flex align-items-center'>
            <select className="form-select mb-3" aria-label="Default select example" {...register('genre')}>
              <option value='' defaultValue=''>All</option>
              {categories && categories.map(category => (
                <option key={category?._id} value={category?.name}>{category?.name}</option>
              ))}
            </select>
            <button onClick={handleSubmit(handleSearch)} className='btn btn-success ms-3 mb-3'> <FontAwesomeIcon icon={faMagnifyingGlass} /></button>
          </div>
        </form>

        <div className='row'>

          {movies?.length ?
            <>
              {movies?.map(movie => (
                <div className='col-md-3 mb-3' key={movie?._id}>
                  <MovieCard movie={movie} />
                </div>
              ))} 
              <Pagination setLoading={setLoading} pageNumber={pageNumber} setPageNumber={setPageNumber} pages={pages} setPages={setPages} />
            </>
            : <h3 style={{ display: loading ? 'none' : 'block' }}>No Movies Found</h3>}


        </div>

      </div>
      <div className={`${styles.spinner}`} style={{ display: loading ? 'flex' : 'none' }}>
        <ClockLoader size={150} color='#fff' />
      </div>
    </main>
  )
}

export default Movies