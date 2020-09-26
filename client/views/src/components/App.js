import React, { useEffect } from "react";
import { loadUser, fetchCart } from "../redux";
import { connect } from "react-redux";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Account from "./Account";
import Products from "./Products";
import Login from "./Login";
import Recover from "./Recover";
import Register from "./Register";
import Index from "./Index";
import BuyProduct from "./BuyProduct";
import Cart from "./Cart";
import "../css/buyProduct.css";
import "../css/reset.css";
import "../css/theme.css";
import "../css/index.css";
import "../css/products.css";
import "../css/account.css";
import "../css/login.css";
import "../css/checkout.css";
import Checkout from "./Checkout";
function App(props) {
  const { userLoggedIn, loadUser } = props;
  useEffect(() => {
    loadUser();
  }, [userLoggedIn, loadUser]);
  useEffect(()=>{
    if(userLoggedIn){
      fetchCart();
    }
  },[])
  return (
    <Router>
      <Switch>
        <Route exact={true} path="/" render={props => <Index {...props} />} />
        <Route exact={true} path="/home" render={props => <Index {...props} />} />
        <Route path="/products" render={props => <Products {...props} />} />
        <Route path="/login" render={props => <Login {...props} />} />
        <Route path="/recover" render={props => <Recover {...props} />} />
        <Route path="/register" render={props => <Register {...props} />} />
        <Route path="/account/:pageName" render={props => <Account {...props} />} />
        <Route path="/buyProduct/:productId" render={props => <BuyProduct {...props} />} />
        <Route path="/cart" render={props => <Cart {...props} />} />
        {/* type indicates checkout the whole cart or buy a single product; type == cart || buyPage, id indicates id of product if type = buyPage otherwise null*/}
        <Route exact={true} path="/checkout/:type/:id?" render={props => <Checkout {...props} />} />
      </Switch>
    </Router>
  );
}
const mapStateToProps = state => ({ userLoggedIn: state.user.userLoggedIn });
const mapDispatchToProps = dispatch => ({
  loadUser:() => dispatch(loadUser()),
  fetchCart:() => dispatch(fetchCart())
});
export default connect(mapStateToProps, mapDispatchToProps)(App);
