import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { insufficientProducts } from './shared/constants';


function Cart(props) {
  const history = useHistory();
  const { cart, totalPrice, setCart, setTotalPrice, user } = props;

  const unitedCart = [];
  for (let i = 0; i < cart.length; i++) {
    let copies = 0;
    let hasCopies = false;
    const productToCopy = { copies: 1, price: cart[i].price };

    if (cart[i + 1] && cart[i].id === cart[i + 1].id) {
      const startIndex = i;
      hasCopies = true;
      let totalCopiesPrice;

      do {
        copies++;
        totalCopiesPrice = copies * cart[startIndex].price;
        productToCopy.copies = copies;
        productToCopy.price = totalCopiesPrice;

        if (!cart[i + 1] || cart[i].id !== cart[i + 1].id) {
          hasCopies = false;
          unitedCart.push({name: cart[startIndex].name, company: cart[startIndex].company, id: cart[startIndex].id,
            items: cart[startIndex].items, ...productToCopy,});
        } else i++;
      } while (hasCopies);
    } else unitedCart.push({ name: cart[i].name, company: cart[i].company, id: cart[i].id, items: cart[i].items, ...productToCopy });
  }


  const handleDelete = (id) => {
    const productToDelete = cart.findIndex((product) => product.id === id); //find the first match
    const removedProduct = cart.splice(productToDelete, 1); //remove the specific element

    setCart(cart);
    setTotalPrice((prev) => prev - removedProduct[0].price);
  };

  const pay = () => {
    const insufficient = [];
    unitedCart.forEach((product) => {
      if (product.items < product.copies) insufficient.push(`${insufficientProducts} ${product.name}.\n`);
    });
    if (insufficient.length) alert(insufficient.join(''));
    else history.push(`/buy`, { user: user, price: totalPrice, cart: unitedCart });
  };

  useEffect(() => { }, [cart]);

  return (
    <div>
      <h1>Your cart</h1>
      {cart.length ? (
        <div>
          {unitedCart.map((product, index) => {
            return (
              <li key={index}>
                {product.copies > 1 && `{x${product.copies}}`} {product.name},
                {product.company}: {product.price}$
                <Button
                  size="small"
                  color="secondary"
                  onClick={() => handleDelete(product.id)}  >
                  X
                </Button>
              </li>
            );
          })}
          <h3>Total price: {totalPrice}$</h3>
          <Button color="primary" variant="contained" onClick={pay}>
            Pay
          </Button>
        </div>
      ) : (<span>No items in the cart</span>)}
    </div>
  );
}

export default Cart;
