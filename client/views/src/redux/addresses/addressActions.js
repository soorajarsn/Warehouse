import {
  CREATE_ADDRESS_REQUEST,
  CREATE_ADDRESS_SUCCESS,
  CREATE_ADDRESS_ERROR,
  GET_ADDRESS_SUCCESS,
  GET_ADDRESS_REQUEST,
  GET_ADDRESS_ERROR,
  DELETE_ADDRESS_REQUEST,
  DELETE_ADDRESS_SUCCESS,
  DELETE_ADDRESS_ERROR,
  EDIT_ADDRESS_REQUEST,
  EDIT_ADDRESS_SUCCESS,
  EDIT_ADDRESS_ERROR,
} from "./addressConsts";
import Axios from "axios";
import { getConfig } from "../auth/login/loginActions";

export const createAddressRequest = () => ({ type: CREATE_ADDRESS_REQUEST });
export const createAddressSuccess = data => ({ type: CREATE_ADDRESS_SUCCESS, payload: data });
export const createAddressError = err => ({ type: CREATE_ADDRESS_ERROR, payload: err });

export const getAddressRequest = () => ({ type: GET_ADDRESS_REQUEST });
export const getAddressSuccess = data => ({ type: GET_ADDRESS_SUCCESS, payload: data });
export const getAddressError = err => ({ type: GET_ADDRESS_ERROR, payload: err });

export const deleteAddressRequest = () => ({ type: DELETE_ADDRESS_REQUEST });
export const deleteAddressSuccess = data => ({ type: DELETE_ADDRESS_SUCCESS, payload: data });
export const deleteAddressError = err => ({ type: DELETE_ADDRESS_ERROR, payload: err });

export const editAddressRequest = () => ({ type: EDIT_ADDRESS_REQUEST });
export const editAddressSuccess = data => ({ type: EDIT_ADDRESS_SUCCESS, payload: data });
export const editAddressError = err => ({ type: EDIT_ADDRESS_ERROR, payload: err });

export const addAddress = body => {
  return (dispatch, getState) => {
    dispatch(createAddressRequest());
    const config = getConfig(getState);
    Axios.post("/post/createAddress", body, config)
      .then(response => {
        const data = response.data;
        dispatch(createAddressSuccess(data.addresses));
      })
      .catch(err => {
        if(err.response){
          console.log(err.response);
          dispatch(createAddressError(err.response.data.errorMsg));
        }
        else{
          dispatch(createAddressError("Something went wrong"));
        }
      });
  };
};

export const getAddresses = () => (dispatch, getState) => {
  dispatch(getAddressRequest());
  const config = getConfig(getState);
  Axios.get("/api/addresses", config)
    .then(response => {
      const data = response.data;
      dispatch(getAddressSuccess(data.addresses));
    })
    .catch(err => {
      if(err.response){
        dispatch(getAddressError(err.response.data.errorMsg));
      }
      else{
        dispatch(getAddressError("Something went wrong"));
      }
    });
};

export const deleteAddress = body => {
  console.log("body is ",body);
  return (dispatch, getState) => {
    dispatch(deleteAddressRequest());
    const config = getConfig(getState);
    console.log('and config is ',config);
    config.data = body;
    Axios.delete("/api/address", config)
      .then(response => {
        const data = response.data;
        dispatch(deleteAddressSuccess(data.addresses));
      })
      .catch(err => {
        if(err.response){
          dispatch(deleteAddressError(err.response.data.errorMsg));
        }
        else{
          dispatch(deleteAddressError("Something went wrong"));
        }
      });
  };
};

export const updateAddress = body => {
  return (dispatch, getState) => {
    dispatch(editAddressRequest());
    const config = getConfig(getState);
    Axios.put("/api/address", body, config)
      .then(response => {
        const data = response.data;
        dispatch(editAddressSuccess(data.addresses));
      })
      .catch(err => {
        if(err.response){
          dispatch(editAddressError(err.response.data.errorMsg));
        }
        else{
          dispatch(editAddressError("Something went wrong"));
        }
      });
  };
};
