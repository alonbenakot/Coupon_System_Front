import  axios  from 'axios';
import store from '../Redux/Store';

/**
 * Sends jwt token with each request.
 */
let jwtAxios = axios.create();
jwtAxios.interceptors.request.use(request => {
    request.headers = {
        "token":store.getState().authState.user?.token
        
    };
    return request;
});

export default jwtAxios;