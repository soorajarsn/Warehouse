import { FETCH_ORDERS_REQUEST, FETCH_ORDERS_SUCCESS, FETCH_ORDERS_ERROR } from "./orderConsts";

const initialState = {
    orders:[],
    loading:false,
    error:''
};

const orderReducer = (state = initialState, action) => {
    switch(action.type){
        case FETCH_ORDERS_REQUEST:
            return {...state,error:'',loading:true};
        case FETCH_ORDERS_SUCCESS:
            return {orders:action.payload,loading:false,error:''};
        case FETCH_ORDERS_ERROR:
            return {...state,loading:false,error:action.payload};
        default:
            return state;
    }
}
export default orderReducer;