import React, { useEffect, useRef, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import Layout from "./Layout";
import { logOut, getAddresses, deleteAddress, fetchOrders } from "../redux";
import { AngleDownSvg, CheckSvg, TimesSvg, NoOrdersSvg, NoAddressesSvg } from "./svg/icons";
import { connect } from "react-redux";
import Features from "./Features";
import ShoppingCards from "./ShoppingCards";
import AddAddressForm from "./Form_addAddress";
import Loader from "./Loader";
function hideMenu() {
  if (window.innerWidth < 700) {
    const menu = document.querySelector(".collection-menu-container");
    menu.setAttribute("aria-hidden", "true");
  }
}
function useEditFormValues() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [locality, setLocality] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  return [
    { firstName, lastName, locality, phone, city, zipCode, state, country },
    { setFirstName, setLastName, setPhone, setCity, setZipCode, setLocality, setState, setCountry },
  ];
}
function MenuItemsList(props) {
  return (
    <ul id="collection-filters" className="collections-container collection-filter-linklist large-padding-left large-padding-right">
      {props.menuItems.map(item => (
        <li key={item.title} onClick={hideMenu} className="small-padding">
          <Link to={item.link}>
            <button className={"no-padding small-margin xxxsmall-font flex justify-space-between " + item.className} aria-label={item.title}>
              <div>{item.title}</div>
              {item.className === "color-primary" && <CheckSvg className="small-margin-right" />}
            </button>
          </Link>
        </li>
      ))}
      <li className="small-padding">
        <button className="no-padding small-margin xxxsmall-font color-darkGrey" aria-label="logout" onClick={props.logOutUser}>
          Logout
        </button>
      </li>
    </ul>
  );
}
function MenuHeader(props) {
  return (
    <header className="filter-header large-padding-left large-padding-right flex small-padding justify-space-between">
      <div className="card-title">
        <h2 className="light-bold-font medium-font color-primary">My account</h2>
      </div>
      <div className="icon-container link" onClick={hideMenu}>
        <TimesSvg className="visible" />
      </div>
    </header>
  );
}
function MenuLayout(props) {
  return (
    <div className="collection-menu-container medium-margin-left medium-margin-right" aria-hidden="true">
      <div className="layout-section layout-section--secondary hidden-pocket full-width">
        <div className="card">{props.children}</div>
      </div>
    </div>
  );
}
function Menu(props) {
  let myOrdersColor = "color-primary";
  let myAddressesColor = "color-primary";
  if (props.pageName === "orders") myAddressesColor = "color-darkGrey";
  else myOrdersColor = "color-darkGrey";
  return (
    <MenuLayout>
      <MenuHeader />
      <div className="card-section medium-margin ">
        <MenuItemsList
          menuItems={[
            { title: "My Orders", link: "/account/orders", className: myOrdersColor },
            { title: "My Addresses", link: "/account/addresses", className: myAddressesColor },
          ]}
          logOutUser={props.logOutUser}
        />
      </div>
    </MenuLayout>
  );
}
function AddAddressButton({ children }) {
  const showAddressPopover = () => {
    document.querySelector("#modal-address-new.add_form").setAttribute("aria-hidden", "false");
  };
  return (
    <button className="button-primary large-margin-top small-padding large-padding-left large-padding-right light-bold-font" onClick={showAddressPopover}>
      {children}
    </button>
  );
}
function PlaceOrderButton({ children }) {
  return (
    <Link to="/products">
      <button className="button-primary large-margin-top small-padding large-padding-left large-padding-right light-bold-font">{children}</button>
    </Link>
  );
}
function EmptyCard({ pageName }) {
  let textIfNotAvailable = "";
  pageName === "orders" ? (textIfNotAvailable = "No orders yet") : (textIfNotAvailable = "No addresses added");
  return (
    <div className="product-collection large-margin large-padding">
      <div className="flex flex-column color-darkGrey">
        <div className="icon-container position-relative no-margin">
          {pageName === "orders" ? <NoOrdersSvg className="no-order-icon" /> : <NoAddressesSvg className="no-addresses-icon " />}
          <div className="empty-state-denoter color-white position-absolute xxxsmall-font flex">0</div>
        </div>
        <h2 className="xxsmall-font regular-font small-margin">{textIfNotAvailable}</h2>
        {pageName === "orders" ? <PlaceOrderButton>Place Your First Order</PlaceOrderButton> : <AddAddressButton>Add Your First Address</AddAddressButton>}
      </div>
    </div>
  );
}
function OrderCard({ product }) {
  return (
    <div className="product-card order-container">
      <div className="img-container">
        <img src={product.img.substr(2)} alt="" />
      </div>
      <div className="order-details data-container">
        <div className="xxxsmall-font light-bold-font color-primary xsmall-margin">{product.title}</div>
        <div className="xxxsmall-font light-bold-font color-green ">Arriving on October 18</div>
        <div className="xxxsmall-font xsmall-margin-top">
          <h4 className="color-primary light-bold-font">Shipping Address:</h4>
        </div>
        <address>
          <div className="data xxsmall-font color-darkGrey xsmall-margin">
            <span className="first-name">{product.address.firstName}</span> <span className="last-name">{product.address.lastName}</span>
          </div>
          <div className="data xsmall-font color-darkGrey xsmall-margin">
            <span className="locality">{product.address.locality}</span>, <span className="city">{product.address.city}</span>
          </div>
          <div className="data xsmall-font color-darkGrey xsmall-margin">
            <span className="zipcode">{product.address.zipCode}</span>, <span className="state">{product.address.state}</span>
          </div>
          <div className="data xsmall-font color-darkGrey xsmall-margin country">{product.address.country}</div>
          <div className="hidden phone">{product.address.phone}</div>
        </address>
      </div>
    </div>
  );
}
function OrderCardsContainer({ fetchOrders, products, loading }) {
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  return (
    <div className="position-relative">
      {products.length === 0 ? (
        <EmptyCard pageName="orders" />
      ) : (
        <div className="product-collection grid">
          {products.map((product, index) => (
            <OrderCard key={index} product={product} />
          ))}
        </div>
      )}
      {loading && <Loader />}
    </div>
  );
}
function AddressCard({ address, index, editSetters, deleteAddress }) {
  function showEditForm(event) {
    const button = event.target;
    const id = "address" + button.getAttribute("data-controls");
    const firstNameInput = document.querySelector(`#${id} span.first-name`);
    const lastNameInput = document.querySelector(`#${id} span.last-name`);
    const localityInput = document.querySelector(`#${id} span.locality`);
    const cityInput = document.querySelector(`#${id} span.city`);
    const zipCodeInput = document.querySelector(`#${id} span.zipcode`);
    const stateInput = document.querySelector(`#${id} span.state`);
    const countryInput = document.querySelector(`#${id} div.country`);
    const phoneInput = document.querySelector(`#${id} div.phone`);
    const isDefault = !!document.querySelector(`#${id} span.default`);
    document.querySelector("#modal-address-new.edit_form input[name=address-default]").checked = isDefault;
    document.querySelector("#modal-address-new.edit_form input[name=add-address_firstName]").classList.add("is-filled");
    document.querySelector("#modal-address-new.edit_form input[name=add-address_lastName]").classList.add("is-filled");
    document.querySelector("#modal-address-new.edit_form input[name=add-address_locality]").classList.add("is-filled");
    document.querySelector("#modal-address-new.edit_form input[name=add-address_phone]").classList.add("is-filled");
    document.querySelector("#modal-address-new.edit_form input[name=add-address_zipcode]").classList.add("is-filled");
    document.querySelector("#modal-address-new.edit_form input[name=add-address_city]").classList.add("is-filled");
    editSetters.setFirstName(firstNameInput.textContent);
    editSetters.setLastName(lastNameInput.textContent);
    editSetters.setLocality(localityInput.textContent);
    editSetters.setCity(cityInput.textContent);
    editSetters.setZipCode(zipCodeInput.textContent);
    editSetters.setState(stateInput.textContent);
    editSetters.setCountry(countryInput.textContent);
    editSetters.setPhone(phoneInput.textContent);
    document.querySelector("#modal-address-new.edit_form").setAttribute("aria-hidden", "false");
  }
  function dispatchDelete(event) {
    const addressId = event.target.getAttribute("data-controls");
    deleteAddress({ addressId });
  }
  return (
    <div id={"address" + address.zipCode} className="product-card">
      <div className="data-container flex flex-column small-padding medium-padding-left medium-padding-right position-relative">
        <div className="address-header xsmall-font light-bold-font color-primary medium-margin">
          {address.isDefault ? <span className="default">DEFAULT ADDRESS</span> : "ADDRESS " + (index + 1)}
        </div>
        <div className="data xxsmall-font color-darkGrey xsmall-margin">
          <span className="first-name">{address.firstName}</span> <span className="last-name">{address.lastName}</span>
        </div>
        <div className="data xsmall-font color-darkGrey xsmall-margin">
          <span className="locality">{address.locality}</span>, <span className="city">{address.city}</span>
        </div>
        <div className="data xsmall-font color-darkGrey xsmall-margin">
          <span className="zipcode">{address.zipCode}</span>, <span className="state">{address.state}</span>
        </div>
        <div className="data xsmall-font color-darkGrey xsmall-margin country">{address.country}</div>
        <div className="hidden phone">{address.phone}</div>
      </div>
      <div className="flex justify-space-between small-margin">
        <button className="no-padding medium-margin-left small-font color-secondary" data-action="Edit Address" data-controls={address.zipCode} onClick={showEditForm}>
          Edit
        </button>
        <button className="no-padding medium-margin-right small-font color-secondary" data-action="Delete Address" data-controls={address.zipCode} onClick={dispatchDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
function AddressCardsContainer({ addresses, loading, editSetters, deleteAddress }) {
  return (
    <div className="position-relative">
      {addresses.length === 0 ? (
        <EmptyCard pageName="addresses" />
      ) : (
        <div className="product-collection grid">
          {addresses.map((address, index) => (
            <AddressCard key={address.zipCode} address={address} index={index} deleteAddress={deleteAddress} editSetters={editSetters} />
          ))}
        </div>
      )}
      {loading && <Loader />}
    </div>
  );
}
function Account(props) {
  const { pageName } = props.match.params;
  let pageTitle = "";
  pageName === "orders" ? (pageTitle = "My Orders") : (pageTitle = "My Addresses");
  const [editValues, editSetters] = useEditFormValues();
  const showPageLinks = () => {
    const menu = document.querySelector(".collection-menu-container");
    menu.setAttribute("aria-hidden", "false");
  };

  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) {
      window.scrollTo(0, 0);
    } else didMountRef.current = true;
  }, []);

  return (
    <>
      {!props.userLoggedIn ? (
        <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
      ) : (
        <Layout>
          <main className="main account-main flex flex-column" role="main">
            <header className="page-path-header full-width limit-width small-margin shift-down-below-nav-bar">
              <div className="page-path-container medium-padding medium-margin-left color-darkGrey xxxsmall-font">Home > Account > {pageTitle}</div>
            </header>
            <div className="page-selector flex color-darkGrey full-width justify-space-between large-padding" onClick={showPageLinks}>
              <div className="xxsmall-font medium-margin-left">{pageTitle}</div>
              <div className="icon-container medium-margin-right">
                <AngleDownSvg />
              </div>
            </div>
            <div className="layout account-layout full-width limit-width ">
              <Menu logOutUser={props.logOut} pageName={pageName} />
              <div className="layout-section-primary medium-margin-right medium-margin-left">
                <div className="title-container large-padding medium-margin-left medium-margin-right flex justify-space-between">
                  <h1 className="color-primary medium-bold-font medium-font">{pageTitle}</h1>
                  {pageName === "orders" ? (
                    props.orders.products.length > 0 ? (
                      <PlaceOrderButton>Place More Orders</PlaceOrderButton>
                    ) : null
                  ) : props.addresses.length > 0 ? (
                    <AddAddressButton>Add new Address</AddAddressButton>
                  ) : null}
                </div>
                <hr className="no-margin" />
                {pageName === "orders" ? (
                  <OrderCardsContainer loading={props.orders.loading} products={props.orders.products} fetchOrders={props.fetchOrders} />
                ) : (
                  <AddressCardsContainer addresses={props.addresses} deleteAddress={props.deleteAddress} loading={props.loading} editSetters={editSetters} />
                )}
              </div>
            </div>
            <div className="medium-margin-left medium-margin-right">
              <ShoppingCards />
            </div>
          </main>
          <div className=" flex medium-padding-left medium-padding-right features-container large-padding-top">
            <Features />
          </div>
          {pageName === "addresses" && <AddAddressForm editDefaultValues={editValues} className="edit_form" />}
          {pageName === "addresses" && <AddAddressForm editDefaultValues={{}} className="add_form" />}
        </Layout>
      )}
    </>
  );
}
const mapStateToProps = state => ({ ...state.addresses, userLoggedIn: state.user.userLoggedIn, orders: state.orders });
const mapDispatchToProps = dispatch => {
  return {
    logOut: () => dispatch(logOut()),
    deleteAddress: body => dispatch(deleteAddress(body)),
    fetchOrders: () => dispatch(fetchOrders()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Account);
