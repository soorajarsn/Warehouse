import React, { useEffect, useRef } from "react";
import { LoginPanel, Layout } from "./AuthenticationMenu";
import PrimaryLayout from "./Layout";
import Features from "./Features";
import { connect } from "react-redux";
import { loginUser, loginError } from "../redux";
import { Redirect } from "react-router-dom";
import Loader from "./Loader";
function Login(props) {
  const { userLoggingIn } = props;

  useEffect(() => {
   window.scrollTo(0,0);
  }, []);

  useEffect(() => {
    if (userLoggingIn) document.querySelector("body").classList.add("clip-body");
    else document.querySelector("body").classList.remove("clip-body");
  }, [userLoggingIn]);

  return (
    <>
      {props.userLoggedIn ? (
        <Redirect to={(props.location.state && props.location.state.from) || props.history.goBack()} />
      ) : (
        <>
          <PrimaryLayout>
            <main className="login-panel-main full-width flex">
              <Layout>
                <LoginPanel {...props} isPage={true} />
              </Layout>
            </main>
            <div className="flex feature-container medium-padding-left medium-padding-right">
              <Features />
            </div>
          </PrimaryLayout>
          {userLoggingIn && <Loader fullPageLoader />}
        </>
      )}
    </>
  );
}
const mapStateToProps = state => {
  return {
    loginError: state.user.loginError,
    userLoggingIn: state.user.userLoggingIn,
    userLoggedIn: state.user.userLoggedIn,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    login: body => dispatch(loginUser(body)),
    dispatchLoginError: err => dispatch(loginError(err)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);
