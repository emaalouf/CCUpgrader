import "@shopify/polaris/styles.css";
import React, { useCallback, useState } from "react";
import { render } from "react-dom";
import styles from "./components/scss/application.scss";
import enTranslations from "@shopify/polaris/locales/en.json";
import esTranslations from "@shopify/polaris/locales/es.json";
import { AppProvider, Page, Link, FooterHelp } from "@shopify/polaris";
import axios from "axios";

import App from "./components/app";
import { text, userLang } from "./i18n";
import * as helpers from "./helpers";

global.hola = "Hola";

// App Bridge
import createApp, { WINDOW_UNDEFINED_MESSAGE } from "@shopify/app-bridge";
import {
  TitleBar,
  Button,
  Redirect,
  Loading,
  ResourcePicker
} from "@shopify/app-bridge/actions";

var url_string = window.location.href;
// Desarrollo
url_string = "https://currencyconverterupgrader.herokuapp.com";
var url = new URL(url_string);
console.log(url);

var server = url.origin;
var shopOrigin = url.searchParams.get("shop");
var shopCode = url.searchParams.get("code");
var shopHmac = url.searchParams.get("hmac");
var shopState = url.searchParams.get("state");
var _id = url.searchParams.get("_id");

// Desarrollo
shopOrigin = shopOrigin || "aliexpress-sync.myshopify.com";
_id = _id || "5daf45954e101b0ebd378e96";

var gVars = {
  shopOrigin,
  shopCode,
  _id
};

let settingsLoaded = false;

console.log("userLang:", userLang);

let Translations;

switch (userLang) {
  case "es":
    Translations = esTranslations;
    console.log("i18n: " + text("spanish", userLang));
    break;
  default:
    console.log("i18n: " + text("english", userLang));
    Translations = enTranslations;
}

// Shopify App Bridge Oauth
const apiKey = "1daf53193592cd9049b7d9e999bf6718";

//const redirectUri = "https://0ee1ef42.ngrok.io/shopify/callback";
const redirectUri = "https://aliexpress-sync.herokuapp.com/shopify/callback";
const permissionUrl = `/oauth/authorize?client_id=${apiKey}&scope=read_products,read_content&redirect_uri=${redirectUri}`;

// If the current window is the 'parent', change the URL by setting location.href
if (window.top == window.self) {
  //window.location.assign( `https://${shopOrigin}/admin${permissionUrl}` )
  console.log(" ********** window.top == window.self *********");
  // If the current window is the 'child', change the parent's URL with Shopify App Bridge's Redirect action
} else {
  const app = createApp({
    apiKey: apiKey,
    shopOrigin: shopOrigin
  });

  if (app) {
    app.dispatch(Redirect.toApp({ path: "/" }));
  }

  // alert( permissionUrl )
  // Redirect.create(app).dispatch(Redirect.Action.ADMIN_PATH, permissionUrl);
}

const appProviderConfig = {
  apiKey,
  shopOrigin: shopOrigin
};

console.log("appProviderConfig", appProviderConfig);

render(
  <AppProvider config={appProviderConfig} i18n={Translations}>
    <Page>
      <App gVars={gVars} />
      <center>
        <b>Mukul Apps</b>
      </center>
    </Page>
  </AppProvider>,
  document.querySelector("#app")
);
