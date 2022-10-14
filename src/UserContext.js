import axios from 'axios';
import { createContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';

const UserContext = createContext()

export const UserContextProvider = (props) => {
    const [user, setUser] = useState()
    const [id, setId] = useState()
    

    const fetchUser = async (id, token) => {
        try {
            const request = await axios.get(`https://mahmoud-my-movies-app.herokuapp.com/getUser/${id}`, {headers: {'Authorization': `Bearer ${token}`}})
            const {message} = request.data
            if(message === 'Done'){
                setUser(request.data.user)
            }
        } catch (error) {
           return
        }
    }

    const checkLocalStorage = async() => {
        if(localStorage.getItem('userToken')){
            const token = localStorage.getItem('userToken')
            const {_id} = jwtDecode(token)
            fetchUser(_id, token)
        }else{
            return;
        }
    }

   

    useEffect(() => {
        checkLocalStorage()
    }, [id])

    return(
        <UserContext.Provider value={{user, setUser, setId}}>
            {props.children}
        </UserContext.Provider>
    )
}



export default UserContext