import { FETCH_ORDERS_REQUEST, FETCH_ORDERS_ERROR, FETCH_ORDERS_SUCCESS } from "./orderConsts";

export const fetchOrderRequest = () => ({type:FETCH_ORDERS_REQUEST});
export const fetchOrderError = (err) => ({type:FETCH_ORDERS_ERROR,payload:err});
export const fetchOrderSuccess = (orders) => ({type:FETCH_ORDERS_SUCCESS,payload:orders});