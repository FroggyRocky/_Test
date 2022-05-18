import './itemCard.css'
import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ClearIcon from '@mui/icons-material/Clear';
;

export default function ItemCard(props) {

  const [path, setPath] = useState()

  useEffect(() => {
    setPath(window.location.pathname.split('/')[1])
  }, [])

  const cards = props.cardsData.map(el => {

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
     {props.currencyRateRUB &&  <div className='item_price-container--RUB'>
          <LocalOfferIcon style={{ fontSize: 20 }} />:&nbsp;
          <Typography variant="body2">{el.price * props.currencyRateRUB}&nbsp;RUB</Typography>
        </div>}
      </CardContent>
     {(path !== 'bucket' || !path) &&  <CardActions>
       <Button variant="outlined" disabled={el.amountLeft === 0 || props.bucketData.some(item => item.id === el.id)} onClick={props.handleClick} id={el.id}>
           'Add to Bucket'
           </Button>
           </CardActions>
           }
    </Card>
  })
  return <>{cards}</>
}