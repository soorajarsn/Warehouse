import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { connect } from "react-redux";
import Axios from "axios";
import { Redirect } from "react-router-dom";
import { clearCartProducts } from "../redux";
const __DEV__ = document.domain === "localhost";
function loadScript(src) {
  return new Promise(resolve => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}
const getConfig = token => {
  return {
    headers: {
      "Content-type": "application/json",
      "x-auth-token": token,
    },
  };
};
function ProductCard(props) {
  return (
    <div className="product-container-main flex flex-column medium-margin-left medium-margin-right small-margin">
      <div className="product-card grid">
        <div className="img-container">
          <img src={props.img} alt="" />
        </div>
        <div className="content-qty-button-container flex flex-column">
          <div className="content-qty-container">
            <ul className="xxxsmall-font content flex flex-column">
              <li className="name xsmall-margin">{props.title}</li>
              <li className="price">
                <label>Price: </label>
                <span className="color-red">
                  <i className="fas fa-rupee-sign"></i> {props.price}
                </span>
              </li>
              <li className="quantity-container xsmall-margin">
                <label className="xxxsmall-font color-primary">Quantity: </label>
                {props.qty}
              </li>
              <li className="available-sizes flex xsmall-margin">
                <div className="small-margin-left small-margin-right flex selected">{props.size}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <address className="address-container">
        <h2 className="small-margin xxxsmall-font small-padding-left">Shiping Address</h2>
        <ul className="xxxsmall-font small-padding-left small-padding-right">
          <li>{props.address.firstName + " " + props.address.lastName}, </li>
          <li>{props.address.locality + ", " + props.address.city}, </li>
          <li>{props.address.zipCide + ", " + props.address.state}, </li>
          <li>{props.address.country}, </li>
          <li>{props.address.phone}</li>
        </ul>
        <h3 className="regular-font xxxsmall-font color-green small-padding-left estimated-delivery">Estimated Delivery in XYZ days</h3>
      </address>
    </div>
  );
}
function Checkout(props) {
  const { type, id } = props.match.params;
  const { userLoggedIn } = props;
  const [redirect, setRedirect] = useState(false);
  useEffect(() => {
    if (!userLoggedIn) setRedirect(true);
  }, [userLoggedIn]);
  async function displayRazorpay() {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert("Failed to load. Make sure you are online!");
      return;
    }
    let data;
    try {
      data = (await Axios.post("/post/razorpay", { amount: props.checkout.amount, type, id }, getConfig(props.token))).data;
    } catch (err) {
      if (err.response.status === 401) return setRedirect(true);
      else return alert("Unable to connect to server, Make sure you are online!");
    }

    const options = {
      key: __DEV__ ? "rzp_test_k5HUtJbT6gifJp" : "PRODUCTION_KEY",
      currency: data.currency,
      amount: data.amount.toString(),
      order_id: data.id,
      name: "Warehouse Corporation",
      description: "Thank you for shoping with us",
      image: "/assets/icon.png",
      handler: function (response) {
        if(type == 'cart') props.clearCartProducts();
        props.history.replace('/account/orders');
      },
      theme: {
        color: "rgb(30, 45, 125)",
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }
  return (
    <React.Fragment>
      {redirect ? (
        <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
      ) : (
        <Layout>
          <div className="full-width flex checkout-container-main flex-column">
            <div className="full-width limit-width shift-down-below-nav-bar">
              <h1 className="large-margin large-padding xlarge-font light-bold-font  medium-margin-left">Confirm Order</h1>
              {props.checkout.products.map(product => (
                <ProductCard key={product.productId} {...product} img={product.img.substr(2)} />
              ))}
              {props.checkout.products.length > 0 && (
                <button className="buy-button button-primary medium-margin-left large-margin" onClick={displayRazorpay}>
                  Proceed to Pay <i className="fas fa-rupee-sign"></i> {props.checkout.amount}
                </button>
              )}
            </div>
          </div>
        </Layout>
      )}
    </React.Fragment>
  );
}
const mapStateToProps = state => ({ checkout: state.checkout, token: state.user.token, userLoggedIn: state.user.userLoggedIn });
const mapDispatchToProps = dispatch => {
  return {
    clearCartProducts:() => dispatch(clearCartProducts())
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(Checkout);
