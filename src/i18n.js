/**

   En este fichero se determinan las diferentes traducciones
   Si un tÃ©rmino no existe en el indioma indicado se devolverÃ¡ en inglÃ©s
   Hay que Escribir las traducciones con la primera letra mayÃºsculas
   y el resto minÃºsculas, texto normal.
   Cuando se tengan que emplear con la primera minÃºscula se usarÃ¡ toLowerCase.

**/

var navigatorUserLocation = navigator.language || navigator.userLanguage;
var navigatorUserLang = navigatorUserLocation.substring(0, 2).toLowerCase();
var userLang =
  ["es", "en"].indexOf(navigatorUserLang) === -1 ? "en" : navigatorUserLang;

console.log("navigatorUserLang", navigatorUserLang, "userLang", userLang);

exports.userLang = userLang;
var i18nTranslations = {
  settings: {
    en: "Settings",
    es: "ConfiguraciÃ³n"
  },
  email: {
    en: "E-mail",
    es: "Correo electrÃ³nico"
  },
  authorize: {
    en: "Authorize",
    es: "Autorizar"
  },
  your_Shopify_email: {
    en: "Please fill out with your Shopify shop address",
    es: "Por favor, indica el correo electrÃ³nico de tu cuenta en Shopify"
  },
  settings_text: {
    en: "",
    es:
      "Antes de nada es importante que configuremos tu conexiÃ³n con Shopify, por favor rellena estos campos y pulsar autorizar, a partir de ahÃ­ podremos empezar a trabajar juntos."
  },
  i_want_it: {
    en: "Let's get start",
    es: "Â¡Lo quiero!"
  },
  your_free_plan: {
    en: "Your free plan expires soon, upgrade to...",
    es:
      "Tu plan gratuito caduca dentro de pocos dÃ­as, actualizate para disfrutar de todas las ventajas."
  },
  mapping: {
    en: "Mapping",
    es: "Mapeo de campos"
  },
  mappings: {
    en: "Mappings",
    es: "Mapeos de campos"
  },
  update: {
    en: "Update",
    es: "Actualizar"
  },

  accept: {
    en: "Accept",
    es: "Aceptar"
  },
  cancel: {
    en: "Cancel",
    es: "Cancelar"
  },
  english: {
    en: "English",
    es: "InlgÃ©s"
  },
  spanish: {
    en: "Spanish",
    es: "EspaÃ±ol"
  },
  sube_nivel: {
    es: "Â¡Sube de nivel!",
    en: "Welcome!"
  },
  lo_quiero: {
    es: "Â¡Lo quiero!",
    en: "Let's get started"
  },
  tu_plan_gratuito: {
    es:
      "Tu plan gratuito caduca en %x, pÃ¡sate al plan profesional y disfruta de todas sus ventajas.",
    en: "You trial ends in %x, upgrade to enjoy all itâs benefits."
  },
  by: {
    es: "Por",
    en: "By"
  },
  producto: {
    es: "Producto",
    en: "Product"
  },
  productos: {
    es: "Productos",
    en: "Products"
  },
  pendiente_indicar_talla: {
    es: "Pendiente de indicar la talla",
    en: "Missing size"
  },
  necesita_indicar_atributos: {
    es: "Necesita indicar %x atributos",
    en: "Missing %x attributes"
  },
  enviar_Shopify: {
    es: "Enviar a Shopify",
    en: "Send to Shopify"
  },
  eliminar: {
    es: "Eliminar",
    en: "Remove"
  },
  etiquetado_con: {
    es: "Etiquetado con",
    en: "Tagged with"
  },
  last_sync: {
    es: "Ãltima sincronizaciÃ³n",
    en: "Last synchronisation"
  },
  productos_pendientes_enviar_Shopify: {
    es: "Tienes estos productos pendientes de enviar a Shopify",
    en: "Youâve got this productos pending to send to Shopify"
  },
  anadir_producto_a_lista_sincronizacion: {
    es: "Quiero vender mÃ¡s productos a Shopify",
    en: "I want to sell more products in Shopify"
  },
  importar_pedidos: {
    es: "Quiero aÃ±adir estos pedidos a mi tienda",
    en: "I want to add this orders to my shop"
  },
  nuevos_pedidos_en_Shopify: {
    es: "Tienes estos nuevos pedidos en Shopify",
    en: "Youâve got this new orders in Shopify"
  },
  last_sincro_since: {
    es: "Ãltima sincronizaciÃ³n:",
    en: "Last sincro:"
  },
  lets_auth: {
    es: "Primero, vamos a hacer login en Shopify...",
    en: "Let's login"
  },
  whats_your_name: {
    es: "Â¿Cual es tu nombre?",
    en: "What's your name?"
  },
  sign_out: {
    es: "Cerrar sesiÃ³n",
    en: "Sign out"
  },

  tell_me_your_name: {
    es: "Por favor, dime tu nombre y asÃ­ nos vamos conociendo.",
    en: "Please, tell me your name."
  },
  order: {
    es: "Pedido",
    en: "Order"
  },
  orders: {
    es: "Pedidos",
    en: "Orders"
  },
  product: {
    es: "Producto",
    en: "Product"
  },
  products: {
    es: "Productos",
    en: "Products"
  },
  fix: {
    es: "Solucionar",
    en: "Fix it"
  },
  do_not_send: {
    es: "No enviar",
    en: "Do not send"
  },
  send_to_Shopify: {
    es: "Enviar a Shopify",
    en: "Send to Shopify"
  },
  mappings_pending_to_fix: {
    es: "Asociaciones pendientes de definir",
    en: "Pending mappings"
  },
  mappings_pending_to_fix_explanation: {
    es:
      "Antes de poder enviar productos a Shopify necesito que me des algunos datos. Por ejemplo necesito saber la relaciÃ³n entre algunos datos de Shopify y su correspondencia en Shopify. Simplemente ve contestando las siguientes preguntas y pronto podremos tener el trabajo terminado.",
    en: "First of all I need some information about..."
  },
  products_pending_to_send_explanation: {
    es:
      "Estos productos estÃ¡n pendientes de enviar a Shopify, si tienes alguno con una alerta necesito que antes me indiques algunos datos, de lo contrario pruedes enviarlo pulsando el botÃ³n que encontrarÃ¡s junto a Ã©l.",
    en: "This products are pending, you can send it to Shopify....."
  },
  type: {
    es: "Tipo",
    en: "Type"
  },
  no_type: {
    es: "Este dato de Shopify...",
    en: "This param in Shopify..."
  },
  product_variant_option: {
    en: "Product option",
    es: "OpciÃ³n del producto"
  },
  select_Shopify_property: {
    es: "Â¿a quÃ© corresponde en Shopify?",
    en: "Wich one is in Shopify?"
  },
  update_products_list: {
    es: "Actualizar la lista de productos",
    en: "Update product list"
  },
  update_orders_list: {
    es: "Actualizar la lista de pedidos",
    en: "Update orders list"
  },
  products_pending_to_send: {
    es: "Productos pendientes de enviar a Shopify",
    en: "Products pendient to send to Shopify"
  },
  import_orders: {
    es: "Importar pedidos",
    en: "Import orders"
  },
  do_not_import: {
    es: "No importar",
    en: "Do not import"
  },
  orders_pending_to_import_explanation: {
    es:
      "Tienes estos pedidos pendientes de importar, si no tienen ninguna incidencia puedes importarlos, en caso contraro por favor revisa las asociaciones.",
    en: "You have got this orders pending to import."
  },
  ready_to_import: {
    es: "Preparado para importar",
    en: "Ready to import"
  },
  skip: {
    es: "Omitir",
    en: "Skip"
  },
  import: {
    es: "Importar",
    en: "Import"
  },
  are_you_sure: {
    es: "Â¿EstÃ¡ seguro?",
    en: "Are you sure?"
  },
  missed_attributes: {
    es: "Faltan atributos",
    en: "Attributes missed"
  },
  missed_attribute: {
    es: "Falta un atributo",
    en: "Missed attribute"
  },
  missed_categories: {
    es: "Falta indicar categorÃ­a",
    en: "Missed categories"
  },
  missing_product_collection_mapping: {
    es: "Falta asociaciÃ³n con colecciÃ³n",
    en: "Missing collection mapping"
  },
  send: {
    es: "Enviar",
    en: "Send"
  },
  missing_parameters: {
    es: "Necesita asociar parÃ¡metros",
    en: "Missing parameters mapping"
  },
  missed_product_type_mapping: {
    es: "Falta asociar el tipo de producto",
    en: "Missing product type"
  },
  missed_product_tag_mapping: {
    es: "Falta asociar la etiqueta",
    en: "Tag mapping missed"
  },
  missed_product_option_mapping: {
    es: "Falta asociar la opciÃ³n de producto",
    en: "Product option mapping missed"
  },
  ready_to_send: {
    es: "Preparado para enviar",
    en: "Ready to send"
  },
  delete: {
    es: "Borrar",
    en: "Delete"
  }
};

exports.text = (text, lang) => {
  lang = lang || userLang;
  return i18nTranslations[text]
    ? i18nTranslations[text][lang] || i18nTranslations[text].en
    : "no_i18n_" + text;
};
