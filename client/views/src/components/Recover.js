import React, { useEffect, useRef } from "react";
import { Layout, RecoverPanel } from "./AuthenticationMenu";
import PrimaryLayout from "./Layout";
import "../css/login.css";
import Features from "./Features";
import { connect } from "react-redux";
import { recoverUser, recoverError } from "../redux";
import { Redirect } from "react-router-dom";
function Recover(props) {
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
              <RecoverPanel {...props} isPage={true} />
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
    recoverError: state.user.recoverError,
    recoverMsg: state.user.recoverMsg,
    userLoggingIn: state.user.userLoggingIn,
    userLoggedIn: state.user.userLoggedIn,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    recoverPassword: body => dispatch(recoverUser(body)),
    dispatchRecoverError: err => dispatch(recoverError(err)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Recover);
