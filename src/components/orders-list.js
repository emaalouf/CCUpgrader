import React, { useCallback, useState } from 'react';
import axios from 'axios';
import { text } from "../i18n";
import * as helpers from "../helpers";
import {
  Button, Card, ResourceItem, TextContainer, Modal, Provider,
  ResourceList, TextStyle, Pagination, ButtonGroup, Stack
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

export default function OrdersList () {



  const [ selectedItems, setSelectedItems ] = useState( [] );
  const [ sortValue, setSortValue ] = useState( "DATE_MODIFIED_DESC" );
  const [ taggedWith, setTaggedWith ] = useState( 'VIP' );
  const [ queryValue, setQueryValue ] = useState( null );
  const [ loading, setLoading ] = useState( false );
  const [ downloadedData, setDownloadedData ] = useState( {} );
  const [ currentPage, setCurrentPage ] = useState( 0 );
  const [ documentsPerPage, setDocumentsPerPage ] = useState( 5 );

  const [ deleteModalActive, setDeleteModalActive ] = useState( false );
  const [ toDeleteId, setToDeleteId ] = useState( '' );
  const [ toDeleteTitle, setToDeleteTitle ] = useState( '' );

  const promotedBulkActions = [
    {
      content: text( 'import_orders' ),
      onAction: importOrders,
    },
  ];

  const bulkActions = [
    {
      content: text( 'skip' ),
      onAction: () => deleteOrders(),
    }
  ];

  const [ items, setItems ] = useState( [] );

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
    singular: text( 'order' ),
    plural: text( 'orders' ),
  };



  if ( !loaded ) {
    loaded = true;
    console.log( 'lets load orders' );
    setTimeout( () => {
      getData();
    }, 500 );
  }

  return (
    <div>
      <Card
        title={text( 'nuevos_pedidos_en_aliexpress' )}
      >
        <Card.Section>
          <TextContainer>{text( 'orders_pending_to_import_explanation' )}</TextContainer>
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
                <Button onClick={() => { getData(); }}>{text( 'update_orders_list' )}</Button>
              </ButtonGroup>
            </Stack.Item>
          </Stack>
        </Card.Section>
      </Card>
      <Modal
        open={deleteModalActive}
        onClose={closeDeleteModal}
        title={text( 'are_you_sure' )}
        primaryAction={{
          content: text( 'skip' ),
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
      </Modal></div>
  );



  function renderItem ( item ) {
    const _id = item._id;
    const id = _id;
    const issues = item.data.issues;
    const issuesText = issues && issues.length ?
      issues.map( issue => text( issue.message ) ).join( ', ' )
      : '';
    const { order_id, url, buyer_signer_fullname, summary, status } = item.data.ae;

    // const media = <Avatar customer size="medium" name={name} />;
    const shortcutActions = [ { content: 'Solucionar', url: status } ];
    const omitAction = {
      content: text( 'skip' ), url: status, onAction: () => {
        openDeleteModal( _id, buyer_signer_fullname + ' (' + order_id + ')' );
      }
    };
    const importAction = {
      content: text( 'import' ), url: status, onAction: () => {
        importOrders( _id );
      }
    };
    const shortcutActionsOk = [ omitAction, importAction ];
    const shortcutActionsIssues = [ omitAction ];

    if ( !issues || !issues.length ) {
      return (
        <ResourceItem
          id={id}
          key={id}
          accessibilityLabel={`View details for ${buyer_signer_fullname}`}
          shortcutActions={shortcutActionsOk}
          persistActions
        >
          <h3>
            <TextStyle variation="strong">{buyer_signer_fullname}</TextStyle>
          </h3>
          <div><TextStyle variation="subdued">{order_id}</TextStyle></div>
          <div><TextStyle variation="positive">{text( 'ready_to_import' )}</TextStyle></div>
        </ResourceItem>
      );
    } else {
      return (
        <ResourceItem
          id={id}
          key={id}
          accessibilityLabel={`View details for ${buyer_signer_fullname}`}
          shortcutActions={shortcutActionsIssues}
          persistActions
        >
          <h3>
            <TextStyle variation="strong">{buyer_signer_fullname}</TextStyle>
          </h3>
          <div><TextStyle variation="subdued">{order_id}</TextStyle></div>
          <div><TextStyle variation="negative">{issuesText}</TextStyle></div>
        </ResourceItem>
      );
    }
  }

  function processOrders ( orders ) {
    return orders.map( order => {
      order.id = order._id;
      return order;
    } )
  }

  function pushOrders ( data ) {
    data = processOrders( data );
    console.log( 'Pushing', data );
    setItems( items.concat( data ) );
  }

  function setOrders ( data ) {
    data = processOrders( data );
    setItems( data );
    console.log( 'setOrders', data );
  }

  function getData ( offset ) {

    // https://malcoded.com/posts/react-http-requests-axios/
    console.log( 'get order data' );
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
    let url = helpers.getURL( "/orders", addParamsToURL );
    axios.get( url ).then( response => {
      setDownloadedData( response.data );
      setOrders( response.data.rows );
      console.log( 'Pedidos recibidos', response.data.rows );
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

  /** Remove all selected orders from bulk actions */
  function deleteOrders() {
    if ( selectedItems.length ) {
      const url = helpers.getURL( '/orders', [ 'ids=' + selectedItems.join(',') ] );
      console.log( 'deleteOrders from', url );
      setLoading( true );

      console.log( 'DELETE', url );
      axios.delete( url ).then( response => {
        console.log( 'Orders deleted', response.ok );
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
      alert( text('no_items_selected' ) );
    }
  }

  function deleteOrder ( _id ) {
    const url = helpers.getURL( '/orders/' + _id );
    console.log( 'deleteOrder from', url );
    setLoading( true );

    console.log( 'DELETE', url );
    axios.delete( url ).then( response => {
      console.log( 'Order deleted', response.ok );
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
    deleteOrder( toDeleteId );
    setDeleteModalActive( false );
  }

  function deleteCanceled () {
    setToDeleteId( '' );
    setToDeleteTitle( '' );
    setDeleteModalActive( false );
  }

  function importOrders ( _id ) {
    const url = helpers.getURL( '/import-orders' );
    console.log( 'import-orders', url );
    setLoading( true );

    let ids = [];
    if ( _id ) {
      ids.push( _id );
    } else {
      ids = selectedItems
    }

    if ( ids.length ) {
      console.log( 'POST', url );
      axios.post( url, ids ).then( response => {
        console.log( 'Orders imported from AliExpress', ids );
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

}
