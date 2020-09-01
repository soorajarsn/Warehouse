import { PRODUCT_REQUEST, PRODUCT_REQUEST_ERROR, PRODUCT_REQUEST_SUCCESS } from "./productConst";
import Axios from "axios";

export const productRequest = () => ({type:PRODUCT_REQUEST});
export const productRequestError = () => ({type:PRODUCT_REQUEST_ERROR});
export const productRequestSuccess = (productData) => ({type:PRODUCT_REQUEST_SUCCESS,payload:productData});

export const fetchProducts = (productClass='',category='',subCategory='',page = 1,sortBy="popularity",price="",size='') => {
    return dispatch => {
        dispatch(productRequest());
        Axios.get(`/api/getProducts?productClass=${productClass}&category=${category}&subCategory=${subCategory}&page=${page}&sortBy=${sortBy}&price=${price}&size=${size}`)
        .then(responce => {
            dispatch(productRequestSuccess(responce.data));
        })
        .catch(err => {
            dispatch(productRequestError());  
        })
    }
}