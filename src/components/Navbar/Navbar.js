import React, { useContext, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './Navbar.module.css'
import logo from '../../logo.svg'
import UserContext from '../../UserContext'
import jwtDecode from 'jwt-decode'
import axios from 'axios'
import { toast } from 'react-toastify'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { ClockLoader } from 'react-spinners';



const NavbarComponent = () => {
    const [userMenu, setUserMenu] = useState(false)
    const { user, setUser } = useContext(UserContext)
    const [loading, setLoading] = useState(false)
    const menu = useRef()

    const navigate = useNavigate()

    const toggleUserMenu = () => {
        let children = [...menu.current.children]
        window.addEventListener('click', (e) => {
            if(e.target === children[0] || e.target === children[1] ){
                setUserMenu(!userMenu)
            }else{
                setUserMenu(false)
            }
        })
    }


    const handleLogout = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem('userToken')
            const { _id } = jwtDecode(token)
            const request = await axios.patch(`https://breakable-tan-button.cyclic.app/logout/${_id}`, '', { headers: { 'Authorization': `Bearer ${token}` } })
            const { message } = request.data
            if (message === 'Logout successfully') {
                toast.success('Logout Successfully', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                navigate('/login')
                setUser(null)
                setLoading(false)
                localStorage.removeItem('userToken')
            }

        } catch (error) {
            const { message } = error.response.data
            toast.success(message, {
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

    return (
        <>
            <Navbar expand="lg" className={`${styles.nav} navbar navbar-expand-lg position-fixed`}>
                <Container>
                    <Navbar.Brand>
                        <Link className={`${styles.navbarLogo} navbar-brand text-white fw-bold p-0`} to="/">
                            <img src={logo} alt='my-movies' /> My Movies
                        </Link>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav">
                        <span className={`${styles.navbarTogglerIcon}`}>
                            <FontAwesomeIcon icon={faBars} />
                        </span>
                    </Navbar.Toggle>
                    <Navbar.Collapse className={`${styles.navbarCollapse}`} id="basic-navbar-nav">
                        <Nav className="me-auto">
                            {localStorage.getItem('userToken') &&
                                <>
                                    <li>
                                        <Link className="nav-link active text-white p-2" aria-current="page" to={'/'}>Home</Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link className="nav-link active text-white p-2" aria-current="page" to={'/movie'}>Movies</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link active text-white p-2" aria-current="page" to={'/tv'}>TV Shows</Link>
                                    </li>
                                </>
                            }
                            {!localStorage.getItem('userToken') && <>
                                <li className="nav-item">
                                    <Link className="nav-link text-white p-2" to="/register">Register</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-white p-2" to="/login">Login</Link>
                                </li>
                            </>}

                        </Nav>
                        {localStorage.getItem('userToken') && <div className='d-flex align-items-center position-relative p-2'>
                            <div className='d-flex align-items-center' style={{ cursor: 'pointer' }} ref={menu} onClick={toggleUserMenu}>
                                <h6 className='me-2 mb-0 text-white'>{user?.userName}</h6>
                                <img src={user?.profile_pic} className={`${styles.avatar}`} alt={user?.userName} />
                            </div>

                            <div className={`${styles.userMenu}`} style={{ display: userMenu ? 'block' : 'none' }}>
                                <ul>
                                    <li>
                                        <Link to={'/userProfile'}>My Profile</Link>
                                    </li>
                                    <li>
                                        <Link to={'/myFavourites'}>My Favourites</Link>
                                    </li>
                                    {user?.role === 'admin' &&
                                        <li>
                                            <Link to={'/addMovie'}>Add Movie</Link>
                                        </li>}
                                    <li>
                                        <Link onClick={handleLogout}>Logout</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>}
                    </Navbar.Collapse>

                </Container>
            </Navbar>
            <div className={`${styles.spinner}`} style={{ display: loading ? 'flex' : 'none' }}>
                <ClockLoader size={150} color='#fff' />
            </div>
        </>

    )
}

export default NavbarComponent