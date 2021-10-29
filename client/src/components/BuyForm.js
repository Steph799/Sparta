import React from 'react';
import {minIdVal, purchaseReq, minIdDigitsError, creditCardFormatLength, cartUrl, thanksForBuying,
  creditCardFormatNote } from './shared/constants';
import MyTextField from './utils/MyTextField';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { Typography } from '@material-ui/core';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import axios from 'axios';


const initialValues = {
  firstName: '',
  lastName: '',
  id: '',
  email: '',
  creditCard: '',
};


const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('Required!'),
  lastName: Yup.string().required('Required!'),
  id: Yup.number().min(minIdVal, minIdDigitsError).required('Required!'),
  email: Yup.string().email('Invalid email format').required('Required!'),
  creditCard: Yup.string().min(creditCardFormatLength, 'Invalid Credit card format')
    .matches(/^\(?([0-9]{4})\)?[-]([0-9]{4})[-]([0-9]{4})$/,'Invalid Credit card format').required('Required!'),
});

function BuyForm(props) {
  const history = useHistory();
  const { name, price, company, user, productId, cart, items } = props.history.location.state;

  const identify = user ? user.userMember || user : null;

  const savedValues = user && user.userData && {
    firstName: user.userData.firstName,
    lastName: user.userData.lastName,
    id: user.userData.id,
    email: user.userData.email,
    creditCard: '',
  };

  const redirect = () => {
    if (identify && user.userMember) history.push(`/catalog`, { userMember: user.userMember, userData: user.userData });
    else if (identify && user.manager) history.push(`/catalog`, { manager: user.manager });
    else history.push(`/catalog`);
  };

  const purchase = async (values) => {
    const { firstName, lastName, id } = values
    const cartBody = {}
    const purchaseBody = { soldProducts: [], buyer: { firstName: firstName, lastName: lastName, id: id } }
  
    if (cart) {
      cart.forEach(async (product) => {
        cartBody.items = product.items - product.copies;
        purchaseBody.soldProducts.push({name: product.name, company: product.company, price: product.price,copies: product.copies});
        await axios.put(`${purchaseReq}/${product.id}`, {...cartBody});
      });
    } else {
      cartBody.items = items - 1;
      await axios.put(`${purchaseReq}/${productId}`, {...cartBody});
      purchaseBody.soldProducts.push({ name: name, company: company, price: price, copies: 1 })
    }
    purchaseBody.totalPrice = price;
    await axios.post(cartUrl, { ...purchaseBody });//add purchase to db
    return true;
  };

  const onSubmit = async (values) => {
    try {
      if (await purchase(values)) {
        alert(thanksForBuying);
        redirect();
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div>
      <Button
        color="primary"
        style={{ align: 'left' }}
        onClick={() => redirect()}
      >
        Return to catalog
      </Button>
      <Container component="main" maxWidth="xs">
        <Typography variant="h5">
          {name ? `${name},` : 'Cart'} {company ? company : ''}
        </Typography>
        <Typography variant="h6">Please fill all the fields</Typography>
        <br />
        <Formik
          initialValues={savedValues || initialValues}
          validationSchema={validationSchema} //validate
          onSubmit={async (values, { resetForm }) => {
            await onSubmit(values);
            resetForm();
          }}
          enableReinitialize
        >
          {(formik) => {
            return (
              <Form>
                <MyTextField
                  label="First name"
                  value={formik.values.firstName}
                  name={'firstName'}
                  formik={formik}
                  block={savedValues && true}
                />
                <MyTextField
                  label="Last name"
                  value={formik.values.lastName}
                  name="lastName"
                  formik={formik}
                  id="LastName"
                  block={savedValues && true}
                />
                <MyTextField
                  label="Id"
                  value={formik.values.id >= 0 ? formik.values.id : 0}
                  name="id"
                  formik={formik}
                  type="number"
                  id="id"
                  block={savedValues && true}
                />
                <MyTextField
                  label="Email"
                  value={formik.values.email}
                  name="email"
                  formik={formik}
                  type="email"
                  id="email"
                  block={savedValues && true}
                />
                <MyTextField
                  label="Credit card"
                  name="creditCard"
                  value={formik.values.creditCard}
                  formik={formik}
                  id="creditCard"
                />
                <div>{creditCardFormatNote}</div>              
                <div style={{ marginTop: '1rem' }}>
                  <Button
                    type="submit"
                    disabled={!(formik.dirty && formik.isValid)}
                    variant="contained"
                    color="primary"
                  >
                    Pay
                  </Button>
                  <Button type="reset" color="secondary">
                    Reset
                  </Button>
                  <div>Total: {price}$</div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </Container>
    </div>
  );
}

export default BuyForm;
