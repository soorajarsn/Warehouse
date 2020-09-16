import { ADD_TO_CART_REQUEST, ADD_TO_CART_SUCCESS, ADD_TO_CART_ERROR, REMOVE_FROM_CART_REQUEST, REMOVE_FROM_CART_SUCCESS, REMOVE_FROM_CART_ERROR } from "./cartConsts";
import Axios from "axios";
import { getConfig } from "../auth/login/loginActions";

const addToCartRequest = () => ({type:ADD_TO_CART_REQUEST});
const addToCartSuccess = (cartProducts) => ({type:ADD_TO_CART_SUCCESS,payload:cartProducts});
const addToCartError = (error) => ({type:ADD_TO_CART_ERROR,payload:error});

const addToCart = (id,size) => {
    return (dispatch,getState) => {
        dispatch(addToCartRequest());
        const config = getConfig(getState);
        Axios.post('/post/addCart',body,config).then(response => {
            const data = response.data;
            dispatch(addToCartSuccess(data.products));
        })
        .catch(err => {
            if(err.response){
                dispatch(addToCartError(err.response.data.errorMsg));
            }
            else{
                dispatch(addToCartError('Something went wrong'));
            }
        })
    }
}
