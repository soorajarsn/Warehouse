import React, { useState, useLayoutEffect, useEffect } from "react";
import { loginUser, signupUser, recoverUser, loginError, signupError, recoverError } from "../redux";
import Loader from "./Loader";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
export function useInputWithWrapper({ type, panel, name, label, defaultValue }) {
  const [value, setValue] = useState("");
  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
    }
  }, [defaultValue]);
  const handleInputChange = e => {
    if (e.target.value) e.target.classList.add("is-filled");
    else e.target.classList.remove("is-filled");
    setValue(e.target.value);
  };
  const inputWithWrapper = (
    <div className="form__input-wrapper small-margin ">
      <input
        type={type}
        id={panel + "-" + name}
        className="form__field medium-padding-top"
        name={panel + "_" + name}
        value={value}
        onChange={e => {
          handleInputChange(e);
        }}
        autoComplete="off"
      />
      <label htmlFor={panel + "-" + name} className="form__floating-label position-absolute">
        {label}
      </label>
    </div>
  );
  return [value, inputWithWrapper];
}
function PopoverSecondary(props) {
  function selectPanel(event) {
    let accountPopover = document.querySelector("#account-popover");
    document.querySelector(".popover__panel.is-selected").classList.remove("is-selected");
    let id = event.target.getAttribute("aria-controls");
    let tobeSelected = document.querySelector(`#${id}`);
    let extra = 0;
    if (window.innerWidth >= 700) extra = 18;
    accountPopover.style.height = tobeSelected.querySelector(".popover__inner").scrollHeight + extra + "px";
    tobeSelected.classList.add("is-selected");
  }
  return (
    <div className="popover__secondary-action medium-margin">
      {props.actions.map(action => (
        <p className="no-margin" key={action.question + props.isPage}>
          {action.question}{" "}
          {action.isPage ? (
            <Link to={action.link}>
              <button aria-controls={action.ariaControls} className="link color-secondary">
                {action.act}
              </button>
            </Link>
          ) : (
            <button aria-controls={action.ariaControls} className="link color-secondary" onClick={selectPanel}>
              {action.act}
            </button>
          )}
        </p>
      ))}
    </div>
  );
}
function FormHeader({ title, legend, error, msg }) {
  return (
    <header className="popover__header">
      <h2 className="light-bold-font large-margin-top medium-font color-primary">{title}</h2>
      {!error && !msg && <p className="no-margin large-margin-top">{legend}</p>}
      {error && <p className="no-margin large-margin-top color-red">{error} </p>}
      {msg && <p className="no-margin large-margin-top color-green">{msg}</p>}
    </header>
  );
}
export function Layout(props) {
  return (
    <div id="account-popover" className="popover position-absolute" aria-hidden="true">
      <div className="popover__panel-list position-relative">{props.children}</div>
    </div>
  );
}
export function LoginPanel(props) {
  const [loginEmail, login_EmailInputWithWrapper] = useInputWithWrapper({ type: "email", panel: "login", name: "email", label: "Email" });
  const [loginPassword, login_PasswordInputWithWrapper] = useInputWithWrapper({ type: "password", panel: "login", name: "password", label: "Password" });
  const { userLoggingIn } = props;
  function handleFormSubmit(e) {
    if (!userLoggingIn) {
      if (loginEmail && loginPassword) props.login({ email: loginEmail, password: loginPassword });
      else props.dispatchLoginError("Please Fill in the details");
    }
    e.preventDefault();
  }
  return (
    <div id="header-login-panel" className="popover__panel popover__panel--default is-selected">
      <div className="popover__inner">
        <form acceptCharset="UTF-8" name="login" className="large-padding-left large-padding-right large-margin-top" onSubmit={e => handleFormSubmit(e)}>
          <FormHeader error={props.loginError} title="Login to my account" legend="Enter your e-mail and password" />
          {login_EmailInputWithWrapper}
          {login_PasswordInputWithWrapper}
          <button type="submit" className="button-primary button-full-width small-font small-padding xsmall-margin-top">
            Login
          </button>
        </form>
        <PopoverSecondary
          actions={[
            { question: "New customer?", ariaControls: "header-register-panel", act: "Create your account", link: "/register", isPage: props.isPage },
            { question: "Lost Password", ariaControls: "header-recover-panel", act: "recover password", link: "/recover", isPage: props.isPage },
          ]}
        />
      </div>
    </div>
  );
}
export function RecoverPanel(props) {
  const [recoverEmail, recover_EmailInputWithWrapper] = useInputWithWrapper({ type: "email", panel: "recover", name: "email", label: "Email" });
  function handleFormSubmit(e) {
    if (recoverEmail) props.recoverPassword({ email: recoverEmail });
    else props.dispatchRecoverError("Please Fill in the Email");
    e.preventDefault();
  }
  return (
    <div id="header-recover-panel" className="popover__panel popover__panel--sliding">
      <div className="popover__inner">
        <form acceptCharset="UTF-8" name="recover" className="large-padding-left large-padding-right large-margin-top" onSubmit={e => handleFormSubmit(e)}>
          <FormHeader error={props.recoverError} title="Recover password" legend="Enter your email:" msg={props.recoverMsg} />
          {recover_EmailInputWithWrapper}
          <button type="submit" className="button-primary button-full-width small-font small-padding xsmall-margin-top">
            Recover
          </button>
        </form>
        <PopoverSecondary
          actions={[{ question: "Remembered your password?", ariaControls: "header-login-panel", link: "/account/login", isPage: props.isPage, act: "Back to login" }]}
        />
      </div>
    </div>
  );
}
export function RegisterPanel(props) {
  const [registerFirstName, register_FirstNameInputWithWrapper] = useInputWithWrapper({ type: "text", panel: "register", name: "firstName", label: "First Name" });
  const [registerLastName, register_lastNameInputWithWrapper] = useInputWithWrapper({ type: "text", panel: "register", name: "lastName", label: "Last Name" });
  const [registerEmail, register_EmailInputWithWrapper] = useInputWithWrapper({ type: "email", panel: "register", name: "email", label: "Email" });
  const [registerPassword, register_PasswordInputWithWrapper] = useInputWithWrapper({ type: "password", panel: "register", name: "password", label: "Password" });
  function handleFormSubmit(e) {
    if (registerFirstName && registerLastName && registerEmail && registerPassword)
      props.signup({ firstName: registerFirstName, lastName: registerLastName, email: registerEmail, password: registerPassword });
    else props.dispatchSignupError("Please Fill in all the fields");
    e.preventDefault();
  }
  return (
    <div id="header-register-panel" className="popover__panel popover__panel--sliding">
      <div className="popover__inner">
        <form acceptCharset="UTF-8" name="create" className="large-padding-left large-padding-right large-margin-top" onSubmit={e => handleFormSubmit(e)}>
          <FormHeader error={props.signupError} title="Create my account" legend="Please fill in the information below:" />
          {register_FirstNameInputWithWrapper}
          {register_lastNameInputWithWrapper}
          {register_EmailInputWithWrapper}
          {register_PasswordInputWithWrapper}
          <button type="submit" className="button-primary button-full-width small-font small-padding xsmall-margin-top">
            Create my account
          </button>
        </form>
        <PopoverSecondary
          actions={[{ question: "Already have an account?", ariaControls: "header-login-panel", link: "/account/login", isPage: props.isPage, act: "Login here" }]}
        />
      </div>
    </div>
  );
}
function AuthenticationMenu(props) {
  function setLoginPanelHeight() {
    let accountPopover = document.querySelector("#account-popover");
    if (accountPopover) {
      if (window.screen.width < 700) accountPopover.style.height = window.screen.height - 3.5 * 16 + "px";
      else {
        let popoverInner = document.querySelector(".popover__panel.is-selected .popover__inner");
        if (popoverInner) accountPopover.style.height = popoverInner.scrollHeight + 18 + "px";
        accountPopover.style.maxHeight = window.screen.height - 80 + "px";
      }
    }
  }
  useLayoutEffect(() => {
    window.addEventListener("load", setLoginPanelHeight);
    window.addEventListener("resize", setLoginPanelHeight);
    return () => {
      document.removeEventListener("load", setLoginPanelHeight);
      document.removeEventListener("resize", setLoginPanelHeight);
    };
  }, []);
  return (
    <Layout {...props}>
      <LoginPanel {...props} />
      <RecoverPanel {...props} />
      <RegisterPanel {...props} />
      {props.userLoggingIn && <Loader />}
    </Layout>
  );
}

const mapStateToProps = state => {
  return {
    loginError: state.user.loginError,
    signupError: state.user.signupError,
    recoverError: state.user.recoverError,
    recoverMsg: state.user.recoverMsg,
    userLoggingIn: state.user.userLoggingIn,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    login: body => dispatch(loginUser(body)),
    dispatchLoginError: err => dispatch(loginError(err)),
    recoverPassword: body => dispatch(recoverUser(body)),
    dispatchRecoverError: err => dispatch(recoverError(err)),
    signup: body => dispatch(signupUser(body)),
    dispatchSignupError: err => dispatch(signupError(err)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AuthenticationMenu);
