import React, { useEffect, useRef } from "react";
import { Layout, RegisterPanel } from "./AuthenticationMenu";
import PrimaryLayout from "./Layout";
import "../css/login.css";
import Features from "./Features";
import { connect } from "react-redux";
import { signupError, signupUser } from "../redux";
import {Redirect} from 'react-router-dom';
function Register(props) {
  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) {
      window.scrollTo(0, 0);
    } else didMountRef.current = true;
  });
  return (
    <>
      {props.userLoggedIn ? (
        <Redirect to="/" />
      ) : (
        <PrimaryLayout>
          <main className="login-panel-main full-width flex">
            <Layout>
              <RegisterPanel {...props} isPage={true} />
            </Layout>
          </main>
          <div className="flex feature-container medium-padding-left medium-padding-right">
            <Features />
          </div>
        </PrimaryLayout>
      )}
    </>
  );
}
const mapStateToProps = state => {
  return {
    signupError: state.user.signupError,
    userLoggingIn: state.user.userLoggingIn,
    userLoggedIn: state.user.userLoggedIn,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    signup: body => dispatch(signupUser(body)),
    dispatchSignupError: err => dispatch(signupError(err)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Register);
