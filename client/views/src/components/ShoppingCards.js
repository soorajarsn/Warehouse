import React from 'react'
import {shoppingCardContent} from './homePageData';
import {Link } from 'react-router-dom';
function Card(props) {
    return (
      <div className="shopping-card position-relative">
        <img className="full-img" src={props.img} alt="" />
        <div className="content-container position-absolute flex flex-column small-margin-top small-padding-left">
          <h5 className="medium-font">{props.title}</h5>
          <p className="no-margin">{props.description}</p>
          <Link to={props.link}>
            <button className="button-secondary medium-padding medium-padding-left medium-padding-right small-margin-top">{props.shopFor}</button>
          </Link>
        </div>
      </div>
    );
  }
function ShoppingCards() {
    return (
        <div className="shopping-card-container grid large-margin limit-width">
          {shoppingCardContent.map((item, index) => (
            <Card key={index} {...item} />
          ))}
        </div>
    )
}

export default ShoppingCards;
