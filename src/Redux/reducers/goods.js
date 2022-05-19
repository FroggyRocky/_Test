import { UserAPI } from '../../api'


const SET_ITEMS_DATA = 'Redux/reducers/goods/SET_ITEMS_DATA'
const ADD_ITEM = 'Redux/reducers/goods/ADD_ITEM'
const DELETE_ITEM = 'Redux/reducers/goods/DELETE_ITEM'
const UPDATE_BUCKET = 'Redux/reducers/goods/UPDATE_BUCKET'
const SET_BUY_STATE = 'Redux/reducers/goods/BUY'
const SET_CURRENCY_RATE = 'Redux/reducers/SET_CURRENCY_RATE'
const SET_OUT_OF_STOCK_STATE = 'Redux/reducers/SET_OUT_OF_STOCK_STATE'
const SET_CUSTOM_ERR = 'Redux/reducers/SET_CUSTOM_ERR'

const initialState = {
    goodsData: [],
    bucket: [],
    buyState: 1, // states: 1 - undefined/unstated, true - successfully bought, false - failure //TS Enum - would come in handy 
    currencyRateRUB: null,
    isOutOfStock: false,
    customErrMsg: ''
}


const goods = (state = initialState, action) => {
    switch (action.type) {
        case SET_ITEMS_DATA:
            return {
                ...state,
                goodsData: [...action.items]
            }
        case ADD_ITEM:
            return {
                ...state,
                bucket: [...state.bucket, action.item]
            }
        case DELETE_ITEM:
            return {
                ...state,
                bucket: state.bucket.filter(el => el.id !== action.id)
            }
        case UPDATE_BUCKET:
            return {
                ...state,
                bucket: [...action.newBucket]
            }
        case SET_BUY_STATE:
            return {
                ...state,
                buyState: action.state
            }
        case SET_OUT_OF_STOCK_STATE:
            return {
                ...state,
                isOutOfStock: action.state
            }
        case SET_CURRENCY_RATE:
            return {
                ...state,
                currencyRateRUB: action.rate
            }
        case SET_CUSTOM_ERR:
            return {
                ...state,
                customErrMsg: action.errMsg
            }
        default:
            return {
                ...state
            }
    }
}


const setItemsData = (items) => ({ type: SET_ITEMS_DATA, items })
const setBuyState = (state) => ({ type: SET_BUY_STATE, state })
const setCurrencyRate = (rate) => ({ type: SET_CURRENCY_RATE, rate })
const updateBucket = (newBucket) => ({ type: UPDATE_BUCKET, newBucket })
const setOutOfStockState = (state) => ({ type: SET_OUT_OF_STOCK_STATE, state })
const setCustomErrMsg = (errMsg) => ({ type: SET_CUSTOM_ERR, errMsg })
// synchronize redux bucket with local storage
const synchronizeReduxBucket = () => async (dispatch) => {
    await dispatch(refreshLocalStorage())
    const localStorage = JSON.parse(window.localStorage.getItem('bucket')) || []
    const outOfStock = localStorage.filter(el => el.amountLeft !== 0)
    if (outOfStock.length < localStorage.length) {
        dispatch(setOutOfStockState(true))
        dispatch(filterLocalStorage(outOfStock))
        dispatch(updateBucket(outOfStock))
    } else {
        dispatch(updateBucket(localStorage))
    }
}

// synchronize local storage items with database
const refreshLocalStorage = () => async (dispatch, getState) => {
    let items = window.localStorage.getItem('bucket')
    if (items) {
        const goodsData = await getState().goods.goodsData
        const localStorage = JSON.parse(window.localStorage.getItem('bucket'))
        const updatedBucket = localStorage.map(el => {
            const founded = goodsData.find(item => item.id == el.id)
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
        window.localStorage.setItem('bucket', JSON.stringify(updatedBucket))
    }
}

//get items from DB
const getItems = () => async (dispatch) => {
    const res = await UserAPI.getItems()
    if (res.status === 200) {
        await dispatch(setItemsData(res.data))
        dispatch(synchronizeReduxBucket())
    }
}


const addItem = (id) => async (dispatch, getState) => {
    const newItem = await getState().goods.goodsData.filter(el => el.id == id)
    const oldStorage = JSON.parse(window.localStorage.getItem('bucket'))
    if (oldStorage && Array.isArray(oldStorage)) {
        const newStorage = JSON.stringify([...oldStorage, ...newItem])
        window.localStorage.setItem('bucket', newStorage)
        dispatch(synchronizeReduxBucket())
    } else {
        window.localStorage.setItem('bucket', JSON.stringify([...newItem]))
        dispatch(synchronizeReduxBucket())
    }

}

const deleteItem = (id) => async (dispatch) => {
    const localStorage = JSON.parse(window.localStorage.getItem('bucket'))
    const newBucket = localStorage.filter(el => el.id !== id)
    window.localStorage.setItem('bucket', JSON.stringify(newBucket))
    dispatch(synchronizeReduxBucket())
}

const getCurrencyRate = () => async (dispatch) => {
    const res = await UserAPI.getCurrencyRate()
    dispatch(setCurrencyRate(Math.ceil(res.rates.RUB)))
}

const filterLocalStorage = (filteredItems) => (dispatch) => {
    window.localStorage.setItem('bucket', JSON.stringify([...filteredItems]))
}

const buy = (items) => async (dispatch) => {
    try {
        const res = await UserAPI.buy(items)
        if (res.status === 200) {
            dispatch(getItems())
            dispatch(setBuyState(true))
            window.localStorage.clear()
        }
    } catch (e) {
        if (e.response.data.error) {
            dispatch(setCustomErrMsg(e.response.data.error))
            dispatch(setBuyState(false))
        } else {
            dispatch(setBuyState(false))
        }
        window.localStorage.clear()
    }

}


export { getItems, addItem, deleteItem, buy, setBuyState, getCurrencyRate, synchronizeReduxBucket, filterLocalStorage, setOutOfStockState }
export default goods