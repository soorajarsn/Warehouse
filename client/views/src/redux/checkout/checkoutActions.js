import { POPULATE_CHECKOUT, CLEAR_CHEKCOUT } from "./checkoutConsts";

export const populateCheckout = ({products,amount}) => ({type:POPULATE_CHECKOUT,payload:{products,amount}});
export const clearCheckout = () => ({type:CLEAR_CHEKCOUT});