import { ADD_TO_CART_REQUEST, REMOVE_FROM_CART_REQUEST, ADD_TO_CART_SUCCESS, REMOVE_FROM_CART_SUCCESS, ADD_TO_CART_ERROR } from "./cartConsts";

const initialState = {
    products:[],
    loading:false,
    error:''
}

export const cartReducer = (state = initialState,action) => {
    switch(action.type){
        case ADD_TO_CART_REQUEST:
        case REMOVE_FROM_CART_REQUEST:
            return {...state,error:'',loading:true};
        case ADD_TO_CART_SUCCESS:
        case REMOVE_FROM_CART_SUCCESS:
            return {products:action.payload,loading:false,error:''};
        case ADD_TO_CART_ERROR:
        case REMOVE_FROM_CART_ERROR:
            return {...state,error:action.payload,loading:false};
        default:
            return state;
    }
}