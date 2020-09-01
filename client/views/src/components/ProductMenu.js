import React from 'react'
import {FacebookSvg, InstagramSvg, PinterestSvg, LinkedInSvg, MailBoxSvg, MobileSvg, AngleDownSvg} from './svg/icons';
import { Link } from 'react-router-dom';
function SlidingFromLeftAccordian(props){
    function showPanel(event){
        let id;
        if(!event.target.getAttribute('area-controls'))
            id = event.target.parentNode.getAttribute('area-controls');
        else
            id = event.target.getAttribute('area-controls');
        document.querySelector(`#${id}`).classList.toggle('is-open');
    }
    return (<div className="sliding-left-accordian medium-margin full-width flex justify-space-between link" area-controls={props.device+"_"+props.id} onClick={(event)=>showPanel(event)}>{props.title} <i className="fas fa-angle-right"></i></div>)
}
function SocialMediaCard(props){
    return (<div className="medium-margin flex link"><props.SocialMediaIcon />{props.socialMediaName}</div>)
}
function HandleClickOnAccordian(event){
    let panel;
    if(!event.target.classList.contains('accordian')){
        let parent = event.target.parentNode;
        if(!parent.classList.contains('accordian')){
            panel = parent.parentNode.nextElementSibling
        }
        else
            panel = parent.nextElementSibling;
    }
    else
        panel = event.target.nextElementSibling;

    if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
        panel.parentNode.setAttribute('area-expanded','false');
    } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
        panel.parentNode.setAttribute('area-expanded','true');
    }
}
function Accordian(props){
    return (
        <div className="accordian-main medium-padding medium-bold-font" area-expanded='false'>
            <div className="accordian flex justify-space-between link full-width" onClick={(event) => HandleClickOnAccordian(event)} >
                    <div className="icon-and-content">
                        {props.title}
                    </div>
                    <div className="drop-down">
                        <AngleDownSvg />
                    </div>
            </div>
            <ul className="panel">
                    {props.subCategories.map((subCategory,index) => <li key={index} className="small-margin xsmall-font regular-font"><Link to={'/products?productClass='+props.productClassQuery+"&subCategory="+subCategory}>{subCategory}</Link></li>)}
            </ul>
        </div>
    )
}
function MenuBackButton(){
    function removePanel(event){
        event.target.parentNode.parentNode.classList.remove('is-open');
    }
    return (
       <>
            <div className="back-button-container link full-width small-padding medium-margin-left medium-margin-right medium-margin-top" onClick={removePanel}>
                <i className="fas fa-angle-left medium-margin-right"></i>Back
            </div>
            <hr/>
       </>
    )
}
function ProductClass(props){
    return (
        <div className="productClass-panel-container">
            <MenuBackButton />
            <div className="accordian-container medium-margin-left medium-margin-right">
                {props.productClass.products.map((product,index) => <Accordian key={index} productClassQuery = {props.productClass.productClassQuery} title={product.category} subCategories={product.subCategories} />)}
            </div>
        </div>
    )
}
function NestedProductClasses(props){
    return (
        <div>
            <MenuBackButton />
            <div className="product-bar-container flex flex-column medium-margin-left medium-margin-right regular-font">
                {props.productClasses.map((item,index)=><SlidingFromLeftAccordian key={item.id} id={item.id} title={item.productClass} device={"mobile"}/>)}
            </div>
        </div>
    )
}
let menuItems = [
    {id:'all_product',name:'All Products'},
    {id:'new_arrivals',name:'New Arrivals'},
    {id:'men_fashion',name:"Men's Fashion"},
    {id:'women_fashion',name:"Women's Fashion"},
    {id:'electronics_store',name:"Electronics Store"}
];
let panelDataForAllProducts = [
    {
        id:'men_fashion',
        productClass:"Men's Fashion",
        productClassQuery:'men',
        products:[
            {
                category:'TopWear',
                subCategories:['Tshirts','Casual Shirts','Formal Shirts','Sweaters','Rain Jackets']
            },{
                category:'BottomWear',
                subCategories:['Jeans','Casual Trousers','Formal Trousers','Shorts','Track Pants and Joggers']
            },{
                category:'Innerwear and Sleepwear',
                subCategories:['Briefs and Trunks','Boxers','Vests','Sleepwear and Longwear','Thermals']
            }
        ]
    },{
        id:'women_fashion',
        productClassQuery:'women',
        productClass:"Women's Fashion",
        products:[
            {
                category:'Indian and Fushion Wear',
                subCategories:['Kurtas and Suits','Kurtis', 'Tunics and Tops','Ethnic Dresses','Skirts and Palazzos','Sarees and Blouses','Lehenga Cholis']
            },{
                category:'Western Wear',
                subCategories:['Dresses and Jumpsuits','Tops', 'Tshirts', 'Shirts','Shorts and Skirts','Trousers and Capris','Jeans and Joggins']
            },{
                category:'Lingerie and Sleepwear',
                subCategories:['Bras and Lingerie Sets','Briefs','Shapewear','Sleepwear and Loungwear']
            }
        ]
    },{
        id:'electronics_store',
        productClassQuery:'electronics',
        productClass:'Electronics',
        products:[
            {
                category:'Audio',
                subCategories:['Headphones','Speakers','Amplifiers','Ear buds','Subwoofers']
            },
            {
                category:'Mobiles',
                subCategories:['iPhones','Vivo','Oppo','Redmi','Realme']
            },{
                category:"LapTops",
                subCategories:['Gaming Laptops','Desktop PCs']
            }
        ]
    }
]
let socialLinks = [
    {
        SocialMediaIcon:FacebookSvg,
        socialMediaName:"Facebook"
    },{
        SocialMediaIcon:InstagramSvg,
        socialMediaName:"Instagram"
    },{
        SocialMediaIcon:PinterestSvg,
        socialMediaName:"Pinterest"
    },{
        SocialMediaIcon:LinkedInSvg,
        socialMediaName:'LinkedIn'
    }
];
function MobileProductMenu() {
    return (
        <div className="menu-container position-fixed" area-hidden="true">
            <div className="product-bar-container-main position-fixed full-width" >
                <div className="height-from-top"></div>
                <div className="product-bar-container flex large-padding flex-column medium-margin-left medium-margin-right regular-font">
                    {menuItems.map(productClass => <SlidingFromLeftAccordian key={productClass.id} id={productClass.id} title={productClass.name} device="mobile" />)}
                </div>
                <hr />
                <div className="need-help-container large-padding limit-width flex flex-column medium-margin-left">
                    <h3 className="small-font no-margin medium-bold-font">NEED HELP?</h3>
                    <div className="medium-margin flex"><MobileSvg />Call us 1888-9292-3333</div>
                    <div className="medium-margin-top flex"><MailBoxSvg />info@warehouse.com</div>
                </div>
                <hr />
                <div className="need-help-container large-padding limit-width flex flex-column medium-margin-left">
                    <h3 className="small-font no-margin medium-bold-font">FOLLOW US</h3>
                    {socialLinks.map((socialMedia,index)=><SocialMediaCard key={index} {...socialMedia} />)}
                </div>
            </div>
            <div className="expanded-menu-container">
                <div className="panel-container-main position-fixed full-width is-nested"  id='mobile_all_product'>
                    <div className="height-from-top"></div>
                    <NestedProductClasses productClasses={panelDataForAllProducts}/>
                </div>
                <div className="panel-container-main position-fixed full-width is-nested" id='mobile_new_arrivals'>
                    <div className="height-from-top"></div>
                    <NestedProductClasses productClasses={panelDataForAllProducts} />
                </div>
                <div className="panel-container-main position-fixed full-width is-nested" id="mobile_men_fashion">
                    <div className="height-from-top"></div>
                    <ProductClass productClass={panelDataForAllProducts[0]} />
                </div>
                <div className="panel-container-main position-fixed full-width is-nested" id="mobile_women_fashion">
                    <div className="height-from-top"></div>
                    <ProductClass productClass={panelDataForAllProducts[1]} />
                </div>
                <div className="panel-container-main position-fixed full-width is-nested" id="mobile_electronics_store">
                    <div className="height-from-top"></div>
                    <ProductClass productClass={panelDataForAllProducts[2]} />
                </div>
            </div>
        </div>
    )
}
function DesktopMainMenu(props){
    function showPanel(event){
        let id;
        let menuItem;
        if(!event.target.getAttribute('area-controls'))
            menuItem = event.target.parentNode;
        else
            menuItem = event.target;
        id = menuItem.getAttribute('area-controls');
        document.querySelectorAll('.is-open').forEach(openedMenu => {
            if(id !== openedMenu.getAttribute('id')){
                openedMenu.classList.remove('is-open');
            }
        });
        let expandedMenu = document.querySelector('.active');
        if(expandedMenu)
            expandedMenu.classList.remove('active');
        let isOpen = document.querySelector(`.expanded-menu-container-desktop #${id}`).classList.toggle('is-open');
        
        if(isOpen)
            menuItem.classList.add('active');
        else
        menuItem.classList.remove('active');

    }
    return (<div className="sliding-left-accordian medium-margin medium-margin-left medium-margin-right full-width flex justify-space-between link" area-controls={"desktop_"+props.id} onClick={(event)=>showPanel(event)}>{props.title} <i className="fas fa-angle-right"></i></div>)
}
function ExpandedIndividualProductMenu(props){
    return (
        <div className="expanded-menu flex justify-space-between medium-margin-left medium-margin-right large-padding" id={"desktop_"+props.productClass.id}>
            {props.giveTitle && <Link to={`products?productClass=${props.productClass.productClassQuery}`}> <h2 className="medium-font small-margin title medium-bold-font">{props.productClass.productClass}</h2> </Link> }
            {props.productClass.products.map(item => <div key={item.category} className="flex flex-column menu-items">
                <Link to={`products?productClass=${props.productClass.productClassQuery}&category=${item.category}`}> <h3 className="medium-bold-font small-font small-margin">{item.category}</h3> </Link>
                <ul className="sub-categories">
                    {
                        item.subCategories.map(subCategory => <Link key={subCategory} to={`/products?productClass=${props.productClass.productClassQuery}&category=${item.category}&subCategory=${subCategory}`}> 
                                                                <li className="color-black small-margin xxsmall-font">{subCategory}</li> </Link>
                    )}
                </ul>
            </div>)}
        </div>
    )
}
function ExpandedNestedProductMenu(props){
    return (
        <div className="expanded-menu expanded-menu-nested justify-space-between medium-margin-left medium-margin-right" id={"desktop_"+props.id}>
            {
                props.data.map(item => {
                    let id = item.id+1;
                    let  productClass = { ...item, id };
                    return <ExpandedIndividualProductMenu key={item.id} productClass={productClass} giveTitle={true} />
                })
            }
        </div>
    )
}
function DesktopProductMenu(){
    return (
        <div className="desktop-menu-container-main hidden full-width flex position-relative flex-column ">
            <div className="desktop-menu-container flex full-width limit-width justify-space-between xsmall-padding xsmall-font">
                {menuItems.map(productClass => <DesktopMainMenu key={productClass.id} id={productClass.id} title={productClass.name} device="desktop" />)}
            </div>
            <div className="expanded-menu-container-desktop position-absolute full-width limit-width">
                <ExpandedNestedProductMenu id="all_product" data={panelDataForAllProducts} />
                <ExpandedNestedProductMenu id="new_arrivals" data={panelDataForAllProducts} />
                <ExpandedIndividualProductMenu productClass = {panelDataForAllProducts[0]}  />
                <ExpandedIndividualProductMenu productClass = {panelDataForAllProducts[1]} />
                <ExpandedIndividualProductMenu productClass = {panelDataForAllProducts[2]} />
            </div>
        </div>
    )
}
export {MobileProductMenu,DesktopProductMenu};
