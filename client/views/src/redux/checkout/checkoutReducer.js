import { POPULATE_CHECKOUT, CLEAR_CHEKCOUT } from "./checkoutConsts"

const initialState = {
    products:[]
}

const checkoutReducer = (state = initialState,action) => {
    switch(action.type){
        case POPULATE_CHECKOUT:
            return {products:action.payload};
        case CLEAR_CHEKCOUT:
            return {products:[]};
        default:
            return state;
    }
} 
export default checkoutReducer;