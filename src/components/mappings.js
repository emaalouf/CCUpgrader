import React, { useCallback, useState } from "react";
import axios from "axios";
import SelectMapping from "./select-mapping";
import { text } from "../i18n";
import * as helpers from "../helpers";
import {
  Button, Card, ResourceItem, TextContainer,
  ResourceList, Pagination, ButtonGroup, Stack
} from "@shopify/polaris";

/**************************************************/
var url_string = window.location.href;
var url = new URL(url_string);
var server = url.origin;
var shop = url.searchParams.get("shop");
var shopCode = url.searchParams.get("code");
var shopHmac = url.searchParams.get("hmac");
var shopState = url.searchParams.get("state");
/**************************************************/

let loaded = false;

export default function Mappings() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([{_id: 1, data: {} } ] );
  const [downloadedData, setDownloadedData] = useState({} );
  const [currentPage, setCurrentPage] = useState(0);
  const [documentsPerPage, setDocumentsPerPage] = useState( 5 );

  const resourceName = {
    singular: text("mapping"),
    plural: text("mappings")
  };


  if (!loaded) {
    loaded = true;
    console.log( 'lets load mappings' );
    setTimeout(() => {
      getData();
    }, 500);
  }

  return (
    <Card
      title={text( 'mappings_pending_to_fix' )}
    >
      <Card.Section>
        <TextContainer>{text('mappings_pending_to_fix_explanation')}</TextContainer>
      </Card.Section>
      <Card.Section>
        <ResourceList
          resourceName={resourceName}
          items={items}
          renderItem={renderItem}
          selectedItems={selectedItems}
          onSelectionChange={setSelectedItems}
          loading={loading}
          showHeader={true}
          totalItemsCount={downloadedData.total}
        />
      </Card.Section>
      <Card.Section>
      <Stack>
        <Stack.Item fill>
        <Pagination
          label={helpers.getPaginationData(currentPage, downloadedData, documentsPerPage )}
          hasPrevious={helpers.hasPrevious(downloadedData)}
          onPrevious={() => { getData('previous'); }}
          hasNext={helpers.hasNext(downloadedData)}
          onNext={() => { getData('next') }}
        />
        </Stack.Item>
        <Stack.Item>
        <ButtonGroup>
          <Button onClick={() => { getData(); }}>{text("update")}</Button>
        </ButtonGroup>
        </Stack.Item>
      </Stack>
      </Card.Section>
    </Card>
  );

  function renderItem(item) {
    const { _id, url, name } = item;
    item.id = _id;
    return (
      <ResourceItem
        id={item.id}
        key={item.id}
        accessibilityLabel={`View details for ${name}`}
        persistActions
      >
        <SelectMapping item={item} key={'select-mapping-.' + item.id}/>
      </ResourceItem>
    );
  }

  function processMappings(mappings) {
    return mappings.map(mapping => {
      let res = mapping.data;
      res.id = mapping._id;
      return res;
    });
  }

  function pushMappings(data) {
    data = processMappings(data);
    console.log("Pushing mappings", data);
    setItems(items.concat(data));
  }

  function setMappings(data) {
    setItems(processMappings(data));
    console.log("setMappings", data);
  }

  function getData( offset ) {
    // https://malcoded.com/posts/react-http-requests-axios/
    console.log("get mappings from", helpers.getURL("/mappings"), 'CurrentPage', currentPage);
    setLoading(true);
    let addParamsToURL = [];
    if ( offset && offset == 'next' ) {
      addParamsToURL.push( 'skip=' + ( ( currentPage + 1 ) * documentsPerPage ));
      addParamsToURL.push( 'limit=' + documentsPerPage );
    } else if ( offset && offset == 'previous' ) {
      addParamsToURL.push( 'skip=' + ( ( currentPage - 1 ) * documentsPerPage ));
      addParamsToURL.push( 'limit=' + documentsPerPage );
    } else {
      addParamsToURL.push( 'skip=' + ( ( currentPage ) * documentsPerPage ));
      addParamsToURL.push( 'limit=' + documentsPerPage );
    }
    let url = helpers.getURL("/mappings", addParamsToURL );
    axios
      .get( url )
      .then(response => {
        // setMappings(response.data.rows);
        setDownloadedData( response.data );
        setItems(response.data.rows);
        if ( offset && offset == 'next' ) {
          setCurrentPage( currentPage + 1 );
          console.log( 'Current page', currentPage );
        }
        if ( offset && offset == 'previous' ) {
          setCurrentPage( currentPage - 1 );
          console.log( 'Current page', currentPage );
        }
        console.log("Mappings recibidos", response.data.rows);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
        return null;
      });
  }


}
