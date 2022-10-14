import React from 'react'
import MovieCard from '../MovieCard/MovieCard'
import Slider from "react-slick";
import styles from './Row.module.css'
import { Link } from 'react-router-dom';
import { ClockLoader } from 'react-spinners';

const Row = ({ title, movies, loading, type }) => {

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 2,
    autoplay: true,
    pauseOnHover: true,
    autoplaySpeed: 5000,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className={`${styles.row} pt-5 row`}>
      <div className='d-flex align-items-center justify-content-between mb-3'>
        <h2 className='mb-0'>{title}</h2>
        <Link to={`${type === 'movie' ? '/movie' : '/tv'}`} className='text-white text-decoration-none btn btn-success'>Show More</Link>
      </div>
      <Slider {...settings}>
        {movies.length && movies.map(movie => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </Slider>
        <div className={`${styles.spinner}`} style={{ display: loading ? 'flex' : 'none' }}>
          <ClockLoader size={100} color='#fff' />
        </div>
    </div>
  )
}

export default Row