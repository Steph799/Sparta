import React, { useState, useEffect } from 'react';
import { productsUrl, categoryOptions, pageSize, userCoefficientDiscount, confirmDeleting, categoryHeader } from './shared/constants';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { Rating } from '@material-ui/lab';
import { useHistory } from 'react-router-dom';
import shoppingCartIcon from '../shopping_cart_icon.png';
import MyDialog from './MyDialog';
import axios from 'axios';
import { currentValues } from './filters/FilterMenu';
import { currentIndex, includeFilters, noFilters } from './menu/MenuBtn';
import { findMatch } from './menu/SearchField'
import Footer from './Footer';


const theme = createTheme();

export default function DisplayProducts({ filteredStock, setFilteredStock, user, numOfProducts, setNumOfProducts, searchValue,
  sortByInput, prevInputValue, page, setPage }) {
  const history = useHistory();
  const discountCoefficient = user ? userCoefficientDiscount : 1;

  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [toggleCart, setToggleCart] = useState(false);
  const [open, setOpen] = useState(false);
  const [img, setImg] = useState(null);
  const pagesCount = Math.ceil(numOfProducts / pageSize);

  useEffect(() => {
    if (cart.length > 0) {
      const sum = cart.reduce((accumulator, current) => accumulator + current.price, 0);
      setTotalPrice(sum);
    }
  }, [cart]);


  const fetchData = async (newPage=1) => searchValue && sortByInput ? await findMatch(searchValue, newPage) : currentValues ?
    await includeFilters(currentIndex, newPage, numOfProducts) : await noFilters(currentIndex, newPage, numOfProducts)

  const handlePageChange = async (event, newPage) => {
    try {
      const getPage = await fetchData(newPage)
      setFilteredStock(getPage.products)
      setPage(newPage)
      window.scrollTo(0, 0);
    } catch (error) {
      alert(error)
    }
  };

  const sortCart = (name, company, id, price, items) => {
    const updatedCart = [...cart, { id: id, name: name, company: company, price: price, items: items }];
    const sortedCart = updatedCart.sort((productA, productB) => productA.id.localeCompare(productB.id));
    setCart(sortedCart);
  };
  const handleDelete = async (productName, productId) => {
    const confirmDelete = window.confirm(`${confirmDeleting} ${productName}?`);
    if (confirmDelete) {
      axios.defaults.headers.common['x-auth-token'] = localStorage.getItem('token');
      try {
        await axios.delete(`${productsUrl}/${productId}`);
        numOfProducts--;
        const reRender = await fetchData()
        setFilteredStock(reRender.products)
        setNumOfProducts(reRender.quantity)

        setPage(1);
      } catch (error) {
        alert(error);
      }
    }
  };

  const buyProduct = (name, price, company, id, items) => 
    history.push(`/buy`, {user, name, price, company, items, productId: id});

  const onCartClick = () => {
    setToggleCart(true);
    window.scrollTo(0, document.body.scrollHeight);
  };

  return (
    <ThemeProvider theme={theme}>
      <input
        value=''// in order to ignore the warning
        type="image"
        alt="Cart"
        onClick={onCartClick}
        src={shoppingCartIcon}
        style={{
          marginTop: '0.5rem',
          width: '3rem',
          height: '3rem',
          position: 'fixed',
          border: 'solid',
        }}
      />
      {totalPrice > 0 && (
        <span style={{ position: 'fixed', marginTop: '4rem' }}>
          Total price: {totalPrice}$<br />
          Click the cart
        </span>
      )}

      <CssBaseline />
      <AppBar position="relative"></AppBar>
      <main>
        <Box sx={{ bgcolor: 'background.paper', pt: 1, pb: 1 }}>
          <Container maxWidth="md">
            <Typography variant="h5" align="center" color="secondary" paragraph>
              {sortByInput && prevInputValue ? //eslint-disable-next-line
                `Matched for \"${prevInputValue}\"` : `${categoryHeader} \"${categoryOptions[currentIndex]}\"`}
            </Typography>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {filteredStock.length ? (
              filteredStock.map((product) => {
                const { image, name, company, description, rate, price, gender, items, _id } = product;
                const finalPrice = Math.ceil(discountCoefficient * price);
                return (
                  <Grid item key={_id} xs={12} sm={6} md={4}>
                    <Card
                      sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}  >            
                      <CardMedia component="img" image={image} alt="random" sx={{ /* 16:9 */pt: '56.25%' }} />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h5" component="h2">{name}</Typography>
                        <Typography gutterBottom variant="h6" component="h2">{company}</Typography>
                        <Typography style={{ fontWeight: 'bold' }}> Description:</Typography>
                        <p>{description}</p>
                        <p>Gender: {gender}</p>
                        <Rating value={rate} precision={0.5} disabled name="rating" />
                        <Typography>Price: {finalPrice}$</Typography>
                        {user && user.manager && (
                          <Typography>Items: {items}</Typography>
                        )}
                      </CardContent>
                      <CardActions>
                        <div>
                          <Button size="small" variant="contained" color="primary" disabled={!items}
                            onClick={() => buyProduct(name, finalPrice, company, _id, items)}>
                            {items ? 'Buy' : 'Not available in the stock'}
                          </Button>
                          {items ? (<Button size="small"
                            onClick={() => sortCart(name, company, _id, finalPrice, items)}>
                            Add to cart</Button>) : null}
                        </div>
                        <div>
                          <Button size="small" onClick={() => { setOpen(true); setImg(image); }}>                     
                            View
                          </Button>
                          {open && (<MyDialog image={img} open={open} setOpen={setOpen} setImg={setImg} name={name} />)}
                          {user && user.manager && (
                            <div>
                              <Button
                                size="small"
                                onClick={() => history.push(`/edititem`, { mode: 'edit', product, filteredStock })}>
                                Edit
                              </Button>
                              <Button size="small" color="secondary" onClick={() => handleDelete(name, _id)}>
                                Delete
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })
            ) : (<h1>No items to show</h1>)}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <Footer pagesCount={pagesCount} page={page} handlePageChange={handlePageChange} toggleCart={toggleCart} cart={cart}
       totalPrice={totalPrice} setCart={setCart} setTotalPrice={setTotalPrice} user={user} />
  
    </ThemeProvider>
  );
}


