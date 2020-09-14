import React from "react";
import { CartSvg2 } from "./svg/icons";
function Cart() {
  return (
    <div className="cart-popover-container position-absolute flex" aria-hidden="true">
      <div className="cart-inner full-width large-margin-left large-margin-right">
        <div className="flex flex-column justify-space-between empty-cart full-width">
          <p className="alert color-primary light-bold-font xxsmall-font medium-padding full-width">
            Spend <span>Rs. 500</span> more and get free shipping!
          </p>
          <div className="flex flex-column medium-margin-top">
            <CartSvg2 />
            <h4 className="heading h4 color-primary small-font medium-bold-font medium-margin medium-padding">Your cart is empty</h4>
          </div>
          <a href="/products" className="full-width">
            <button className="button button-primary button-full-width medium-padding xsmall-font">Shop our products</button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Cart;
