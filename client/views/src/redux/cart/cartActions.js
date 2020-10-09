import { ADD_TO_CART_REQUEST, ADD_TO_CART_SUCCESS, ADD_TO_CART_ERROR, REMOVE_FROM_CART_REQUEST, REMOVE_FROM_CART_SUCCESS, REMOVE_FROM_CART_ERROR, FETCH_CART_PRODUCT_REQUEST, FETCH_CART_PRODUCT_SUCCESS, FETCH_CART_PRODUCT_ERROR, UPDATE_CART_ERROR, UPDATE_CART_REQUEST, UPDATE_CART_SUCCESS, CLEAR_CART } from "./cartConsts";
import Axios from "axios";
import { getConfig } from "../auth/login/loginActions";

const addToCartRequest = () => ({ type: ADD_TO_CART_REQUEST });
const addToCartSuccess = cartProducts => ({ type: ADD_TO_CART_SUCCESS, payload: cartProducts });
const addToCartError = error => ({ type: ADD_TO_CART_ERROR, payload: error });

const removeFromCartRequest = () => ({ type: REMOVE_FROM_CART_REQUEST });
const removeFromCartSuccess = cartProducts => ({ type: REMOVE_FROM_CART_SUCCESS, payload: cartProducts });
const removeFromCartError = error => ({ type: REMOVE_FROM_CART_ERROR, payload: error });

const fetchCartRequest = () => ({type:FETCH_CART_PRODUCT_REQUEST});
const fetchCartSuccess = cartProducts => ({type:FETCH_CART_PRODUCT_SUCCESS,payload:cartProducts});
const fetchCartError = (error) => ({type: FETCH_CART_PRODUCT_ERROR,paylod:error});

const updateCartRequest = () => ({type:UPDATE_CART_REQUEST});
const updateCartSuccess = cartProducts => ({type:UPDATE_CART_SUCCESS,payload:cartProducts});
const updateCartError = error => ({type:UPDATE_CART_ERROR,payload:error});

const clearCart = (cartProducts) => ({type:CLEAR_CART,payload:cartProducts});
export const addToCart = (body) => {
  return (dispatch, getState) => {
    console.log('addToCart called');
    dispatch(addToCartRequest());
    const config = getConfig(getState);
    Axios.post("/post/addCart", body, config)
      .then(response => {
        const data = response.data;
        dispatch(addToCartSuccess(data.products));
      })
      .catch(err => {
        if (err.response) {
          dispatch(addToCartError(err.response.data.errorMsg));
        } else {
          dispatch(addToCartError("Something went wrong"));
        }
      });
  };
};

export const removeFromCart = id => {
  return (dispatch, getState) => {
    dispatch(removeFromCartRequest());
    const config = getConfig(getState);
    config.data = {id};
    Axios.delete("/post/removeCart", config)
      .then(response => {
        const data = response.data;
        dispatch(removeFromCartSuccess(data.products));
      })
      .catch(err => {
        if (err.response) dispatch(removeFromCartError(err.response.data.errorMsg));
        else dispatch(removeFromCartError("Something went wrong"));
      });
  };
};

export const fetchCart = () => {
  return (dispatch,getState) => {
    dispatch(fetchCartRequest());
    const config = getConfig(getState);
    Axios.get('/api/cart',config)
    .then(response => {
      const data = response.data;
      dispatch(fetchCartSuccess(data.products))
    })
    .catch(err => {
      if(err.response){
        dispatch(fetchCartError(err.response.data));
      }
      else{
        dispatch(fetchCartError("Something went wrong!!!"));
      }
    });
  }
}

export const updateCart = (body) => {
  return (dispatch,getState) => {
    dispatch(updateCartRequest());
    const config = getConfig(getState);
    Axios.put('/api/updateCart',body,config)
    .then(response => {
      const data = response.data;
      dispatch(updateCartSuccess(data.products));
    })
    .catch(err => {
      if(err.response){
        dispatch(updateCartError(err.response.data));
      }
      else{
        dispatch(updateCartError('Something went wrong!!!'));
      }
    })
  }
}

export const clearCartProducts = () => {
  return (dispatch,getState) => {
    const config = getConfig(getState);
    Axios.delete('/api/clearCart',config)
    .then(response => {
      const data = response.data;
      dispatch(clearCart(data.products));
    })
    .catch(err => {
      console.log(err);
    })
  }
}