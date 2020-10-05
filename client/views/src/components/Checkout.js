import React, { useEffect } from "react";
import Layout from "./Layout";
import { connect } from "react-redux";

function Checkout(props) {
  const { type } = props.match.params;
//   console.log(props);
//   useEffect(() => {
//     if (type == "cart") {
//     }
//   }, []);
  return (
    <Layout>
      <div className="full-width flex checkout-container-main flex-column">
        <div className="full-width limit-width shift-down-below-nav-bar">
          <h1 className="large-margin large-padding xlarge-font light-bold-font  medium-margin-left">Confirm Order</h1>
          <div className="product-container-main flex flex-column medium-margin-left medium-margin-right small-margin">
            <div className="product-card grid">
              <div className="img-container">
                <img src="" alt="" />
              </div>
              <div className="content-qty-button-container flex flex-column">
                <div className="content-qty-container">
                  <ul className="xxxsmall-font content flex flex-column">
                    <li className="name xsmall-margin">Title</li>
                    <li className="price">
                      <label>Price: </label>
                      <span className="color-red">
                        <i class="fas fa-rupee-sign"></i> Price
                      </span>
                    </li>
                    <li className="quantity-container xsmall-margin">
                      <label className="xxxsmall-font color-primary">Quantity: </label>4
                    </li>
                    <li className="available-sizes flex xsmall-margin">
                      <div className="small-margin-left small-margin-right flex selected">S</div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <address className="address-container">
                <h2 className="small-margin xxxsmall-font small-padding-left">Shiping Address</h2>
                <ul className="xxxsmall-font small-padding-left small-padding-right">
                    <li>Sooraj Shukla, </li>
                    <li>Lakhperabagh, Barabanki, </li>
                    <li>225206, Uttar Pradesh, </li>
                    <li>India, </li>
                    <li>9511149371</li>
                </ul>
                <h3 className="regular-font xxxsmall-font color-green small-padding-left estimated-delivery">Estimated Delivery in XYZ days</h3>
            </address>
          </div>
        </div>
      </div>
    </Layout>
  );
}
const mapStateToProps = state => ({ checkout: state.checkout });

export default connect(mapStateToProps)(Checkout);
