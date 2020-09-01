import React,{useEffect,useRef} from "react";
import Layout from "./Layout";
import { Link } from "react-router-dom";
import { categories, deals } from "./homePageData";
import Features from './Features';
import ShoppingCards from './ShoppingCards';
function Hero() {
  return (
    <div className="hero-container position-relative shift-down-below-nav-bar">
      <img className="full-img mobile-view" src="/assets/hero-section-4.jpg" alt="" />
      <img className="full-img desktop-view" src="/assets/hero-section-5.jpg" alt="" />
      <img className="full-img tablet-view" src="/assets/hero-section-6.jpg" alt="" />
      <div className="title-shop-button-container position-absolute full-width full-height flex flex-column tablet-view-flex">
        <div className="medium-margin-left medium-margin-right">
          <h1 className="xlarge-font">Comfortable, Casual Plus Size Clothing for Women</h1>
          <p className="no-margin">Discover the brand new Collection</p>
          <Link to="/products/?productClass=women">
            <button className="button-primary large-padding-left large-padding-right medium-font small-margin-top">Shop Now</button>
          </Link>
        </div>
      </div>
      <div className="title-shop-button-container position-absolute full-width full-height flex flex-column  mobile-view-flex  desktop-view-flex">
        <h1 className="xlarge-font">Comfortable, Casual Plus Size Clothing for Women</h1>
        <p className="no-margin">Discover the brand new Collection</p>
        <Link to="/products/?productClass=women">
          <button className="button-primary large-padding-left large-padding-right medium-font small-margin-top small-padding">Shop Now</button>
        </Link>
      </div>
    </div>
  );
}

function Category(props) {
  return (
    <Link to={props.link}>
      <div className="category-img-title-container flex flex-column small-margin-left small-margin-right link transform-img-on-hover">
        <div className="category-img-container">
          <img className="full-img" src={props.img} alt="" />
        </div>
        <div className="category-title-container flex">
          <h3 className="small-font color-black light-bold-font">
            {props.title}
            <i className="fas fa-long-arrow-alt-right xxsmall-font xsmall-margin-left hidden"></i>
          </h3>
        </div>
      </div>
    </Link>
  );
}

function ProductCard(props) {
  return (
    <Link to={props.link}>
      <div className="product-card medium-padding-left medium-padding-right medium-padding link">
        <div className="product-img-container">
          <img className="full-img" src={props.img} alt="" />
        </div>
        <div className="product-details-container flex flex-column">
          <p className="xxsmall-font no-margin xsmall-margin-top color-black">{props.productTitle}</p>
          <p className="product-description no-margin">{props.description}</p>
        </div>
      </div>
    </Link>
  );
}
function SingleDealsContainer(props) {
  let productClass = '';
  props.title === "Men's Clothing" ? productClass = 'men' : props.title === "Women's Clothing" ? productClass = 'women' : productClass = 'electronics'
  return (
    <div className="single-deals-container large-margin">
      <div className="deal-header small-padding flex small-padding-left small-padding-right">
        <div className="title medium-font medium-bold-font">{props.title}</div>
        <Link to={'/products?productClass='+productClass}><button className="button-primary">View More</button></Link>
      </div>
      <div className="product-cards-container grid">
        {props.products.map((item, index) => (
          <ProductCard key={index} {...item} />
        ))}
      </div>
    </div>
  );
}
function About() {
  return (
    <div className="about-container medium-margin-right medium-margin-left large-margin flex flex-column">
      <h2 className="large-font medium-bold-font">About Warehouse</h2>
      <p className="medium-margin-top">
        Our mission statement is to provide the absolute best customer experience available in the Audio/Video industry without exception. We choose to only sell the best
        performing products in the world, learning them inside and out to ensure your experience with our organization and the products we supply are second to none. HiDEF
        Lifestyle is one of the fastest growing Audio and Video retailers in the United States.
      </p>
      <Link to="/products">
        <button className="button-primary medium-padding small-padding-left small-padding-right large-margin">Discover Our Products</button>
      </Link>
    </div>
  );
}
function Index(props) {
  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) {
      window.scrollTo(0,0);
    } else didMountRef.current = true
  },[]);
  return (
    <Layout>
      <Hero />

      <div className="main flex flex-column medium-margin-left medium-margin-right medium-margin-top">
        <ShoppingCards />
        <div className="popular-categories-container full-width medium-margin-top limit-width">
          <h2 className="xlarge-font large-margin">Popular Categories</h2>
          <div className="category-container flex">
            {categories.map((item, index) => (
              <Category key={index} {...item} />
            ))}
          </div>
        </div>

        <div className="all-deals-container full-width limit-width">
          {deals.map((item, index) => (
            <SingleDealsContainer key={index} {...item} />
          ))}
        </div>

        <About />
        
        <Features />
      </div>
    </Layout>
  );
}

export default Index;
