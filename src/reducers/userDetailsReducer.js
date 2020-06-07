import { v4 as uuidv4 } from 'uuid';

export const userDetailsReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {...state,
                isAuthenticated: true,
                connectSockt: true, 
                userName : action.user.userName,
                apiKey : action.user.apiKey,
                socket : action.user.socket,
                id : uuidv4(),
            }
        case 'TOGGLESOCKETSUB' :
            return {...state,
                connectSockt:false
            }
        default:
            return state
    }
}
 
