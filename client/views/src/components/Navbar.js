import React from "react";
import { MobileProductMenu, DesktopProductMenu } from "./ProductMenu";
import { UserSvg, CartSvg, BarsSvg, TimesSvg } from "./svg/icons";
import AuthenticationMenu from "./AuthenticationMenu";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logOut } from "../redux";
function AccountMenu({ logOut }) {
  function hideMenu() {
    document.querySelector("#account-popover-logged-in").setAttribute("aria-hidden", "true");
  }
  return (
    <div id="account-popover-logged-in" className="account-menu position-absolute" aria-hidden="true" onClick={hideMenu}>
      <Link to="/account/orders">
        <div className="small-padding medium-padding-left medium-padding-right">Orders</div>
      </Link>
      <Link to="/account/addresses">
        <div className="small-padding medium-padding-left medium-padding-right">Addresses</div>
      </Link>
      <div className="small-padding medium-padding-left medium-padding-right" onClick={logOut}>
        Logout
      </div>
    </div>
  );
}
function Nav(props) {
  function showProductBar() {
    let menu = document.querySelector(".menu-container");
    menu.getAttribute("area-hidden") === "true" ? menu.setAttribute("area-hidden", "false") : menu.setAttribute("area-hidden", "true");
    var menuOpen = document.querySelector(".icon-close").classList.toggle("hidden");
    document.querySelector(".icon-hamburger").classList.toggle("hidden");
    if (!menuOpen) {
      document.querySelectorAll(".is-nested").forEach(nestedMenu => {
        nestedMenu.classList.remove("is-open");
      });
      document.querySelectorAll(".accordian-main ul.panel").forEach(accordianPanel => {
        accordianPanel.style.maxHeight = null;
        accordianPanel.parentNode.setAttribute("area-expanded", "false");
      });
    }
  }
  function showPopover(userLoggedIn) {
    if ((userLoggedIn && window.innerWidth >= 700) || !userLoggedIn) {
      let accountPopover;
      userLoggedIn ? (accountPopover = document.querySelector("#account-popover-logged-in")) : (accountPopover = document.querySelector("#account-popover"));
      let status = accountPopover.getAttribute("aria-hidden");
      let newStatus;
      status === "false" ? (newStatus = "true") : (newStatus = "false");
      accountPopover.setAttribute("aria-hidden", newStatus);
      if (!userLoggedIn && newStatus === "false") {
        //these statements are specific to authentication popover only
        document.querySelector(".popover__panel.is-selected").classList.remove(".is-selected");
        document.querySelector(".popover__panel--default").classList.add(".is-selected");
      }
    }
  }
  return (
    <div className="position-relative">
      <div className="navbar-container flex xsmall-padding position-fixed">
        <nav className="large-padding-right large-padding-left limit-width">
          <div className="logo-and-cart-container flex justify-space-between">
            <div className="logo-and-bar-container flex">
              <button className="bars large-font flex no-padding" aria-label="show-hidden-menu" onClick={showProductBar}>
                <TimesSvg />
                <BarsSvg />
              </button>
              <div className="logo-container small-margin-left">
                <Link to="/home">
                  <img className="logo full-img" src="/assets/logo_4031f3e7-60f6-44da-98f7-3e8b9320ef7f_175x@2x.webp" alt="logo" />
                </Link>
              </div>
            </div>
            <div className="search-bar-container xsmall-margin-top hidden">
              <form className="flex">
                <div className="input-container full-height">
                  <input id="search-product" type="text" placeholder="Search..." className="full-width full-height small-padding-left xsmall-font" />
                  <label className="hidden" htmlFor="search-product">
                    Search Products
                  </label>
                </div>
                <button className="button-primary full-height" aria-label="submit">
                  <i className="fas fa-search"></i>
                </button>
              </form>
            </div>
            <div className="profile-and-cart-container flex">
              <div className="user-container">
                <div className="link" onClick={() => showPopover(props.userLoggedIn)}>
                  <Link to="/account/orders/" className="mobile-view">
                    <UserSvg className="small-margin-right " />
                  </Link>
                  <UserSvg className="small-margin-left tablet-and-desktop-view" />
                  <div className="user hidden flex large-padding-right large-padding-left">
                    <div className="flex flex-column">
                      {props.userLoggedIn ? <span className="xxxsmall-font">{props.userName}</span> : <span className="xxxsmall-font">Login / Signup</span>}
                      <div className="xxsmall-font flex medium-bold-font">My account</div>
                    </div>
                    <i className="fas fa-angle-down xsmall-margin-left"></i>
                  </div>
                </div>
                {!props.userLoggedIn ? <AuthenticationMenu /> : <AccountMenu logOut={props.logOut} />}
              </div>
              <Link to="/cart">
                <div className="cart-container flex">
                  <div className="link flex">
                    <div className="cart-icon-container position-relative">
                      <CartSvg />
                      <div className="no-of-items-container flex bold-font position-absolute">1</div>
                    </div>
                    <span className="cart small-padding-left xxsmall-font medium-bold-font hidden">Cart</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          <div className="search-bar-container xsmall-margin-top">
            <form className="flex">
              <div className="input-container full-height">
                <input type="text" placeholder="Search..." className="full-width full-height small-padding-left small-font" />
              </div>
              <button className="button-primary full-height" aria-label="search-products">
                <i className="fas fa-search"></i>
              </button>
            </form>
          </div>
        </nav>
      </div>
      <MobileProductMenu />
      <DesktopProductMenu />
    </div>
  );
}

const mapStateToProps = state => {
  return {
    userLoggedIn: state.user.userLoggedIn,
    userLoggingIn: state.user.userLoggingIn,
    userName: state.user.userName,
    userId: state.user.userId,
  };
};
const mapDispatchToProps = {
  logOut,
};

export default connect(mapStateToProps, mapDispatchToProps)(Nav);
