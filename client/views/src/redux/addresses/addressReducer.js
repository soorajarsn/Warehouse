import {
  CREATE_ADDRESS_REQUEST,
  GET_ADDRESS_REQUEST,
  EDIT_ADDRESS_REQUEST,
  DELETE_ADDRESS_REQUEST,
  CREATE_ADDRESS_SUCCESS,
  GET_ADDRESS_SUCCESS,
  EDIT_ADDRESS_SUCCESS,
  DELETE_ADDRESS_SUCCESS,
  CREATE_ADDRESS_ERROR,
  GET_ADDRESS_ERROR,
  EDIT_ADDRESS_ERROR,
  DELETE_ADDRESS_ERROR,
} from "./addressConsts";

const initialState = {
  loading: false,
  addresses: [],
  error: "",
};

const addressReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_ADDRESS_REQUEST:
    case GET_ADDRESS_REQUEST:
    case EDIT_ADDRESS_REQUEST:
    case DELETE_ADDRESS_REQUEST:
      return { ...state, loading: true, error: "" };
    case CREATE_ADDRESS_SUCCESS:
    case GET_ADDRESS_SUCCESS:
    case EDIT_ADDRESS_SUCCESS:
    case DELETE_ADDRESS_SUCCESS:
      return { addresses: action.payload, loading: false, error: "" };
    case CREATE_ADDRESS_ERROR:
    case GET_ADDRESS_ERROR:
    case EDIT_ADDRESS_ERROR:
    case DELETE_ADDRESS_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
        return state;
  }
};

export default addressReducer;