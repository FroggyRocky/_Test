import { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { addItem, refreshBucket, getItems, decreaseAmount, deleteItem, buy, setBuyState } from '../../../Redux/reducers/goods';
import ItemCard from '../Card/ItemCard'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Modal from '../../common/Modal'
import { Navigate } from 'react-router';
import './bucket.css'

function Bucket(props) {

    const [bucket, setBucketData] = useState([])
    const [buyingState, setBuyingState] = useState()
    const [isItemOutOfStock, setItemOutOfStockState] = useState(true)
    const [redirectState, setRedirectState] = useState()

    useEffect(() => {
        const bucketData = JSON.parse(window.localStorage.getItem('bucket'))
        if (bucketData.some(el => el.amountLeft == 0)) {
            setItemOutOfStockState(true)
        }
        props.refreshBucket()
    }, [])


    useEffect(() => {
        const bucketData = JSON.parse(window.localStorage.getItem('bucket'))
        if (bucketData) {
            const filteredBucket = bucketData.filter(el => el.amountLeft !== 0)
            setBucketData([...filteredBucket])
        }
    }, [props.bucket])

    function addMore(e) {
        const itemId = e.currentTarget.id
        props.addItem(itemId)
    }

    function handleDecreaseAmount(e) {
        const itemId = e.currentTarget.id
        props.decreaseAmount(itemId)
    }

    function handleBuy() {
        setBuyingState(true)
        props.buy(bucket)
    }

    function handleDelete(e) {
        const itemId = e.currentTarget.id
        props.deleteItem(itemId)
    }

    function closeModal() {
        setItemOutOfStockState(false)
    }

    return <section className='bucket-container'>
        {redirectState && <Navigate replace to='/' />}
        {props.buyState !== null && <Modal
            smallModal={true}
            closeModal={() => {props.setBuyState(null); setRedirectState(true);setBuyingState(false)}}
            header={props.buyState === true ? 'Seccessfull' : 'Failure'}
            text={props.buyState === true ? 'You successfully realised your purchase' : 'Something went wrong'} />}
        {isItemOutOfStock && <Modal closeModal={closeModal} smallModal={true} header={'Attention'} text={'You have items which are out of stock. They will be deleted'} />}
        {props.bucket.length === 0 ? <Typography className='bucket_noItems-container' component="div" variant="h6">No Items Added</Typography> :
            <>
                <div className='bucket-content'>
                    <ItemCard cardData={bucket} handleClick={addMore} handleDecreaseAmount={handleDecreaseAmount} handleDelete={handleDelete} />
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
    buyState: state.goods.buyState
})

export default connect(mapState, { addItem, refreshBucket, getItems, decreaseAmount, deleteItem, buy, setBuyState })(Bucket)