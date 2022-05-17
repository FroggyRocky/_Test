import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import ItemCard from './Card/ItemCard'
import { getItems, addItem } from '../../Redux/reducers/goods'
import './market.css'

function Market(props) {




  useEffect(() => {
    props.getItems()

  }, [])

  function addToBucket(e) {
    const itemId = e.currentTarget.id
    props.addItem(itemId)
  }

  return <section className="market-container">
    <div className='market-content'>
      <ItemCard handleClick={addToBucket} cardData={props.goodsData} />
    </div>
  </section>

}

const mapState = (state) => ({
  goodsData: state.goods.goodsData
})

export default connect(mapState, { getItems, addItem })(Market)