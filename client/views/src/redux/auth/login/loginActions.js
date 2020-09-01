import axios from 'axios';
import { LOGIN_SUCCESS, 
         LOGIN_ERROR, 
         LOGIN_REQUEST, 
         SIGNUP_REQUEST, 
         SIGNUP_SUCCESS, 
         RECOVER_REQUEST, 
         RECOVER_SUCCESS, 
         RECOVER_ERROR, 
         SIGNUP_ERROR,
         LOAD_USER_SUCCESS,
         LOAD_USER_ERROR,
         LOGOUT_SUCCESS} from './loginConsts';



export const loginRequest = () => ({type:LOGIN_REQUEST});
export const loginError = (err) => ({type:LOGIN_ERROR,payload:err});
export const loginSuccess = (userData) => ({type:LOGIN_SUCCESS,payload:userData});

export const signupRequest = () => ({type:SIGNUP_REQUEST});
export const signupError = (err) => ({type:SIGNUP_ERROR,payload:err});
export const signupSuccess = (userData) => ({type:SIGNUP_SUCCESS,payload:userData});

export const recoverRequest = () => ({type:RECOVER_REQUEST});
export const recoverError = (err) => ({type:RECOVER_ERROR,payload:err});
export const recoverSuccess = (msg) => ({type:RECOVER_SUCCESS,payload:msg});

export const loadUserSuccess = (data) => ({type:LOAD_USER_SUCCESS,payload:data});
export const loadUserError = (err) => ({type:LOAD_USER_ERROR,payload:err});

export const logOut = () => ({type:LOGOUT_SUCCESS});

export const loadUser = () => (dispatch,getState) => {
    const config = getConfig(getState);
    axios.get('/api/loadUser',config)
        .then(res => {
            dispatch(loadUserSuccess(res.data));
        })
        .catch(err => {
            console.log(err);
            dispatch(loadUserError(err.data));
        });
}
export const getConfig = (getState) => {
    const token = getState().user.token;
    const config = {
        headers:{
            "Content-type":'application/json'
        }
    }
    if(token){
        config.headers['x-auth-token'] = token;
    }
    return config;
}
// export const getConfig = 
export const loginUser = body => {
    return dispatch => {
        dispatch(loginRequest());
        axios.post('http://localhost:4000/post/login',body)
        .then(response => {
            const userData = response.data;
            if(userData.errorMsg)
                dispatch(loginError(userData.errorMsg));
            else
                dispatch(loginSuccess(userData));
        })
        .catch(err => {
            dispatch(loginError('Something went wrong'));
        });
    }
}

export const signupUser = body => {
    return dispatch => {
        dispatch(signupRequest());
        axios.post('http://localhost:4000/post/signup',body)
        .then(responce => {
            const userData = responce.data;
            if(userData.errorMsg)
                dispatch(signupError(userData.errorMsg));
            else
                dispatch(signupSuccess(userData));
        })
        .catch(err => {
            dispatch(signupError('Something went wrong'));
        });
    }
}

export const recoverUser = body => {
    return dispatch => {
        dispatch(recoverRequest());
        axios.post('http://localhost:4000/post/recover',body)
        .then(responce => {
            const data = responce.data;
            if(data.errorMsg)
                dispatch(recoverError(data.errorMsg));
            else
                dispatch(recoverSuccess(data.msg));
        })
        .catch(err => {
            const errorMsg = err.message;
            console.log(errorMsg);
            dispatch(recoverError('Something went wrong'));
        })
    }
}

// export const logOut = () => dispatch => {
//     dispatch(logOutSuccess());
// }