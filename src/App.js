import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import ForgetPassword from './components/ForgetPassword/ForgetPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';
import ChangePassword from './components/ChangePassword/ChangePassword';
import Home from './components/Home/Home';
import AddMovie from './components/Add Movie/AddMovie';
import MovieDetails from './components/MovieDetails/MovieDetails';
import UpdateMovie from './components/Update Movie/UpdateMovie';
import { MovieContextProvider } from './MovieContext';
import UserProfile from './components/UserProfile/UserProfile';
import UpdateProfile from './components/UpdateProfile/UpdateProfile';
import UpdatePassword from './components/UpdatePassword/UpdatePassword';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import ProtectedLoginRoute from './components/ProtectedRoute/ProtectedLoginRoute';
import ProtectResetRoute from './components/ProtectedRoute/ProtectResetRoute';
import UserFavourites from './components/UserFavourites/UserFavourites';
import Movies from './components/Movies/Movies';
import TV from './components/TV/TV';
import NavbarComponent from './components/Navbar/Navbar';
import ProtectVerifyRoute from './components/ProtectedRoute/ProtectVerifyRoute';
import VerifyEmail from './components/VerifyEmail/VerifyEmail';
import ProtectAdminRoute from './components/ProtectedRoute/ProtectAdminRoute';



function App() {

  return (
    <div className="App">
        <NavbarComponent />
      <Routes>


        <Route path='/home' element={<ProtectedRoute />}>
          <Route path='/home' element={<Home />} />
        </Route>

        <Route path='/movieDetails/:id' element={<ProtectedRoute />}>
          <Route path='/movieDetails/:id' element={<MovieContextProvider><MovieDetails /></MovieContextProvider>} />
        </Route>

        <Route path='/addMovie' element={<ProtectAdminRoute />}>
          <Route path='/addMovie' element={<AddMovie />} />
        </Route>

        <Route path='/updateMovie/:id' element={<ProtectAdminRoute />}>
          <Route path='/updateMovie/:id' element={<MovieContextProvider><UpdateMovie /></MovieContextProvider>} />
        </Route>

        <Route path='/userProfile' element={<ProtectedRoute />}>
          <Route path='/userProfile' element={<UserProfile />} />
        </Route>

        <Route path='/updateProfile' element={<ProtectedRoute />}>
          <Route path='/updateProfile' element={<UpdateProfile />} />
        </Route>

        <Route path='/updatePassword' element={<ProtectedRoute />}>
          <Route path='/updatePassword' element={<UpdatePassword />} />
        </Route>

        <Route path='/myFavourites' element={<ProtectedRoute />}>
          <Route path='/myFavourites' element={<UserFavourites />} />
        </Route>

        <Route path='/movie' element={<ProtectedRoute />}>
          <Route path='/movie' element={<Movies />} />
        </Route>

        <Route path='/tv' element={<ProtectedRoute />}>
          <Route path='/tv' element={<TV />} />
        </Route>

        <Route path='/register' element={<ProtectedLoginRoute />}>
          <Route path='/register' element={<Register />} />
        </Route>

        <Route path='/login' element={<ProtectedLoginRoute />}>
          <Route path='/login' element={<Login />} />
        </Route>

        <Route path='/forgetPassword' element={<ProtectedLoginRoute />}>
          <Route path='/forgetPassword' element={<ForgetPassword />} />
        </Route>

        <Route path='/resetPassword' element={<ProtectResetRoute />}>
          <Route path='/resetPassword' element={<ResetPassword />} />
        </Route>

        <Route path='/changePassword' element={<ProtectResetRoute />}>
          <Route path='/changePassword' element={<ChangePassword />} />
        </Route>
        <Route path='/verifyEmail' element={<ProtectVerifyRoute />}>
          <Route path='/verifyEmail' element={<VerifyEmail />} />
        </Route>
        
        <Route path='/' element={<Navigate to={'/home'} replace />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
