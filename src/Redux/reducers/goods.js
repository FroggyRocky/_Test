import { UserAPI } from '../../api'


const SET_ITEMS_DATA = 'Redux/reducers/goods/SET_ITEMS_DATA'
const UPDATE_BUCKET = 'Redux/reducers/goods/UPDATE_BUCKET'
const SET_BUY_STATE = 'Redux/reducers/goods/BUY'

const initialState = {
    goodsData: [],
    bucket: [],
    buyState: null
}


const goods = (state = initialState, action) => {
    switch (action.type) {
        case SET_ITEMS_DATA:
            return {
                ...state,
                goodsData: [...action.items]
            }
        case UPDATE_BUCKET:
            return {
                ...state,
                bucket: [...action.item]
            }
        case SET_BUY_STATE:
            return {
                ...state,
                buyState: action.state
            }
        default:
            return {
                ...state
            }
    }
}

const setItemsData = (items) => ({ type: SET_ITEMS_DATA, items })
const updateBucket = (item) => ({ type: UPDATE_BUCKET, item })
const setBuyState = (state) => ({ type: SET_BUY_STATE, state })

const refresh = (updatedBucket) => async (dispatch, getState) => {
    dispatch(updateBucket(updatedBucket))
    window.localStorage.setItem('bucket', JSON.stringify(updatedBucket))
}

// synchronize alredy added items with database
const refreshBucket = () => async (dispatch, getState) => {
    const res = await UserAPI.getItems()
    if (res.status === 200) {
        const storageBucket = JSON.parse(window.localStorage.getItem('bucket'))
        const updatedBucket = storageBucket.map(el => {
            const founded = res.data.find(item => item.id == el.id)
            if (founded) {
                return ({
                    ...el,
                    price: founded.price,
                    amountLeft: founded.amountLeft
                })
            } else {
                return el
            }
        })
        dispatch(refresh(updatedBucket))
    }
}

const getItems = () => async (dispatch) => {
    const res = await UserAPI.getItems()
    if (res.status === 200) {
        dispatch(setItemsData(res.data))
    }
}

const decreaseAmount = (id) => async (dispatch, getState) => {
    const bucket = await getState().goods.bucket
    const updatedBucket = bucket.map(el => {
        if (el.id == id) {
            return ({
                ...el,
                count: el.count - 1
            })
        } else {
            return el
        }
    })
    dispatch(refresh(updatedBucket))
}



const deleteItem = (id) => async (dispatch, getState) => {
    const bucket = await getState().goods.bucket
    const updatedBucket = bucket.filter(el => el.id !== +id)
    dispatch(refresh(updatedBucket))
}


const addItem = (id) => async (dispatch, getState) => {
    const goods = await getState().goods.goodsData
    let bucketItems = await getState().goods.bucket
    const item = await goods.find(el => el.id === +id)
    let existingBucketItem = await bucketItems.find(el => el.id === +item.id)
    if (existingBucketItem) {
        const filtered = bucketItems.filter(el => el.id !== +item.id)
        const newItem = [...filtered, { ...existingBucketItem, count: existingBucketItem.count + 1 }]
        dispatch(refresh(newItem))
    } else {
        const newItem = [...bucketItems, { ...item, count: 1 }]
        dispatch(refresh(newItem))
    }

}

const buy = (items) => async (dispatch) => {
    const res = await UserAPI.buy(items)
    if (res.status === 200) {
        dispatch(setBuyState(true))
    } else {
        dispatch(setBuyState(false))
    }
}


export { getItems, addItem, refreshBucket, decreaseAmount, deleteItem, buy, setBuyState }
export default goods