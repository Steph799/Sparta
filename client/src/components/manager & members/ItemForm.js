import React, { useState, useEffect } from 'react';
import {genderTypes, categoryOptions, productsUrl, uploadImgUrl, rateRangeError, positivePriceError, maxRate, descriptionMinLen,
  positiveItemsError } from '../shared/constants';
import MyTextField from '../utils/MyTextField';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { Typography } from '@material-ui/core';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import RenderSelect from '../utils/RenderSelect';
import axios from 'axios';


const initialValues = {
  name: '',
  company: '',
  category: '',
  gender: '',
  description: '',
  price: '',
  items: '',
  rate: '',
  image: '',
};

const renderRateRange = (value) => value >= 0 && value <= maxRate ? value : '';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Required!'),
  company: Yup.string().required('Required!'),
  category: Yup.string().required('Required!'),
  gender: Yup.string().required('Required!'),
  description: Yup.string().min(descriptionMinLen).required('Required!'),
  price: Yup.number().positive(positivePriceError).required('Required!'),
  items: Yup.number().positive(positiveItemsError).integer().required('Required!'),
  rate: Yup.number().min(0, rateRangeError).max(maxRate, rateRangeError).required('Required!'),
  image: Yup.string().required('Required!'),
});

function ItemForm(props) {
  const history = useHistory();
  const [isBrowsed, setIsBrowsed] = useState(false) //define whether the user import an image from his PC or the internet
  const [path, setPath] = useState('')
  const [file, setFile] = useState('');

  const user = { manager: 'Manager' };
  const { mode, product } = props.location.state;

  let savedValues = product && {
    name: product.name,
    company: product.company,
    category: product.category,
    gender: product.gender,
    description: product.description,
    price: product.price,
    items: product.items,
    rate: product.rate,
    image: product.image,
  };

  useEffect(() => {
    return ()=>{
   
    } //necessary to unmount with and unsubscribe to asynchronous funcs
   }, []); 


  const onSubmit = async (values) => {
    axios.defaults.headers.common['x-auth-token'] = localStorage.getItem('token');
    try {
      if (isBrowsed) { //user chose to upload an image from his own directories
        const formData = new FormData();
        formData.append('file', file);

        const res = await axios.post(uploadImgUrl, formData);
        const { imagePath } = res.data;
        values.image = imagePath
      }

      if (product) await axios.put(`${productsUrl}/${product._id}`, { ...values, }); //edit (product had initial values)     
      else await axios.post(productsUrl, { ...values }); //add item to the stock

      const content = product ? 'has been edited' : 'was added';
      alert(`Item ${content} successfully`);
      history.push(`/catalog`, { manager: user });
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div>
      <Button
        color="primary"
        style={{ align: 'left' }}
        onClick={() => history.push(`/catalog`, { manager: user })}
      >
        Return to catalog
      </Button>
      <Container component="main" maxWidth="xs">
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
                  label="Name"
                  value={formik.values.name}
                  name="name"
                  formik={formik}
                />
                <MyTextField
                  label="Company"
                  value={formik.values.company}
                  name="company"
                  formik={formik}
                />
                <RenderSelect
                  label="Category"
                  value={formik.values.category}
                  options={categoryOptions}
                  name="category"
                  formik={formik}
                />
                <RenderSelect
                  label="Gender"
                  value={formik.values.gender}
                  options={genderTypes}
                  name="gender"
                  formik={formik}
                />
                <MyTextField
                  label="Description"
                  name="description"
                  option="textarea"
                  value={formik.values.description}
                  formik={formik}
                />
                <MyTextField
                  label="Price"
                  name="price"
                  value={!formik.values.price ? formik.values.price : formik.values.price > 0 ? formik.values.price : 0}
                  formik={formik}
                  type="number"
                />
                <MyTextField
                  label="Items"
                  name="items"
                  value={!formik.values.items ? formik.values.items : formik.values.items > 0 ? formik.values.items : 0}
                  formik={formik}
                  type="number"
                />
                <MyTextField
                  label="Rate"
                  name="rate"
                  value={renderRateRange(formik.values.rate)}
                  formik={formik}
                  type="number"
                />
                <MyTextField
                  label="Url Address"
                  value={formik.values.image}
                  name="image"
                  formik={formik}
                  option="file"
                  setIsBrowsed={setIsBrowsed}
                  path={path}
                  setPath={setPath}
                  setFile={setFile}
                />
                <div style={{ marginTop: '1rem' }}>
                  <Button
                    type="submit"
                    disabled={!(formik.dirty && formik.isValid)}
                    variant="contained"
                    color="primary" >
                    {mode === 'add' ? 'Add item' : 'Save changes'}
                  </Button>
                  <Button type="reset" color="secondary">
                    Reset
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </Container>
    </div>
  );
}

export default ItemForm;


