import { FETCH_ORDERS_REQUEST, FETCH_ORDERS_ERROR, FETCH_ORDERS_SUCCESS } from "./orderConsts";
import { getConfig } from "../auth/login/loginActions";
import Axios from "axios";

export const fetchOrderRequest = () => ({type:FETCH_ORDERS_REQUEST});
export const fetchOrderError = (err) => ({type:FETCH_ORDERS_ERROR,payload:err});
export const fetchOrderSuccess = (orders) => ({type:FETCH_ORDERS_SUCCESS,payload:orders});

export const fetchOrders = () => {
    return (dispatch,getState) => {
        const config = getConfig(getState);
        dispatch(fetchOrderRequest());
        Axios.get('/api/orders',config)
        .then(response => {
            const data = response.data;
            dispatch(fetchOrderSuccess(data.products));
        })
        .catch(err => {
            if(err.response)
                dispatch(fetchOrderError(err.response.errorMsg));
            else dispatch(fetchOrderError('Something went wrong'));
        });
    }
}