import React, { useEffect } from "react";
import { CartSvg2 } from "./svg/icons";
import Layout from "./Layout";
import Features from "./Features";
import { Link } from "react-router-dom";
import "../css/cart.css";
import ShoppingCards from "./ShoppingCards";
import { connect } from "react-redux";
import { removeFromCart, fetchCart } from "../redux";
import Loader from "./Loader";
// let products = [
//   { img: "/assets/2d744bcc-ebc8-46f4-a3c2-dc60a5da14291538643882929-Veni-Vidi-Vici-Women-Tops-7901538643882756-1.jpg", title: "Vini Vidi Vici", size: "S", price: 100 },
//   { img: "/assets/2d744bcc-ebc8-46f4-a3c2-dc60a5da14291538643882929-Veni-Vidi-Vici-Women-Tops-7901538643882756-1.jpg", title: "Vini Vidi Vici", size: "S", price: 100 },
//   { img: "/assets/2d744bcc-ebc8-46f4-a3c2-dc60a5da14291538643882929-Veni-Vidi-Vici-Women-Tops-7901538643882756-1.jpg", title: "Vini Vidi Vici", size: "S", price: 100 },
// ];
function Options({maxQty,qty,handleQtyChange}){
  let options = [];
  for(var i = 1; i < maxQty && i <=20; i++)
    options.push(<option value={i}>{i}</option>);
  for(var i = 25; i <= 50 && i < maxQty; i+=5)
    options.push(<option value={i}>{i}</option>);
  for(var i = 60; i <= 100 && i < maxQty; i+=10)
    options.push(<option value={i}>{i}</option>);
  if(options.length == 0)
    options.push(<option vlaue="">Currently Not Available</option>)
  return (<>
    <select value={qty} onChange={handleQtyChange}>
      {options.map(opt => ({opt}))}
    </select>
  </>)
}
function Cart(props) {
  const { products, error, loading, fetchCart, removeFromCart } = props;
  console.log(props);
  useEffect(() => {
    fetchCart();
  }, []);
  function handleRemove(event) {
    removeFromCart(event.currentTarget.getAttribute("data-action"));
  }
  function handleQtyChange(){

  }
  return (
    <Layout>
      <main className="flex flex-column cart-container-main shift-down-below-nav-bar">
        <div className="full-width limit-width">
          <div className="cart-checkout-container medium-margin-left medium-margin-right flex large-margin">
            <div className="cart-container flex large-padding large-margin-top flex-column">
              {products.length == 0 ? (
                <div className="cart-inner empty-cart-indicator full-width">
                  <div className="flex flex-column justify-space-between empty-cart full-width">
                    <p className="alert color-primary light-bold-font xxsmall-font full-width">
                      Spend <span>Rs. 500</span> more and get free shipping!
                    </p>
                    <div className="flex flex-column medium-margin-top">
                      <CartSvg2 />
                      <h4 className="heading h4 color-primary small-font medium-bold-font medium-margin medium-padding">Your cart is empty</h4>
                    </div>
                    <Link to="/products" className="full-width shop-more-products">
                      <button className="button button-primary button-full-width medium-padding xsmall-font ">Shop our products</button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="cart-inner cart-not-empty full-width">
                  {products.map(product => (
                    <div key={product.title} className="product-card grid medium-margin-left medium-margin-right small-margin">
                      <div className="img-container">
                        <img src={product.img} alt="" />
                      </div>
                      <div className="content-and-button-container flex flex-column">
                        <ul className="xxxsmall-font content flex flex-column">
                          <li className="name xsmall-margin">{product.title}</li>
                          <li className="size">
                            <label>Size: </label> <span className="color-red">{product.size}</span>
                          </li>
                          <li className="price xsmall-margin-top">
                            <label>Price: </label>
                            <span className="color-red">Rs. {product.price}</span>
                          </li>
                        </ul>
                        <div className="quantity-container xsmall-margin">
                          <label className="xxxsmall-font color-primary">Quantity: </label>
                          <Options maxQty={product.maxQty} qty={product.qty} handleQtyChange={handleQtyChange} />
                        </div>
                        <div className="button-container medium-margin-right xsmall-margin-top">
                          <button className="button-primary xsmall-padding xsmall-padding-left xsmall-padding-right" data-action={product.id} onClick={handleRemove}>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="checkout-container flex flex-column justify-space-between medium-padding full-width large-margin-top">
              <div className="medium-margin-left flex flex-column content">
                <div className="cart-subtotal xxsmall-font color-primary">
                  Cart Subtotal: <span className="color-red">Rs. 500</span>
                </div>
                <div className="color-green xxxsmall-font small-margin-top">Eligible for Free Delivery</div>
              </div>
              <div className="medium-margin-right button-container">
                <button className="button-primary full-width xxsmall-font no-padding xsmall-padding">Ready to Checkout</button>
              </div>
            </div>
          </div>
          <div className="medium-margin-left medium-margin-right">
            <ShoppingCards />
            <Features />
          </div>
        </div>
      </main>
      {loading && <Loader />}
    </Layout>
  );
}

const mapStateToProps = state => ({ ...state.cart });
const mapDispatchToProps = dispatch => {
  return {
    removeFromCart: id => dispatch(removeFromCart(id)),
    fetchCart: () => dispatch(fetchCart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
