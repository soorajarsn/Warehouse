import React from 'react'
import {informationData} from './homePageData';
function FeaturesCard(props) {
    return (
      <div className="information-card-container small-margin">
        <div className="information-card flex">
          <div className="icon-container small-margin-right">{<props.svg />}</div>
          <div className="content-container flex flex-column">
            <div className="title-container medium-bold-font xsmall-font xsmall-margin">{props.title}</div>
            <div className="description-container xxsmall-font">{props.description}</div>
          </div>
        </div>
      </div>
    );
  }
function Features() {
    return (
        <div className="information-container-main full-width limit-width">
        <div className="flex sub-information-container">
          <div className="information-container grid medium-margin">
            {informationData.map((information, index) => (
              <FeaturesCard key={index} {...information} />
            ))}
          </div>
        </div>
      </div>
    )
}

export default Features;
