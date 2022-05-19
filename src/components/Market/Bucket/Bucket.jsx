import { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { addItem, deleteItem, buy, setBuyState, synchronizeReduxBucket, filterLocalStorage, setOutOfStockState } from '../../../Redux/reducers/goods';
import ItemCard from '../Card/ItemCard'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Modal from '../../common/Modal'
import { Navigate } from 'react-router';
import './bucket.css'

function Bucket(props) {


    const [buyingState, setBuyingState] = useState()
    const [redirectState, setRedirectState] = useState()

    useEffect(() => {
        if (props.bucket?.some(el => el.amountLeft === 0)) {
            const filtered = props.bucket.filter(el => el.amountLeft !== 0)
            props.filterLocalStorage(filtered)
        } else {
            props.synchronizeReduxBucket()
        }
    }, [])


    function handleBuy() {
        setBuyingState(true)
        props.buy(props.bucket)
    }

    function handleDelete(e) {
        const itemId = e.currentTarget.id
        props.deleteItem(itemId)
    }

    function closeModal() {
        props.setOutOfStockState(false)
    }

    return <section className='bucket-container'>
        {redirectState && <Navigate replace to='/' />}
        {props.buyState !== null && <Modal
            smallModal={true}
            closeModal={() => { props.setBuyState(null); setRedirectState(true); setBuyingState(false) }}
            header={props.buyState === true ? 'Seccessfull' : 'Failure'}
            text={props.buyState === true ? 'You successfully realised your purchase' : props.customErrMsg || 'Something went wrong'} />}
        {props.isOutOfStock && <Modal closeModal={closeModal} smallModal={true} header={'Attention'} text={'You have items which are out of stock. They will be deleted'} />}
        {props.bucket.length === 0 ? <Typography className='bucket_noItems-container' component="div" variant="h6">No Items Added</Typography> :
            <>
                <div className='bucket-content'>
                    <ItemCard currencyRateRUB={props.currencyRateRUB} cardsData={props.bucket} bucketData={props.bucket} handleDelete={handleDelete} />
                </div>
                <div className='bucket-buy'>
                    <Button variant="outlined" onClick={handleBuy} disabled={props.bucket.length === 0 || buyingState === true}>
                        <Typography variant="body2">Buy</Typography>&nbsp;<ShoppingCartIcon />
                    </Button>
                </div>
            </>
        }</section>

}


const mapState = (state) => ({
    bucket: state.goods.bucket,
    buyState: state.goods.buyState,
    currencyRateRUB: state.goods.currencyRateRUB,
    isOutOfStock:state.goods.isOutOfStock,
    customErrMsg:state.goods.customErrMsg
})

export default connect(mapState, { addItem, deleteItem, buy, setBuyState, synchronizeReduxBucket, filterLocalStorage, setOutOfStockState })(Bucket)