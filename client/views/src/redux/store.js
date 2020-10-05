import {createStore,applyMiddleware,combineReducers} from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import {composeWithDevTools} from 'redux-devtools-extension';
import productReducer from './products/productReducer';
import userReducer from './auth/login/loginReducer';
import addressReducer from './addresses/addressReducer';
import  cartReducer  from './cart/cartReducer';
import checkoutReducer from './checkout/checkoutReducer';
const rootReducer = combineReducers({
    user:userReducer,
    products:productReducer,
    addresses:addressReducer,
    cart:cartReducer,
    checkout:checkoutReducer
})
const store = createStore(rootReducer,composeWithDevTools(applyMiddleware(logger,thunk)));
export default store;