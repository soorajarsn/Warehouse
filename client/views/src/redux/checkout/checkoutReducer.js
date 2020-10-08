import { POPULATE_CHECKOUT, CLEAR_CHEKCOUT } from "./checkoutConsts"

const initialState = {
    products:[],
    amount:0
}

const checkoutReducer = (state = initialState,action) => {
    switch(action.type){
        case POPULATE_CHECKOUT:
            return {products:action.payload.products,amount:action.payload.amount};
        case CLEAR_CHEKCOUT:
            return {products:[],amount:0};
        default:
            return state;
    }
} 
export default checkoutReducer;