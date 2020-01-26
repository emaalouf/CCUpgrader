import React, { useCallback, useState } from 'react';
import { Provider, ResourcePicker } from '@shopify/app-bridge-react';

import axios from 'axios';
import { text } from "../i18n";
import * as helpers from "../helpers";
import {
  Button, Card, Filters, ResourceItem, TextContainer, ButtonGroup,
  ResourceList, TextField, TextStyle, Pagination, Stack, Modal
} from '@shopify/polaris';

/**************************************************/
var url_string = window.location.href;
var url = new URL( url_string );
var server = url.origin;
var shop = url.searchParams.get( "shop" );
var shopCode = url.searchParams.get( "code" );
var shopHmac = url.searchParams.get( "hmac" );
var shopState = url.searchParams.get( "state" );
/**************************************************/


let loaded = false;


export default function ProductsList ( props ) {
  const appProviderConfig = {
    apiKey: "1daf53193592cd9049b7d9e999bf6718",
    shopOrigin: "aliexpress-sync.myshopify.com"
  }
  const [ selectedItems, setSelectedItems ] = useState( [] );
  const [ sortValue, setSortValue ] = useState( "DATE_MODIFIED_DESC" );
  const [ taggedWith, setTaggedWith ] = useState( 'VIP' );
  const [ queryValue, setQueryValue ] = useState( null );
  const [ downloadedData, setDownloadedData ] = useState( {} );
  const [ currentPage, setCurrentPage ] = useState( 0 );
  const [ documentsPerPage, setDocumentsPerPage ] = useState( 5 );
  const [ loading, setLoading ] = useState( false );
  const [ deleteModalActive, setDeleteModalActive ] = useState( false );
  const [ toDeleteId, setToDeleteId ] = useState( '' );
  const [ toDeleteTitle, setToDeleteTitle ] = useState( '' );

  const [ sendModalActive, setSendModalActive ] = useState( false );
  const [ toSendId, setToSendId ] = useState( '' );
  const [ toSendTitle, setToSendTitle ] = useState( '' );
  const [ items, setItems ] = useState( [] );

  const [ productPickerOpen, setProductPickerOpen ] = useState( false );
  const [ productPickerShowVariants, setProductPickerShowVariants ] = useState( true );

  const handleTaggedWithChange = useCallback(
    ( value ) => setTaggedWith( value ),
    [],
  );
  const handleQueryValueChange = useCallback(
    ( value ) => setQueryValue( value ),
    [],
  );
  const handleTaggedWithRemove = useCallback( () => setTaggedWith( null ), [] );
  const handleQueryValueRemove = useCallback( () => setQueryValue( null ), [] );
  const handleClearAll = useCallback( () => {
    handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [ handleQueryValueRemove, handleTaggedWithRemove ] );

  const resourceName = {
    singular: text( 'product' ),
    plural: text( 'products' ),
  };




  const promotedBulkActions = [
    {
      content: text( 'send_to_aliexpress' ), // enviar_aliexpress
      onAction: () => sendProductsToAliExpress(),
    },
  ];

  const bulkActions = [
    {
      content: text( 'do_not_send' ),
      onAction: deleteProducts,
    }
  ];

  const filters = [
    {
      key: 'taggedWith',
      label: 'Tagged with', // etiquetado_con
      filter: (
        <TextField
          label="Tagged with" // etiquetado_con
          value={taggedWith}
          onChange={handleTaggedWithChange}
          labelHidden
        />
      ),
      shortcut: true,
    },
  ];

  const appliedFilters = !isEmpty( taggedWith ) ? [
    {
      key: 'taggedWith',
      label: disambiguateLabel( 'taggedWith', taggedWith ),
      onRemove: handleTaggedWithRemove,
    },
  ]
    : [];

  const filterControl = (
    <Filters
      queryValue={queryValue}
      filters={filters}
      appliedFilters={appliedFilters}
      onQueryChange={handleQueryValueChange}
      onQueryClear={handleQueryValueRemove}
      onClearAll={handleClearAll}
    >
      <div style={{ paddingLeft: '8px' }}>
        <Button onClick={() => console.log( 'New filter saved' )}>Save</Button>
      </div>
    </Filters>
  );


  const openProductPickerModal = () => {
    setProductPickerOpen( true );
    console.log( { productPickerOpen } );
  }


  if ( !loaded ) {
    loaded = true;
    console.log( 'lets load products' );
    setTimeout( () => {
      getData();
    }, 500 );
  }



  const productsQuery = `{
    products( query: "created_at:<2020", first: 5) {
      edges {
        node {
          id
          title
          description
        }
      }
    }
  }`

  return (
    <Provider config={appProviderConfig}>
      <Card
        title={text( 'products_pending_to_send' )}
      >
        <Card.Section>
          <TextContainer>{text( 'products_pending_to_send_explanation' )}</TextContainer>
        </Card.Section>
        <Card.Section>
          <ResourceList
            resourceName={resourceName}
            items={items}
            renderItem={renderItem}
            selectedItems={selectedItems}
            onSelectionChange={setSelectedItems}
            promotedBulkActions={promotedBulkActions}
            bulkActions={bulkActions}
            loading={loading}
            totalItemsCount={downloadedData.total}
          />
        </Card.Section>
        <Card.Section>
          <Stack>
            <Stack.Item fill>
              <Pagination
                label={helpers.getPaginationData( currentPage, downloadedData, documentsPerPage )}
                hasPrevious={helpers.hasPrevious( downloadedData )}
                onPrevious={() => { getData( 'previous' ); }}
                hasNext={helpers.hasNext( downloadedData )}
                onNext={() => { getData( 'next' ) }}
              />
            </Stack.Item>
            <Stack.Item>
              <ButtonGroup>
                <Button onClick={() => { getData(); }}>{text( "update_products_list" )}</Button>
                <Button onClick={() => { openProductPickerModal(); }} primary>{text( 'anadir_producto_a_lista_sincronizacion' )}</Button>
              </ButtonGroup>
            </Stack.Item>
          </Stack>

        </Card.Section>
        <ResourcePicker
          resourceType="Product"
          open={productPickerOpen}
          showVariants={productPickerShowVariants}
          onSelection={( { selection } ) => {
            console.log( 'Selected products: ', selection );
            addProducts( selection );
            setProductPickerOpen( false );
          }}
          onCancel={() => setProductPickerOpen( false )}
        />
      </Card>
      <Modal
        open={deleteModalActive}
        onClose={closeDeleteModal}
        title={text( 'are_you_sure' )}
        primaryAction={{
          content: text( 'delete' ),
          onAction: deleteConfirmed,
        }}
        secondaryActions={[
          {
            content: text( 'cancel' ),
            onAction: deleteCanceled,
          },
        ]}
      >
        <Modal.Section>
          <TextContainer>
            <p>
              {toDeleteTitle}
            </p>
          </TextContainer>
        </Modal.Section>
      </Modal>
      <Modal
        open={sendModalActive}
        onClose={closeSendModal}
        title={text( 'are_you_sure' )}
        primaryAction={{
          content: text( 'send' ),
          onAction: sendConfirmed,
        }}
        secondaryActions={[
          {
            content: text( 'cancel' ),
            onAction: sendCanceled,
          },
        ]}
      >
        <Modal.Section>
          <TextContainer>
            <p>
              {toSendTitle}
            </p>
          </TextContainer>
        </Modal.Section>
      </Modal>
    </Provider>
  );

  function openDeleteModal ( _id, title ) {
    setToDeleteId( _id );
    setToDeleteTitle( title );
    setDeleteModalActive( true );
  }

  function closeDeleteModal () {
    setToDeleteId( '' );
    setToDeleteTitle( '' );
    setDeleteModalActive( false );
  }

  function deleteConfirmed () {
    deleteProduct( toDeleteId );
    setDeleteModalActive( false );
  }
  function deleteCanceled () {
    setToDeleteId( '' );
    setToDeleteTitle( '' );
    setDeleteModalActive( false );
  }

  function openSendModal ( _id, title ) {
    setToSendId( _id );
    setToSendTitle( title );
    setSendModalActive( true );
  }

  function closeSendModal () {
    setToSendId( '' );
    setToSendTitle( '' );
    setSendModalActive( false );
  }

  function sendConfirmed () {
    sendProductsToAliExpress( toSendId );
    setSendModalActive( false );
  }

  function sendCanceled () {
    setToSendId( '' );
    setToSendTitle( '' );
    setSendModalActive( false );
  }

  function addProducts ( data ) {

    console.log( 'Adding products, shop', shop );
    console.log( 'Adding products, server', server );

    // https://malcoded.com/posts/react-http-requests-axios/

    const url = helpers.getURL( '/products' );
    console.log( 'AddNewProductsToSinc from', url );
    setLoading( true );

    console.log( 'POST', url );
    axios.post( url, data ).then( response => {
      console.log( 'Products to push', response.data.rows );
      getData();
      setLoading( false );
    } ).catch( err => {
      console.log( err );
      setLoading( false );
      return null;
    } );
  }
  /** Remove all selected products from bulk actions */
  function deleteProducts () {
    if ( selectedItems.length ) {
      const url = helpers.getURL( '/products', [ 'ids=' + selectedItems.join( ',' ) ] );
      console.log( 'deleteProducts from', url );
      setLoading( true );

      console.log( 'DELETE', url );
      axios.delete( url ).then( response => {
        console.log( 'Products deleted', response.ok );
        getData();
        setSelectedItems( [] );
        setLoading( false );
        setToDeleteId( '' );
        setToDeleteTitle( '' );
      } ).catch( err => {
        console.log( err );
        setLoading( false );
        setToDeleteId( '' );
        setToDeleteTitle( '' );
        return null;
      } );
    } else {
      alert( text( 'no_items_selected' ) );
    }
  }

  function deleteProduct ( _id ) {
    const url = helpers.getURL( '/products/' + _id );
    console.log( 'deleteProduct from', url );
    setLoading( true );

    console.log( 'DELETE', url );
    axios.delete( url ).then( response => {
      console.log( 'Products deleted', response.ok );
      getData();
      setLoading( false );
      setToDeleteId( '' );
      setToDeleteTitle( '' );
    } ).catch( err => {
      console.log( err );
      setLoading( false );
      setToDeleteId( '' );
      setToDeleteTitle( '' );
      return null;
    } );
  }

  function processProducts ( products ) {
    return products.map( product => {
      product.id = product._id;
      return product;
    } )
  }

  function pushProducts ( data ) {
    data = processProducts( data );
    console.log( 'Pushing', data );
    setItems( items.concat( data ) );
  }

  function setProducts ( data ) {
    data = processProducts( data );
    console.log( 'setProducts 1', data );
    setItems( data );
    console.log( 'setProducts 2', data );
  }

  function getData ( offset ) {

    // https://malcoded.com/posts/react-http-requests-axios/
    console.log( 'getData with axios' );
    setLoading( true );
    let addParamsToURL = [];
    if ( offset && offset == 'next' ) {
      addParamsToURL.push( 'skip=' + ( ( currentPage + 1 ) * documentsPerPage ) );
      addParamsToURL.push( 'limit=' + documentsPerPage );
    } else if ( offset && offset == 'previous' ) {
      addParamsToURL.push( 'skip=' + ( ( currentPage - 1 ) * documentsPerPage ) );
      addParamsToURL.push( 'limit=' + documentsPerPage );
    } else {
      addParamsToURL.push( 'skip=' + ( ( currentPage ) * documentsPerPage ) );
      addParamsToURL.push( 'limit=' + documentsPerPage );
    }
    let url = helpers.getURL( "/products", addParamsToURL );
    axios.get( url ).then( response => {
      setDownloadedData( response.data );
      setProducts( response.data.rows );
      console.log( 'Datos recibidos', response.data.rows );
      if ( offset && offset == 'next' ) {
        setCurrentPage( currentPage + 1 );
        console.log( 'Current page', currentPage );
      }
      if ( offset && offset == 'previous' ) {
        setCurrentPage( currentPage - 1 );
        console.log( 'Current page', currentPage );
      }
      setLoading( false );
    } ).catch( err => {
      console.log( err );
      setLoading( false );
      return null;
    } );
  }

  function sendProductsToAliExpress ( _id ) {
    const url = helpers.getURL( '/send-products' );
    console.log( 'send-product', url );
    setLoading( true );

    let ids = [];
    if ( _id ) {
      ids.push( _id );
    } else {
      ids = selectedItems.map( item => {
        return {
          "id": item.id
        };
      } )
    }

    if ( ids.length ) {
      console.log( 'POST', url );
      axios.post( url, ids ).then( response => {
        console.log( 'Products sent to AliExpress', ids );
        getData();
        setLoading( false );
      } ).catch( err => {
        console.log( err );
        setLoading( false );
        return null;
      } );
    } else {
      alert( text( 'nothing_to_send' ) );
    }
  }

  function renderItem ( item ) {
    const _id = item._id;
    const issues = item.data.issues;
    const issuesText = issues && issues.length ?
      issues.map( issue => text( issue.message ) ).join( ', ' )
      : '';
    const { title, productType, updatedAt, price, sku, url, name, collection, status, missingMappings } = item.data.sh;
    const id = _id;

    const deleteAction = {
      content: text( 'do_not_send' ), url: status, onAction: () => {
        openDeleteModal( _id, title );
      }
    };
    const sendAction = {
      content: text( 'send' ), url: status, onAction: () => {
        openSendModal( _id, title );
      }
    };
    const shortcutActionsOk = [ sendAction, deleteAction ];
    const shortcutActionsIssues = [ deleteAction ];

    if ( !issues || !issues.length ) {
      return (
        <ResourceItem
          id={id}
          key={id}
          accessibilityLabel={`View details for ${name}`}
          shortcutActions={shortcutActionsOk}
          persistActions
        >
          <h3>
            <TextStyle variation="strong">{title}</TextStyle>
          </h3>
          <TextStyle variation="positive" size="small">{text( 'ready_to_send' )}</TextStyle>
        </ResourceItem>
      );
    } else {
      return (
        <ResourceItem
          id={id}
          key={id}
          accessibilityLabel={`View details for ${name}`}
          shortcutActions={shortcutActionsIssues}
          persistActions
        >
          <h3>
            <TextStyle variation="strong">{title}</TextStyle>
          </h3>
          <TextStyle variation="negative" size="small">
            <ul>
              {issues.map( ( issue, index ) => {
                if ( !issue.issues ) {
                  return <li key={issue.message + index}>{text( issue.message )} {issue.name}</li>
                } else {
                  return (
                    <li key={issue.message + index}>{text( issue.message )}

                        {issue.issues.map( ( subIssues, index1 ) => {
                          return <ul>
                            {subIssues.map( ( subIssue, index2 ) => {
                              return (<li
                                key={issue.message + '_' + subIssue.message + '_' + index1 + '_' + index2}>
                                    {text( subIssue.message )} {subIssue.name}
                                </li>);
                            } )}
                          </ul>
                        } )}

                    </li>
                  );
                }
              } )}
            </ul>
          </TextStyle>
        </ResourceItem>
      );
    }
  }

  function disambiguateLabel ( key, value ) {
    switch ( key ) {
      case 'taggedWith':
        return `Tagged with ${value}`;
      default:
        return value;
    }
  }

  function isEmpty ( value ) {
    if ( Array.isArray( value ) ) {
      return value.length === 0;
    } else {
      return value === '' || value == null;
    }
  }




}
