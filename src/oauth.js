var AppBridge = window[ 'app-bridge' ];
var createApp = AppBridge.createApp;
var actions = AppBridge.actions;
var Redirect = actions.Redirect;

const apiKey = '1daf53193592cd9049b7d9e999bf6718';
var url_string = window.location.href;
var url = new URL( url_string );
var server = url.origin;
var shop = url.searchParams.get( "shop" );
var shopCode = url.searchParams.get( "code" );
var shopHmac = url.searchParams.get( "hmac" );
var shopState = url.searchParams.get( "state" );
console.log( JSON.stringify( locale, null, 2 ) );

const redirectUri = data.shopInfo.redirectUri;
const permissionUrl = '/oauth/authorize?client_id=' + apiKey + '&scope=read_products,read_content&redirect_uri=' + redirectUri;

alert( 'oauth.js' );
console.log( 'Autorizando...', data );

// If the current window is the 'parent', change the URL by setting location.href
if ( window.top == window.self ) {
  window.location.assign( 'https://' + shop + '/admin' + permissionUrl );

  // If the current window is the 'child', change the parent's URL with Shopify App Bridge's Redirect action
} else {
  const app = createApp( {
    apiKey: apiKey,
    shopOrigin: shop,
  } );

  // Redirect.create(app).dispatch(Redirect.Action.ADMIN_PATH, permissionUrl);
  console.log( 'Autorizado!' );
  configurarTitlebar( app );
}


function configurarTitlebar ( app ) {

  var TitleBar = actions.TitleBar;
  var Button = actions.Button;
  var ButtonGroup = actions.ButtonGroup;
  var ResourcePicker = actions.ResourcePicker;
  var ContextualSaveBar = actions.ContextualSaveBar;

  var breadcrumb = Button.create( app, { label: 'Sync' } );
  breadcrumb.subscribe( Button.Action.CLICK, function () {
    app.dispatch( Redirect.toApp( { path: '/' } ) );
  } );



  const button1 = Button.create(app, {label: 'Sync'});
  const button2 = Button.create(app, {label: 'Help'});
  const myGroupButton = ButtonGroup.create(app, {label: 'More actions', buttons: [button1, button2]});
  const toastOptions = {
    message: 'Procedemos a sincronizar productos...',
    duration: 5000,
  };

  const toastNotice = actions.Toast.create(app, toastOptions);

  const productPicker = ResourcePicker.create(app, {
    resourceType: ResourcePicker.ResourceType.Product,
  });

  productPicker.subscribe(ResourcePicker.Action.SELECT, ({selection}) => {
    // Do something with `selection`
  });

  const newTodoButton = Button.create(app, { label: "Sincronizar" });
  newTodoButton.set({ disabled: false });
  const clickUnsubscribe = newTodoButton.subscribe(Button.Action.CLICK, data => {
    toastNotice.dispatch( actions.Toast.Action.SHOW );



    productPicker.dispatch(ResourcePicker.Action.OPEN);

  });

  const titleBar = TitleBar.create(app, {
    title: "Productos",
    buttons: { primary: newTodoButton }
  });






}
