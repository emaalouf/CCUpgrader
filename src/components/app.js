import React, { Component } from "react";
import {
  CalloutCard, Provider
} from "@shopify/polaris";
import ProductsList from "./products-list";
import OrdersList from "./orders-list";
import Mappings from "./mappings";
import Settings from "./settings";

import { text, userLang } from "../i18n";

export default class App extends Component {


  constructor( args ) {
    super( args );
    this.gVars = args.gVars;
    console.log( ':::: shopOrigin', this.gVars.shopOrigin );
    this.state = {
      shop: "shop.shopify.com",
      authorized: false,
      email: "",
      shopSettings: {}
    };
    this.settingsComponent = React.createRef();
    this.appProviderConfig = {
      apiKey: "1daf53193592cd9049b7d9e999bf6718",
      shopOrigin: "aliexpress-sync.myshopify.com"
    }
  }



  render () {
    return (

        <div key="appDiv">
          <CalloutCard
            title={text( "sube_nivel" )}
            illustration="/assets/imgs/box.png"
            primaryAction={{
              content: text( "i_want_it" ),
              url: "https://www.shopify.com"
            }}
          >
            <p>{text( "your_free_plan" )}</p>
          </CalloutCard>

          {this.state.authorized ? (
            [
              <Mappings key="mappings" />,
              <ProductsList key="productslist" />,
              <OrdersList key="orderslist" />
            ]
          ) : (
              ""
            )}
          <Settings
            ref={this.settingsComponent}
            gVars={this.gVars}
            setSettings={settings => {
              this.setState( {
                email: settings.email,
                authorized: settings.authorized
              } );
            }}
          />

        </div>

    );
  }
}
