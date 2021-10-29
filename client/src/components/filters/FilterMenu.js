import React, { useState, useEffect } from 'react';
import { Button, Container } from '@material-ui/core';
import Genders from './Genders';
import PriceSlider from './PriceSlider';
import Rate from './Rate';
import { Formik, Form } from 'formik';
import { currentIndex, includeFilters, noFilters } from '../menu/MenuBtn';
import Sort from '../Sorts/Sort';

export let currentValues;
function FilterMenu({ setFilteredStock, onSelect, setNumOfProducts, setPage }) {
  const [click, setClick] = useState(false);
  const initialValues = {
    gender: '',
    range: [5, 500],
    rate: 'All rates',
    sort: '', //by price or by rate
  };
  const [values, setValues] = useState(initialValues);
  let toggleContent = click ? 'CLOSE' : 'FILTERS & SORTS';
  useEffect(() => {
    return ()=>{
      currentValues = null
    }
  }, []);

  const handleSort = (newValues) => {
    if (!newValues.sort) return;

    onSelect()
    currentValues = newValues;
    const sorted = includeFilters(currentIndex);
    sorted.then((res) => {updateStock(res.products, res.quantity)});
  };

   //filter & sort
  const handleGeneralChange = (newValues) => { 
    onSelect() //init input to empty string
    currentValues = newValues;
    const generalFiltered = includeFilters(currentIndex);
    generalFiltered.then((res) => {updateStock(res.products, res.quantity)})
  };

  const constants = [values, setValues, handleGeneralChange];

  const updateStock=(products, quantity)=>{
    setFilteredStock(products)
    setNumOfProducts(quantity)
    setPage(1)
  }

  const handleReset = async () => {
    setValues(initialValues);
    currentValues=null

    onSelect();
    const stock = await noFilters(currentIndex);  
    updateStock(stock.products, stock.quantity)
  };

  const flexContainer = {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '-2rem',
  };

  const divStyle = {
    backgroundColor: 'rgb(211, 211, 211)',
    width: '100%',
    height: '4.2rem',
  };

  return (
    <div style={click ? divStyle : null}>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setClick(!click)}
        style={{ width: '6rem' }}
      >
        {toggleContent}
      </Button>
      {click && <Container>
        <Formik initialValues={initialValues} enableReinitialize>
          {(formik) => {
            return (
              <Form style={flexContainer}>
                <Genders
                  value={values.gender}
                  name="gender"
                  constants={constants}
                />
                <PriceSlider
                  value={values.range}
                  name="range"
                  constants={constants}
                />
                <Rate value={values.rate} name="rate" constants={constants} />
                <Sort
                  value={values.sort}
                  name="sort"
                  constants={constants}
                  handleSort={handleSort}
                />
                <Button
                  type="reset"
                  style={{
                    maxWidth: '3rem',
                    maxHeight: '2rem',
                    minWidth: '3rem',
                    minHeight: '2rem',
                    marginLeft: '3rem',
                    marginTop: '1rem',
                    fontWeight: 'bold',
                  }}
                  onClick={() => handleReset()}
                >
                  Reset
                </Button>
              </Form>
            );
          }}
        </Formik>
      </Container>
      }
    </div>
  );
}

export default FilterMenu;

