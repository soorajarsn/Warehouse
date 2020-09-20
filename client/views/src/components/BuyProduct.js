import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Layout from "./Layout";
import Features from "./Features";
import ShoppingCards from "./ShoppingCards";
import { connect } from "react-redux";
import { logOut, getAddresses, deleteAddress, addToCart } from "../redux";
import { Redirect } from "react-router-dom";
import AddAddressForm from "./Form_addAddress";
import Axios from "axios";
import {Options} from './Cart';
function DropDown({ addressSelected, setAddressSelected, addresses, userLoggedIn, setRedirect, setToasterVisible }) {
  function toggleOpen(event) {
    if (!userLoggedIn) {
      setRedirect(true);
    } else {
      if (event.currentTarget.getAttribute("data-action") === "toggle-open") event.currentTarget.classList.toggle("open");
    }
    //removing toaster if available;
    setToasterVisible(false);
  }
  const showAddressPopover = () => {
    document.querySelector("#modal-address-new.add_form").setAttribute("aria-hidden", "false");
  };
  return (
    <div className="drop-down medium-margin-top" data-action="toggle-open" onClick={toggleOpen}>
      <div className="full-width selected item">
        <p>{addressSelected}</p>
      </div>
      <div className="items-container full-width">
        {addresses.map(address => (
          <div className="full-width item" data-action onClick={e => setAddressSelected(e.currentTarget.innerText)}>
            {address.zipCode}
          </div>
        ))}
        <div className="full-width item" data-action onClick={e => showAddressPopover()}>
          Add Address
        </div>
      </div>
      <i class="fas fa-caret-down"></i>
    </div>
  );
}
function Toaster({ error }) {
  useEffect(() => {
    document.querySelector(".toaster .info").setAttribute("aria-hidden", false); //to show transition using css;
  }, []);
  return (
    <div className="toaster position-fixed">
      <div className="xxxsmall-font info flex" aria-hidden={true}>
        <span>{error}</span>
      </div>
    </div>
  );
}
function BuyProduct(props) {
  const { productId } = props.match.params;
  const [product, setProduct] = useState({});
  const [addressSelected, setAddressSelected] = useState("Select");
  const [redirect, setRedirect] = useState(false);
  const [size, setSize] = useState("");
  const [toasterVisible, setToasterVisible] = useState(false);
  const [qty, setQty] = useState(1);
  useEffect(() => {
    Axios.get("/api/product/" + productId)
      .then(response => {
        setProduct(response.data.product);
      })
      .catch(err => {});
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    props.getAddresses();
  }, [props.getAddresses, props.userLoggedIn]);

  useEffect(() => {
    console.log("useEfffect run");
    if (props.addresses[0] && props.userLoggedIn) setAddressSelected(props.addresses[0].zipCode);
    else setAddressSelected("Select");
  }, [props.addresses, props.userLoggedIn]);

  function selectSize(event) {
    let current = event.currentTarget;
    if (current.getAttribute("data-action") === "true") {
      var selectedSize = document.querySelector("div.available-sizes .selected");
      if (selectedSize) selectedSize.classList.remove("selected");
      current.classList.add("selected");
      setSize(current.getAttribute("data-label"));
      if (!selectedSize) {
        //means the size was selected for the first time only
        document.querySelectorAll("button.tooltip").forEach(button => {
          button.classList.remove("tooltip");
          button.setAttribute("data-action", "true"); //now cart and buy button will do required action, if no size selected tooltip will be shown, but no action, because of condition put in handlers
        });
      }
    }
  }
  function handleQtyChange(event){
    setQty(event.target.value);
  }
  function handleAddToCart(event) {
    const button = event.currentTarget;
    if (button.getAttribute("data-action") !== "false") {
      if (props.userLoggedIn) {
        if (addressSelected === "Select") setToasterVisible(true);
        else {
          setToasterVisible(false);
          console.log("add to cart dispatching");
          props.addToCart({ id: productId, size, address: addressSelected,qty });
          props.history.push("/cart");
        }
      } else {
        setRedirect(true);
      }
    }
  }
  function handleBuyNow(event) {
    const button = event.currentTarget;
    if (button.getAttribute("data-action") !== "false") {
      if (props.userLoggedIn) {
        if (addressSelected === "Select") setToasterVisible(true);
        else {
          setToasterVisible(false);
        }
      } else {
        setRedirect(true);
      }
    }
  }
  return (
    <>
      {redirect ? (
        <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
      ) : (
        <Layout>
          <div>
            <main className="flex flex-column buy-product-main">
              <div className="full-width limit-width main-inner shift-down-below-nav-bar">
                <div className="main-content grid medium-margin-left medium-margin-right large-margin">
                  <div className="img-container-main grid">
                    {product.imageAddresses ? (
                      product.imageAddresses.map((src, index) => (
                        <div className="img-container">
                          <img src={src.substr(2)} alt="" />
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="img-container">
                          {/* <img src="/assets/4a50fb31-dff0-40cb-b24b-aa3c5793b1a01538643882906-Veni-Vidi-Vici-Women-Tops-7901538643882756-2.jpg" alt="" /> */}
                        </div>
                        <div className="img-container">
                          {/* <img src="/assets/4a50fb31-dff0-40cb-b24b-aa3c5793b1a01538643882906-Veni-Vidi-Vici-Women-Tops-7901538643882756-2.jpg" alt="" /> */}
                        </div>
                        <div className="img-container">
                          {/* <img src="/assets/f7485037-e1d1-4621-b70f-f09a3a400c8b1538643882868-Veni-Vidi-Vici-Women-Tops-7901538643882756-4.jpg" alt="" /> */}
                        </div>
                        <div className="img-container">
                          {/* <img src="/assets/e7121bdd-da21-4af7-bda4-c505eb4410681538643882885-Veni-Vidi-Vici-Women-Tops-7901538643882756-3.jpg" alt="" /> */}
                        </div>
                        <div className="img-container">
                          {/* <img src="/assets/c70beeda-241d-4d8a-933b-a62e100b12df1538643882852-Veni-Vidi-Vici-Women-Tops-7901538643882756-5.jpg" alt="" /> */}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="content medium-margin-left medium-margin-right">
                    {product.brand ? <h1 className="small-font medium-bold-font">{product.brand}</h1> : <h1 className="medium-bold-font loading loading-content"></h1>}
                    {product.name ? <p className="xxsmall-font color-darkGrey">{product.name}</p> : <p className="loading loading-content"></p>}
                    <p className="no-margin large-margin-top xxxsmall-font large-padding-top color-darkGrey">
                      <label className="regular-font xxxsmall-font">M.R.P: </label>
                      <del>
                        <i class="fas fa-rupee-sign"></i>
                        {product.price ? <span>{product.maxPrice || product.price}</span> : <span className="loading loading-content"></span>}
                      </del>
                    </p>
                    <p className="xxsmall-font no-margin xsmall-margin-top color-green">
                      <label className="regular-font xxxsmall-font ">Price: </label>
                      <i class="fas fa-rupee-sign xxxsmall-font"></i> {product.price ? <span>{product.price}</span> : <span className="loading loading-content"></span>}
                    </p>
                    <p className="xxxsmall-font no-margin xsmall-margin-top color-red">
                      <label>You Save: </label>
                      <i class="fas fa-rupee-sign"></i>
                      {product.price ? (
                        <span>
                          {(product.maxPrice || product.price) - product.price}(
                          {parseInt((((product.maxPrice || product.price) - product.price) / (product.maxPrice || product.price)) * 100)}%)
                        </span>
                      ) : (
                        <span className="loading loading-content"></span>
                      )}
                    </p>
                    <p className="xxxsmall-font color-darkGrey">inclusive of all taxes</p>
                    <div className="qty-container">
                      {product.stocks > 0 ? <div className="color-green xxsmall-font large-margin-top xsmall-padding">In Stock</div> : <div className="color-green xxsmall-font">Out Of Stocks</div>}
                      {product.stocks > 0 && <><label className="xxxsmall-font color-primary">Quantity: </label>
                      <Options maxQty={product.stocks} qty={qty} dataLabel="" handleQtyChange={handleQtyChange} /></>}
                    </div>
                    <div className="xxxsmall-font medium-bold-font large-margin-top large-padding-top">SELECT SIZES</div>
                    <div className="available-sizes flex medium-margin">
                      {product.sizeWiseStocks ? (
                        product.sizeWiseStocks.map(size => (
                          <div
                            key={size}
                            data-label={size.size}
                            className={"small-margin-left small-margin-right flex " + (size.stocks == 0 ? "fade" : "")}
                            data-action={!!size.stocks}
                            onClick={selectSize}>
                            {size.size}
                            <span className="stocks">{size.stocks}</span>
                          </div>
                        ))
                      ) : (
                        <span className="loading loading-size"></span>
                      )}
                    </div>
                    <div className="button-container large-margin-top flex small-padding-top">
                      <button className="button-primary small-margin small-margin-right tooltip" data-action="false" onClick={handleBuyNow}>
                        Buy Now <span className="tooltip-text regular-font xxxsmall-font size">Please Select Size</span>
                      </button>
                      <button className="button-secondary small-margin small-margin-left tooltip" data-action="false" onClick={handleAddToCart}>
                        Add to Cart <span className="tooltip-text regular-font xxxsmall-font size">Please Select Size</span>
                      </button>
                    </div>
                    <div className="small-margin delivery-options">
                      <div className="xxsmall-font medium-bold-font">Delivery Options</div>
                      <DropDown
                        addressSelected={addressSelected}
                        setAddressSelected={setAddressSelected}
                        getAddresses={props.getAddresses}
                        setRedirect={setRedirect}
                        addresses={props.addresses}
                        userLoggedIn={props.userLoggedIn}
                        setToasterVisible={setToasterVisible}
                      />
                    </div>
                    <ul className="medium-margin-top">
                      <li className="small-margin xxxsmall-font color-darkGrey">100% Original Products</li>
                      <li className="small-margin xxxsmall-font color-darkGrey">Free Delivery on order above Rs. 799</li>
                      <li className="small-margin xxxsmall-font color-darkGrey">Pay on delivery might be available</li>
                      <li className="small-margin xxxsmall-font color-darkGrey">Easy 30 days returns and exchanges</li>
                      <li className="small-margin xxxsmall-font color-darkGrey">Try & Buy might be available</li>
                    </ul>
                  </div>
                </div>
                <div className="medium-margin-left medium-margin-right large-margin-top large-padding-top">
                  <ShoppingCards />
                  <Features />
                </div>
              </div>
            </main>
          </div>
          <AddAddressForm editDefaultValues={{}} className="add_form" />
          {toasterVisible && ReactDOM.createPortal(<Toaster error="Please Select Delivery Options!!!" />, document.getElementById("toaster-container"))}
        </Layout>
      )}
    </>
  );
}
const mapStateToProps = state => ({ ...state.addresses, userLoggedIn: state.user.userLoggedIn });
const mapDispatchToProps = dispatch => {
  return {
    logOut: () => dispatch(logOut()),
    getAddresses: () => dispatch(getAddresses()),
    deleteAddress: body => dispatch(deleteAddress(body)),
    addToCart: body => dispatch(addToCart(body)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(BuyProduct);
