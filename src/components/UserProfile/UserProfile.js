import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import UserContext from '../../UserContext'
import styles from './UserProfile.module.css'

const UserProfile = () => {
    const {user} = useContext(UserContext)
    
  return (
    <main className={`${styles.userDetails} pt-5`}>
            <div className='container py-5'>
                <div className='row justify-content-between'>
                    <div className='col-md-5'>
                        <div className={`${styles.userImage}`}>
                            <img src={user?.profile_pic} alt={user?.userName} />
                        </div>
                    </div>

                    <div className='col-md-6'>
                        <div className={`${styles.userInfo} mt-5 pt-5`}>
                            <h5>Name: {user?.userName}</h5>
                            <h5>Email: {user?.email}</h5>
                            <h5>{user?.phone ? `Phone: ${user.phone}` : ''}</h5>
                            <h5 className='text-capitalize'>Gender: {user?.gender}</h5>
                        </div>

                        <div className={`${styles.button} mt-3`}>
                            <Link to={`/updateProfile`} className='btn btn-warning'>Update Profile</Link>

                        </div>
                    </div>
                </div>
            </div>
        </main>
  )
}

export default UserProfile