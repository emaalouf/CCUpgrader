let desarrollo = true;
if (!desarrollo) {
  var url_string = window.location.href;
  var url = new URL(url_string);

  // Desarrollo
  if (url && url.hostname == "localhost") {
    url.port = 3333;
  }

  var server = url.origin;
  var shop = url.searchParams.get("shop");
  var shopCode = url.searchParams.get("code");
  var shopHmac = url.searchParams.get("hmac");
  var shopState = url.searchParams.get("state");
} else {
  server = "https://aliexpress-sync.herokuapp.com";
  shop = "aliexpress-sync.myshopify.com";
}

// Desarrollo

if (!shop && url.hostname == "localhost") {
  shop = "aliexpress-sync.myshopify.com";
}

exports.getURL = (path, extraParams) => {
  let url =
    server +
    path +
    "?" +
    "shop=" +
    shop +
    "&shopcode=" +
    shopCode +
    "&hmac=" +
    shopHmac +
    "&state=" +
    shopState;
  if (extraParams && extraParams.length) {
    extraParams.forEach(param => {
      url += "&" + param;
    });
  }
  console.log(url);
  return url;
};

exports.hasPrevious = downloadedData => {
  console.log(downloadedData);
  if (downloadedData.documents) {
    return downloadedData.skip ? true : false;
  } else {
    return false;
  }
};
exports.hasNext = downloadedData => {
  if (downloadedData.documents && downloadedData.total) {
    return downloadedData.documents + downloadedData.skip < downloadedData.total
      ? true
      : false;
  } else {
    return false;
  }
};

exports.getPaginationData = (currentPage, downloadedData, documentsPerPage) => {
  const totalPages = Math.ceil(downloadedData.total / documentsPerPage);
  return totalPages && !isNaN(totalPages) && totalPages > 1
    ? currentPage + 1 + "/" + totalPages
    : "";
};
