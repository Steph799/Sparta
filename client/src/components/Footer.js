import React from 'react'
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { Pagination } from '@material-ui/lab';
import Cart from './Cart';


export const copyright=()=> {
    return (
        <Typography variant="body2" color="secondary" align="center">
            {'Copyright © Sparta '}
            {new Date().getFullYear()}
        </Typography>
    );
}

function Footer({pagesCount, page, handlePageChange, toggleCart, cart, totalPrice, setCart, setTotalPrice, user}) {
    return (
        <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
            {pagesCount>1 ? ( // must be null in the ternary in order not to render 1 or 0 (not bigger than 1? don't show pagination)
                <Pagination
                    count={pagesCount}
                    page={page}
                    shape="rounded"
                    color="primary"
                    onChange={handlePageChange}
                    style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}
                />
            ) : null}
            {toggleCart && (
                <Cart
                    cart={cart}
                    totalPrice={totalPrice}
                    setCart={setCart}
                    setTotalPrice={setTotalPrice}
                    user={user}
                />
            )}
            {copyright()}
        </Box>
    )
}

export default Footer
