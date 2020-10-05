import React, { useEffect, useState } from "react";
import { CartSvg2 } from "./svg/icons";
import Layout from "./Layout";
import Features from "./Features";
import { Link, Redirect } from "react-router-dom";
import "../css/cart.css";
import ShoppingCards from "./ShoppingCards";
import { connect } from "react-redux";
import { removeFromCart, fetchCart, updateCart } from "../redux";
import Loader from "./Loader";
import { populateCheckout } from "../redux/checkout/checkoutActions";
export function Options({ maxQty, qty, handleQtyChange, dataLabel }) {
  let options = [];
  for (let i = 1; i <= maxQty && i <= 20; i++) options.push(<option key={i} value={i}>{i}</option>);
  for (let i = 25; i <= 50 && i <= maxQty; i += 5) options.push(<option key={i} value={i}>{i}</option>);
  for (let i = 60; i <= 100 && i <= maxQty; i += 10) options.push(<option key={i} value={i}>{i}</option>);
  if (options.length === 0) options.push(<option value="">Currently Not Available</option>);
  return (
    <>
      <select value={qty} data-label={dataLabel} onChange={handleQtyChange}>
        {options}
      </select>
    </>
  );
}
function Cart(props) {
  //eslint-disable-next-line
  const { products, error, loading, fetchCart, removeFromCart, userLoggedIn, updateCart, populateCheckout,addresses } = props;
  // console.log("here we go",addresses);
  let [price, setPrice] = useState(0);
  // console.log(products);
  //scroll to top when get rendered 
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  //cart subtotal
  useEffect(() => {
    setPrice(0); //set to 0 when products changes, and then calculate;
    products.forEach(product => {
      setPrice(price => price + product.qty * product.price);
    });
  }, [products]);

  function handleRemove(event) {
    removeFromCart(event.currentTarget.getAttribute("data-action"));
    event.preventDefault();
  }
  function handleQtyChange(event) {
    const newQty = event.target.value;
    updateCart({ id: event.target.getAttribute("data-label"), qty: newQty });
  }
  function updateSize(event) {
    let current = event.currentTarget;
    if(!current.classList.contains('selected') && current.getAttribute('data-action') === "true"){//if the selected size is already the default size no need to update; data-action true if size more than 0
      const newSize = current.getAttribute('data-label');
      updateCart({id:current.getAttribute('data-id'),size:newSize});
    }
  }
  function processProducts(){
    return products.map(product => {
      let address = addresses.addresses.filter(address => address.zipCode == product.zipCode);
      return {...product,address:address[0]};
    })
  }
  function checkout(){
    let processedProducts = processProducts();
    populateCheckout(processedProducts);
    props.history.push('/checkout/KSFJSJFMLKSULJSLKKFJLKSFF_SNFSK_SJFLSF_SJJFKSUFOLJWIEF7USSOFHIF');
  }
  return (
    <>
      {!userLoggedIn ? (
        <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
      ) : (
        <Layout>
          <main className="flex flex-column cart-container-main shift-down-below-nav-bar">
            <div className="full-width limit-width">
              <div className="cart-checkout-container medium-margin-left medium-margin-right flex large-margin">
                <div className="cart-container flex large-padding large-margin-top flex-column">
                  {products.length === 0 ? (
                    !loading && (
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
                    )
                  ) : (
                    <div className="cart-inner cart-not-empty full-width">
                      {products.map(product => (
                        <Link key={product.title}  to={"/buyProduct/"+product.productId} className="product-card-link">
                        <div className="product-card grid medium-margin-left medium-margin-right small-margin">
                          <div className="img-container">
                            <img src={product.img} alt="" />
                          </div>
                          <div className="content-qty-button-container flex flex-column">
                            <div className="content-qty-container">
                              <ul className="xxxsmall-font content flex flex-column">
                                <li className="name xsmall-margin">{product.title}</li>
                                <li className="price">
                                  <label>Price: </label>
                                  <span className="color-red">
                                    <i className="fas fa-rupee-sign"></i> {product.price}
                                  </span>
                                </li>
                                <li className="available-sizes flex small-margin" onClick={(event) => event.preventDefault()}>
                                  {product.availableSizes.map(size => (
                                    <div
                                      key={size.size}
                                      data-label={size.size}
                                      data-id={product.productId}
                                      //eslint-disable-next-line
                                      className={"small-margin-left small-margin-right flex " + (size.stocks == 0 ? "fade" : "") + (size.size == product.size ? "selected" : "")}
                                      data-action={!!size.stocks}
                                      onClick={updateSize}>
                                      {size.size}
                                    </div>
                                  ))}
                                </li>
                              </ul>
                              <div className="quantity-container xsmall-margin" onClick={event => event.preventDefault() }>
                                <label className="xxxsmall-font color-primary">Quantity: </label>
                                <Options maxQty={product.maxQty} qty={product.qty} dataLabel={product.productId} handleQtyChange={handleQtyChange} />
                              </div>
                            </div>
                            <div className="button-container medium-margin-right xsmall-margin-top">
                              <button className="button-primary xsmall-padding xsmall-padding-left xsmall-padding-right" data-action={product.productId} onClick={handleRemove}>
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                {products.length > 0 && (
                  <div className="checkout-container flex flex-column justify-space-between medium-padding full-width large-margin-top">
                    <div className="medium-margin-left flex flex-column content">
                      <div className="cart-subtotal xxsmall-font color-primary">
                        Cart Subtotal:{" "}
                        <span className="color-red">
                          <i className="fas fa-rupee-sign"></i> {price}
                        </span>
                      </div>
                      {price >= 500 ? (
                        <div className="color-green xxxsmall-font small-margin-top">Eligible for Free Delivery</div>
                      ) : (
                        <div className="color-red xxxsmall-font small-margin-top">Shop for Rs. {500 - price} more to to Eligible for Free delivery</div>
                      )}
                    </div>
                    <div className="medium-margin-right button-container">
                      {/* <Link to="/checkout/cart"> */} 
                        <button className="button-primary full-width xxsmall-font no-padding xsmall-padding" onClick={checkout}>Ready to Checkout</button>
                      {/* </Link> */}
                    </div>
                  </div>
                )}
              </div>
              <div className="medium-margin-left medium-margin-right cards-container">
                <ShoppingCards />
                <Features />
              </div>
            </div>
          </main>
          {loading && <Loader />}
        </Layout>
      )}
    </>
  );
}

const mapStateToProps = state => ({ ...state.cart, userLoggedIn: state.user.userLoggedIn,addresses:state.addresses });
const mapDispatchToProps = dispatch => {
  return {
    removeFromCart: id => dispatch(removeFromCart(id)),
    fetchCart: () => dispatch(fetchCart()),
    updateCart: body => dispatch(updateCart(body)),
    populateCheckout: products => dispatch(populateCheckout(products))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
