import React, { useEffect } from "react";
import Layout from "./Layout";
import { connect } from "react-redux";

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
  return (
    <Layout>
      <div className="full-width flex checkout-container-main flex-column">
        <div className="full-width limit-width shift-down-below-nav-bar">
          <h1 className="large-margin large-padding xlarge-font light-bold-font  medium-margin-left">Confirm Order</h1>
          {props.checkout.products.map(product => (
            <ProductCard key={product.productId} {...product} img = {product.img.substr(2)} />
          ))}
        {props.checkout.products.length > 0 && <button className="buy-button button-primary medium-margin-left large-margin">Proceed to Pay</button>}
        </div>
      </div>
    </Layout>
  );
}
const mapStateToProps = state => ({ checkout: state.checkout });

export default connect(mapStateToProps)(Checkout);
