import React, { createContext, useReducer }  from 'react';
import { userDetailsReducer } from '../reducers/userDetailsReducer'

export const UserContext = createContext();

const UserContextProvider = (props) => {
    const [user, dispatch] = useReducer(userDetailsReducer, {});
    return (  
        <UserContext.Provider value={{ user, dispatch }}>
            {props.children}
        </UserContext.Provider>
    );
}
 
export default UserContextProvider;