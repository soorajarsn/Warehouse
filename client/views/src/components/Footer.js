import React from 'react'
import {HelpCenterSvg, GiftCardSvg, AdvertisementSvg, SellOnWarehouseSvg } from './svg/icons'

function Footer() {
    return (
        <div className="footer-container-main flex">
            <div className="footer-container full-width  large-padding small-margin-top flex flex-wrap flex-column xsmall-font medium-padding-left medium-padding-right limit-width">
                <div className="grid-container full-width">
                    <footer className="limit-width grid">
                        <div className="xsmall-margin small-margin-left small-margin-right">
                            <SellOnWarehouseSvg />
                            <span>Sell on Warehouse</span>
                        </div>
                        <div className="xsmall-margin small-margin-right small-margin-left">
                            <AdvertisementSvg />
                            <span>Advertise</span>
                        </div>
                        <div className="xsmall-margin small-margin-right small-margin-left">
                            <GiftCardSvg />
                            <span>Gift Cards</span>
                        </div>
                        <div className="xsmall-margin small-margin-right small-margin-left">
                            <HelpCenterSvg />
                            <span>Help Center</span>
                        </div>
                    </footer>
                </div>
            <div className='payment-methods-container small-margin'>
                <img className="full-img" src="/assets/payment-methods.svg" alt="" />
            </div>
            </div>
        </div>
    )
}

export default Footer;
