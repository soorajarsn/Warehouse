import { PRODUCT_REQUEST, PRODUCT_REQUEST_SUCCESS, PRODUCT_REQUEST_ERROR } from "./productConst"

const initialState = {
    loading:false,
    products:[{_id:1},{_id:2},{_id:3},{_id:4},{_id:5},{_id:6},{_id:7},{_id:8}],
    productsRemaining:true,
    appliedPrices:[],//array of objects like [{from:'',to:''},{from:'',to:''},{from:'',to:''},....];
    appliedSizes:[],
    sortBy:'',
    error:false
}

const productReducer = (state = initialState, action) => {
    switch(action.type){
        case PRODUCT_REQUEST:
            return {
                ...state,
                loading:true
            }
        case PRODUCT_REQUEST_SUCCESS:
            return {
                ...state,
                loading:false,
                products:action.payload.products,
                appliedPrices:action.payload.appliedPrices,
                appliedSizes:action.payload.appliedSizes,
                sortBy:action.payload.sortBy,
                error:false,
                productsRemaining:action.payload.productsRemaining,
            }
        case PRODUCT_REQUEST_ERROR:
            return {
                ...state,
                error:true
            }
        default:
            return state;
    }
}
export default productReducer;