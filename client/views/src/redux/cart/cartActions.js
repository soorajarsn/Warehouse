import { ADD_TO_CART_REQUEST, ADD_TO_CART_SUCCESS, ADD_TO_CART_ERROR, REMOVE_FROM_CART_REQUEST, REMOVE_FROM_CART_SUCCESS, REMOVE_FROM_CART_ERROR } from "./cartConsts";
import Axios from "axios";
import { getConfig } from "../auth/login/loginActions";

const addToCartRequest = () => ({ type: ADD_TO_CART_REQUEST });
const addToCartSuccess = cartProducts => ({ type: ADD_TO_CART_SUCCESS, payload: cartProducts });
const addToCartError = error => ({ type: ADD_TO_CART_ERROR, payload: error });

const removeFromCartRequest = () => ({ type: REMOVE_FROM_CART_REQUEST });
const removeFromCartSuccess = cartProducts => ({ type: REMOVE_FROM_CART_SUCCESS, payload: cartProducts });
const removeFromCartError = error => ({ type: REMOVE_FROM_CART_ERROR, payload: error });

export const addToCart = (id, size) => {
  return (dispatch, getState) => {
    dispatch(addToCartRequest());
    const config = getConfig(getState);
    Axios.post("/post/addCart", { id, size }, config)
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
