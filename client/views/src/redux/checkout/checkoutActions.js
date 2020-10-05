import { POPULATE_CHECKOUT, CLEAR_CHEKCOUT } from "./checkoutConsts";

export const populateCheckout = (products) => ({type:POPULATE_CHECKOUT,payload:products});
export const clearCheckout = () => ({type:CLEAR_CHEKCOUT});