import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import ItemCard from './Card/ItemCard'
import { addItem, synchronizeReduxBucket } from '../../Redux/reducers/goods'
import './market.css'

function Market(props) {


  useEffect(() => {
    props.synchronizeReduxBucket()
  }, [])

  function addToBucket(e) {
    const itemId = e.currentTarget.id
    props.addItem(itemId)
  }

  return <section className="market-container">
    <div className='market-content'>
      <ItemCard currencyRateRUB={props.currencyRateRUB} cardsData={props.goodsData} bucketData={props.bucket} handleClick={addToBucket} />
    </div>
  </section>
}

const mapState = (state) => ({
  bucket: state.goods.bucket,
  goodsData: state.goods.goodsData,
  currencyRateRUB: state.goods.currencyRateRUB
})

export default connect(mapState, { addItem, synchronizeReduxBucket })(Market)