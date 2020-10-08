import React, { useEffect } from "react";
import Layout from "./Layout";
import { connect } from "react-redux";
import Axios from "axios";
const __DEV__ = document.domain === 'localhost'
function loadScript(src) {
	return new Promise((resolve) => {
		const script = document.createElement('script');
		script.src = src;
		script.onload = () => {
			resolve(true)
		}
		script.onerror = () => {
			resolve(false)
		}
		document.body.appendChild(script);
	})
}

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
  async function displayRazorpay() {
		const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

		if (!res) {
			alert('Razorpay SDK failed to load. Are you online?')
			return
		}
    let data;
		try{
      data = (await Axios.post('/post/razorpay',{amount:1})).data;
    }catch(err){
      console.log(err);
    }
  
		console.log(data)

		const options = {
			key: __DEV__ ? 'rzp_test_k5HUtJbT6gifJp' : 'PRODUCTION_KEY',
			currency: data.currency,
			amount: data.amount.toString(),
      order_id: data.id,
			name: 'Buy Something',
			description: 'Thank you for shoping with us',
			image: '/assets/icon.png',
			handler: function (response) {
				alert(response.razorpay_payment_id)
				alert(response.razorpay_order_id)
				alert(response.razorpay_signature)
			},
		  theme: {
        color: "rgb(30, 45, 125)"
      }
		}
		const paymentObject = new window.Razorpay(options)
		paymentObject.open()
	}
  return (
    <Layout>
      <div className="full-width flex checkout-container-main flex-column">
        <div className="full-width limit-width shift-down-below-nav-bar">
          <h1 className="large-margin large-padding xlarge-font light-bold-font  medium-margin-left">Confirm Order</h1>
          {props.checkout.products.map(product => (
            <ProductCard key={product.productId} {...product} img = {product.img.substr(2)} />
          ))}
        {props.checkout.products.length > 0 && <button className="buy-button button-primary medium-margin-left large-margin" onClick={displayRazorpay}>Proceed to Pay</button>}
        </div>
      </div>
    </Layout>
  );
}
const mapStateToProps = state => ({ checkout: state.checkout });

export default connect(mapStateToProps)(Checkout);
