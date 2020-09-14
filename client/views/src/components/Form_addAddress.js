import React, { useState } from "react";
import { TimesSvg, CheckSvg, AngleDownSvg } from "./svg/icons";
import { useInputWithWrapper } from "./AuthenticationMenu";
import { updateAddress, addAddress,getAddressError } from "../redux";
import {connect} from 'react-redux';

function AddAddressForm({ createAddress,updateAddress, error, dispatchError, editDefaultValues,className }) {
  const [firstName, firstNameInput] = useInputWithWrapper({ type: "text", panel: "add-address", label: "First Name", name: "firstName", defaultValue: editDefaultValues.firstName });
  const [lastName, lastNameInput] = useInputWithWrapper({ type: "text", panel: "add-address", label: "Last Name", name: "lastName", defaultValue: editDefaultValues.lastName });
  const [phone, phoneInput] = useInputWithWrapper({ type: "tel", panel: "add-address", label: "Phone", name: "phone", defaultValue: editDefaultValues.phone });
  const [locality, localityInput] = useInputWithWrapper({ type: "text", panel: "add-address", label: "Locality", name: "locality", defaultValue: editDefaultValues.locality });
  const [city, cityInput] = useInputWithWrapper({ type: "text", panel: "add-address", name: "city", label: "City", defaultValue: editDefaultValues.city });
  const [zipCode, zipCodeInput] = useInputWithWrapper({ type: "text", panel: "add-address", name: "zipcode", label: "ZipCode", defaultValue: editDefaultValues.zipCode });
  const [state, setState] = useState("Uttar Pradesh");
  const [country, setCountry] = useState("India");
  const [isDefault, setDefault] = useState(false);
  const hideAddressPopover = () => {
    document.querySelector("#modal-address-new."+className).setAttribute("aria-hidden", "true");
  };

  const handleSubmit = event => {
    if (!firstName || !lastName || !phone || !locality || !city || !zipCode || !state || !country) {
      document.querySelector(".modal__dialog").scrollTo(0, 0);
      dispatchError("Please fill in all the fields");
    } else {
      let body = { firstName, lastName, phone, locality, city, zipCode, state, country, isDefault };
      if(className === "edit_form")
        updateAddress({...body,addressId:editDefaultValues.zipCode});//to use zipCode as id to update address at backend;
      else  
        createAddress(body);
      hideAddressPopover();
    }
    event.preventDefault();
  };

  return (
    <div id="modal-address-new" className={"modal new-address-popover flex position-fixed "+className} aria-hidden="true">
      <div className="modal__dialog large-padding" role="dialog">
        <header className="modal-header position-relative medium-padding-left medium-padding-right medium-padding">
          <h3 className="color-primary medium-bold-font medium-font">Add a new address</h3>
          <button className="modal__close link" data-action="close-modal" onClick={hideAddressPopover}>
            <TimesSvg className="visible" />
          </button>
        </header>
        <hr />
        <div className="modal__content modal__content--ios-push large-padding-left large-padding-right large-margin-top">
          {error ? (
            <p className="xxsmall-font color-darkGrey color-red large-margin large-padding">{error}</p>
          ) : (
            <p className="xxsmall-font color-darkGrey large-margin large-padding"> Please fill in the information below</p>
          )}
          <form id="address_form_new" acceptCharset="UTF-8" onSubmit={handleSubmit}>
            {firstNameInput}

            {lastNameInput}

            {phoneInput}

            {localityInput}

            <div className="form__input-row flex">
              {cityInput}

              {zipCodeInput}
            </div>

            <div className="form__input-wrapper small-margin">
              <div className="select-wrapper select-wrapper--primary is-filled medium-padding-top position-relative">
                <AngleDownSvg />
                <select name="country" value={country} id="address-country" onChange={event => setCountry(event.target.value)}>
                  <option value="India">India</option>
                </select>
              </div>
              <label htmlFor="address-country" className="form__floating-label position-absolute">
                Country
              </label>
            </div>

            <div className="form__input-wrapper small-margin">
              <div className="select-wrapper select-wrapper--primary is-filled medium-padding-top position-relative">
                <AngleDownSvg />
                <select name="state" id="address-state" value={state} onChange={event => setState(event.target.value)}>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Kerala">Kerala</option>
                </select>
              </div>
              <label htmlFor="address-state" className="form__floating-label position-absolute">
                State
              </label>
            </div>

            <div className="form__input-wrapper checkbox__input-wrapper flex small-margin">
              <div className="checkbox-wrapper small-margin">
                <input type="checkbox" className="checkbox" name="address-default" id="address-new[default]" value="0" onChange={event => setDefault(event.target.checked)} />
                <CheckSvg />
              </div>

              <label htmlFor="address-new[default]" className="medium-margin-left">
                Set as default address
              </label>
            </div>

            <button className="form__submit button button-primary button-full-width">Add a new address</button>
          </form>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({...state.addresses});
const mapDispatchToProps = dispatch => {
  return {
    createAddress: body => dispatch(addAddress(body)),
    updateAddress: body => dispatch(updateAddress(body)),
    dispatchError: err => dispatch(getAddressError(err))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(AddAddressForm);
