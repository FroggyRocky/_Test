import { useEffect } from 'react';
import { connect } from 'react-redux';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';
import { getCurrencyRate, getItems} from '../../Redux/reducers/goods'
import './header.css'

function Header(props) {


  //State started values


  useEffect(() => {
    props.getCurrencyRate()
      props.getItems()
    const interval = setInterval(() => {
      props.getCurrencyRate()
    }, 2000*60);
    return () => clearInterval(interval);
  }, [])


function getItems() {
  props.getItems()
}

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar className='header-container' position="static">
        <Toolbar>
          <Link to='/' onClick={getItems}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <HomeIcon />
            </IconButton>
          </Link>
          <Link to='/bucket' onClick={getItems}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <ShoppingCartIcon />
            </IconButton>
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

const mapState = (state) => ({
  
})

export default connect(mapState, {getCurrencyRate, getItems})(Header)