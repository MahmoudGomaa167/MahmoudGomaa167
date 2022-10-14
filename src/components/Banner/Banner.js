import React from 'react'
import styles from './Banner.module.css'

const Banner = () => {




    return (
        <div className={`${styles.banner} mt-5`}>
            <div className={`${styles.overlay}`}></div>
            <div className='container'>

                <h1 className='text-white'>Welcome To My Movies App</h1>
            </div>
        </div>
    )
}

export default Banner