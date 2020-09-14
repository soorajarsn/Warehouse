import React, { useEffect, useRef } from "react";
import qs from "qs";
import Layout from "./Layout";
import { fetchProducts } from "../redux";
import { AngleDownSvg, CheckSvg, FilterSvg, TimesSvg } from "./svg/icons";
import { connect } from "react-redux";
import Loader from "./Loader";
import { Link } from "react-router-dom";
const menuData = {
  men: ["Tshirts", "Casual Shirts", "Formal Shirts", "Sweaters", "Rain Jackets", "Sleepwear and Longwear"],
  women: ["Kurtas and Suits", "Kurtis", "Tops", "Ethnic Dresses", "Tshirts", "Bras and Lingerie Sets"],
  electronics: ["Headphones", "Speakers", "Amplifiers", "Mobiles", "Subwoofers", "PCs"],
};
function showCollectionExpanded(e) {
  let button = e.target;
  if (!button.getAttribute("aria-controls")) button = button.parentNode;
  let id = button.getAttribute("aria-controls");
  let ariaExpanded = button.getAttribute("aria-expanded");
  if (ariaExpanded === "true") {
    document.querySelector(`#${id}`).style.height = "0";
    document.querySelector(`#${id}`).setAttribute("aria-hidden", "true");
    button.setAttribute("aria-expanded", "false");
  } else {
    let checkboxListHeight = "11.9rem";
    if (window.innerWidth < 1000) checkboxListHeight = "14.2rem";
    id === "filter-4" ? (document.querySelector(`#${id}`).style.height = "7.6rem") : (document.querySelector(`#${id}`).style.height = checkboxListHeight);
    document.querySelector(`#${id}`).setAttribute("aria-hidden", "false");
    button.setAttribute("aria-expanded", "true");
  }
}
function ApplicableCollectionFilters(props) {
  return (
    <ul id="collection-filters" className="collections-container collection-filter-linklist large-padding-left large-padding-right" aria-hidden="true">
      {props.collections.map(collection => (
        <li key={collection.title}>
          <button className="no-padding xsmall-margin" data-action="toggle-collapsible" aria-controls={collection.id} aria-expanded="false" onClick={showCollectionExpanded}>
            {collection.title} <AngleDownSvg />
          </button>
          <div id={collection.id} className="collection-filter-collapsible" aria-hidden="true">
            <ul className="collection-filter-linklist">
              {collection.collectionItems.map(item => (
                <li key={item} className="xxxsmall-font xsmall-margin xsmall-margin-left">
                  <a href={`/products?productClass=${collection.collectionClass}&subCategory=${item}`}>{item} (n)</a>
                </li>
              ))}
              <li className="xxxsmall-font xsmall-margin xsmall-margin-left">
                <a href={`/products?productClass=${collection.collectionClass}`}>See All (m)</a>
              </li>
            </ul>
          </div>
        </li>
      ))}
    </ul>
  );
}
function ApplicableCheckboxFilters(props) {
  return (
    <div className="collection-filter-grounp-list collection-filter-group-list--ordered ">
      {props.filters.map(filter => (
        <div key={filter.title} className="collection-filter-group large-padding large-padding-left large-padding-right ">
          <button className="no-padding xsmall-margin collection-filter-group-name link" aria-controls={filter.id} aria-expanded="false" onClick={showCollectionExpanded}>
            {filter.title} <AngleDownSvg />
          </button>
          <div id={filter.id} className="collection-filter-collapsible" aria-hidden="true">
            <ul className="collection-filter-checkbox-list">
              {filter.filterValues.map(filterValue => (
                <li key={filterValue} className="collection-filter-checkbox xxxsmall-font xsmall-margin xsmall-margin-left">
                  <div className="checkbox-wrapper">
                    <input type="checkbox" className="checkbox" id={filterValue} name={filter.title.toLowerCase()} data-action="toggle-tag" />
                    <CheckSvg />
                  </div>
                  <label className="small-margin-left" htmlFor={filterValue}>
                    {filterValue}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
function MenuHeader(props) {
  function hideFilters(props) {
    const menu = document.querySelector(".collection-menu-container");
    menu.setAttribute("aria-hidden", "true");
    // document.querySelector("header.filter-header .icon-container .icon-close").classList.add("visible");
  }
  return (
    <header className="filter-header large-padding-left large-padding-right flex small-padding">
      <div className="icon-container link" onClick={hideFilters}>
        <TimesSvg className="visible" />
      </div>
      <div className="card-title">
        <h2 className="light-bold-font large-font color-primary medium-margin-left">Fitlers</h2>
      </div>
    </header>
  );
}
function CollectionSelector() {
  function showCollections(e) {
    let button = e.target;
    if (!button.getAttribute("aria-controls")) button = button.parentNode;
    let id = button.getAttribute("aria-controls");
    let ariaExpanded = button.getAttribute("aria-expanded");
    if (ariaExpanded === "true") {
      document.querySelector(`#${id}`).setAttribute("aria-hidden", "true");
      button.setAttribute("aria-expanded", "false");
    } else {
      document.querySelector(`#${id}`).setAttribute("aria-hidden", "false");
      button.setAttribute("aria-expanded", "true");
    }
  }
  return (
    <button
      className="accordian large-padding large-padding-left large-padding-right light-bold-font"
      aria-controls="collection-filters"
      aria-expanded="false"
      onClick={showCollections}>
      Select a category <AngleDownSvg />
    </button>
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
function FilterMenu(props) {
  return (
    <MenuLayout>
      <MenuHeader />
      <div className="card-section medium-margin ">
        <p className="color-primary light-bold-font xxsmall-font small-padding large-padding-left large-padding-right">COLLECTIONS</p>
        <CollectionSelector />
        <ApplicableCollectionFilters
          collections={[
            { id: "filter-0", collectionClass: "men", title: "Men's Fashion", collectionItems: menuData.men },
            { id: "filter-1", collectionClass: "women", title: "Women's Collection", collectionItems: menuData.women },
            { id: "filter-2", collectionClass: "electronics", title: "Ellectronics Store", collectionItems: menuData.electronics },
          ]}
        />
      </div>
      <hr />
      <div className="card-section medium-margin">
        <p className="color-primary light-bold-font xxsmall-font small-padding title-secondary large-padding-left large-padding-right">FILTERS</p>
        <ApplicableCheckboxFilters
          filters={[
            {
              id: "filter-3",
              title: "Price",
              filterValues: ["Rs. 0 to 100", "Rs. 100 to 250", "Rs. 250 to 500", "Rs. 500 to 800", "Rs. 800 to 1000", "Rs. 1000 to 1500", "Rs. 1500 to 2500", "Above Rs. 2500"],
            },
            { id: "filter-4", title: "Size", filterValues: ["S", "M", "L", "XL"] },
          ]}
        />
      </div>
    </MenuLayout>
  );
}
function Products(props) {
  let queryString = qs.parse(props.location.search, { ignoreQueryPrefix: true });
  let productClass = queryString.productClass;
  let category = queryString.category;
  let subCategory = queryString.subCategory;
  const { fetchProducts } = props;
  let productClassBasedPageTitle = "";
  productClass === "men"
    ? (productClassBasedPageTitle = "Men's Fashion")
    : productClass === "women"
    ? (productClassBasedPageTitle = "Women's Collection")
    : (productClassBasedPageTitle = "Electronic's Store");
  if (!productClass && !category && !subCategory) productClassBasedPageTitle = "All Collections";
  const showFilters = () => {
    const menu = document.querySelector(".collection-menu-container");
    menu.setAttribute("aria-hidden", "false");
    // document.querySelector("header.filter-header .icon-container .icon-close").classList.add("visible");
  };
  useEffect(() => {
    console.log(productClass, category, subCategory);
    fetchProducts(productClass, category, subCategory);
  }, [productClass, category, subCategory, fetchProducts]);
  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) {
      window.scrollTo(0, 0);
    } else didMountRef.current = true;
  });
  function handleEnter(event, loading) {
    if (!loading) {
      const ariaLabel = event.target.getAttribute("aria-label");
      if (ariaLabel) {
        document.querySelector(`#product${ariaLabel} .button-container`).setAttribute("aria-hidden", "false");
      }
    }
  }
  function handleLeave(event, loading) {
    if (!loading) {
      const ariaLabel = event.target.getAttribute("aria-label");
      if (ariaLabel) {
        document.querySelector(`#product${ariaLabel} .button-container`).setAttribute("aria-hidden", "true");
      }
    }
  }
  return (
    <Layout>
      <main className="main products-main flex flex-column" role="main">
        <header className="page-path-header full-width limit-width small-margin shift-down-below-nav-bar">
          <div className="page-path-container medium-margin-left medium-padding color-darkGrey xxxsmall-font">
            Home {productClass && `> ${productClass}`}
            {subCategory && ` > ${subCategory}`}
          </div>
        </header>
        <div className="layout products-layout full-width limit-width ">
          <FilterMenu />
          <div className="layout-section-primary medium-margin-right">
            <div className="denoter-img">
              <img src="/assets/women-sport-product-hero.jpeg" className="full-img" alt="" />
            </div>
            <div className="title-container large-padding medium-margin-left medium-margin-right">
              <h1 className="color-primary medium-bold-font medium-font">
                {(subCategory && subCategory[0].toUpperCase() + subCategory.substr(1, subCategory.length)) ||
                  (category && category[0].toUpperCase() + category.substr(1, category.length)) ||
                  productClassBasedPageTitle}
              </h1>
              <p className="color-darkGrey xxxsmall-font">78 products</p>
            </div>
            <div className="secondary-menu-container flex color-darkGrey full-width justify-space-between medium-padding link">
              <div className="filter flex medium-margin-left" onClick={showFilters}>
                <FilterSvg /> <span className="small-margin-left">Filter</span>
              </div>
              <div className="sort-by flex medium-margin-right medium-margin-left link">
                <span className="small-margin-right">Sort by</span>
                <AngleDownSvg />
              </div>
            </div>
            <div className="product-collection grid">
              {props.products.map(product => (
                <div
                  id={"product" + product._id}
                  className="product-card link"
                  onMouseOver={e => handleEnter(e, props.loading)}
                  aria-label={product._id}
                  key={product._id}
                  onMouseLeave={e => handleLeave(e, props.loading)}>
                  <div className="img-container" aria-label={product._id}>
                    <Link to={"/buyProduct/" + product._id}>
                      <img src={product.imgsrc && product.imgsrc.substr(2)} className="full-img" alt="" aria-label={product._id} />
                    </Link>
                  </div>

                  <div className="data-container flex flex-column small-padding position-relative" aria-label={product._id}>
                    <Link to={"/buyProduct/" + product._id}>
                      <div className="brand-name xsmall-font light-bold-font small-padding-left small-padding-right xsmall-margin" aria-label={product._id}>
                        {product.brand && product.brand.toUpperCase()}
                      </div>
                      <div className="name xxsmall-font color-darkGrey small-padding-left small-padding-right xsmall-margin" aria-label={product._id}>
                        {product.name}
                      </div>
                      <div className="price xsmall-font light-bold-font small-padding-left small-padding-right xsmall-margin" aria-label={product._id}>
                        {product.price && "Rs. " + product.price}
                      </div>
                      <div className="reviews small-padding-left small-padding-right " aria-label={product._id}></div>
                    </Link>
                    {props.loading && <Loader />}
                    <div className="button-container flex flex-column xsmall-padding" aria-label={product._id} aria-hidden="true">
                      <Link to={"/buyProduct/" + product._id} className="full-width flex">
                        <button className="button-primary xsmall-margin" aria-label={product._id}>
                          Buy Now
                        </button>
                      </Link>
                      <button className="button-primary xsmall-margin" aria-label={product._id}>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
const mapStateToProps = state => ({ ...state.products });
const mapDispatchToProps = {
  fetchProducts,
};
export default connect(mapStateToProps, mapDispatchToProps)(Products);
