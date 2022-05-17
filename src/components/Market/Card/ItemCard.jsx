import './itemCard.css'
import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ClearIcon from '@mui/icons-material/Clear';
import { UserAPI } from '../../../api';

export default function ItemCard(props) {

  const [path, setPath] = useState()


  const [currentRate, setCurrentRate] = useState()



  useEffect(() => {
    UserAPI.getCurrencyRate().then(data => setCurrentRate(Math.round(data.rates.RUB)))
    const interval = setInterval(() => {
      UserAPI.getCurrencyRate().then(data => setCurrentRate(data.rates.RUB))
    }, 2000*60);
    return () => clearInterval(interval);
  }, [])

  console.log(currentRate)

  useEffect(() => {
    setPath(window.location.pathname.split('/')[1])
  }, [])

  const cards = props.cardData.map(el => {

    console.log(el.price, currentRate)
    return <Card className='item_card-container' key={el.id} sx={{ minWidth: 275 }}>
      {path === 'bucket' && <div className='item_deleteItem' id={el.id} onClick={props.handleDelete}><ClearIcon /></div>}
      <CardContent>
        <Typography variant="h5" component="div">
          {el.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          In Stock:{el.amountLeft}
        </Typography>
        <div className='item_price-container--USD'>
          <LocalOfferIcon style={{ fontSize: 20 }} size='small' />:&nbsp;
          <Typography variant="body2">{el.price}&nbsp;USD</Typography>
        </div>
        <div className='item_price-container--RUB'>
          <LocalOfferIcon style={{ fontSize: 20 }} />:&nbsp;
          <Typography variant="body2">{el.price * currentRate}&nbsp;RUB</Typography>
        </div>
        {path === 'bucket' && <div className='item_count-container'>
          <Typography variant="body2">Count:&nbsp;{el.count}</Typography>
        </div>}
      </CardContent>
      {(el.amountLeft === 0 || el.count >= el.amountLeft) && <Typography className='item_outOfStock' variant="body2">*Out of Stock</Typography>}
      <CardActions>
        <Button variant="outlined" disabled={el.amountLeft === 0 || el.count >= el.amountLeft} onClick={props.handleClick} id={el.id}>
          {(path === 'bucket' || el.count >= el.amountLeft) ? <AddIcon /> : 'Add to Bucket'}
        </Button>
        {path === 'bucket' &&
          <Button variant="outlined" disabled={el.count === 1} onClick={props.handleDecreaseAmount} id={el.id}>
            <RemoveIcon />
          </Button>}
      </CardActions>
    </Card>
  })
  return <>{cards}</>
}