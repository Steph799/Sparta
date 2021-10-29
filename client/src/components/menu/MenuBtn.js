import React, { useState, useEffect } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { currentValues } from '../filters/FilterMenu';
import axios from 'axios';
import { getCompleteStock } from '../Catalog';
import { categoryOptions, filterUrl, pageSize } from '../shared/constants';

export let currentIndex = 0;

export const includeFilters = async (index, page = 1, numOfProducts = null) => {
  const paramsObj = {
    pageNumber: page,
    pageSize: pageSize,
    numOfProducts: numOfProducts,
    gender: currentValues.gender,
    range: currentValues.range,
    rate: currentValues.rate,
    sort: currentValues.sort,
  };

  try {
    const res = categoryOptions[index] === 'All categories' ? await axios.get(filterUrl, { params: { ...paramsObj } }) :
      await axios.get(filterUrl, { params: { category: categoryOptions[index], ...paramsObj } });

    return res.data;
  } catch (error) {
    alert(error);
  }
};

export const noFilters = async (index, page = 1, numOfProducts = null) => { //only category
  try {
    const res = categoryOptions[index] === 'All categories' ? await getCompleteStock(page, numOfProducts) :
      await axios.get(filterUrl, {params: {category: categoryOptions[index], pageNumber: page, pageSize: pageSize,
         numOfProducts: numOfProducts}});

    return res.data;
  } catch (error) {
    alert(error);
  }
};


export default function SimpleListMenu(setFilteredStock, onSelect, setNumOfProducts, setPage) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const open = Boolean(anchorEl);

  const handleClickListItem = (event) => setAnchorEl(event.currentTarget);

  const handleMenuItemClick = (event, index) => {
    onSelect();

    currentIndex = index;
    setSelectedIndex(index);
    setAnchorEl(null);
    const specificCategoryItems = currentValues ? includeFilters(index) : noFilters(index);

    specificCategoryItems.then((res) => {
      setFilteredStock(res.products)
      setNumOfProducts(res.quantity)
      setPage(1)
    });
  }
 
  useEffect(() => {
    return () => {currentIndex = 0}
  }, []);
  
  return (
    <div style={{ width: '10rem' }}>
      <List
        component="nav"
        aria-label="Device settings"
        sx={{ bgcolor: 'background.paper' }}  >
        <ListItem
          button
          style={{
            maxWidth: '10rem',
            maxHeight: '3rem',
            minWidth: '3rem',
            minHeight: '3rem',
            marginLeft: '-1rem',
          }}
          id="lock-button"
          aria-haspopup="listbox"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickListItem}  >
          <ListItemText
            primary={
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                color="inherit" >
                <MenuIcon />
              </IconButton>
            }
            secondary={<span style={{ color: 'white' }}>{categoryOptions[selectedIndex]}</span>}
          />
        </ListItem>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{'aria-labelledby': 'lock-button', role: 'listbox'}}
      >
        {categoryOptions.map((option, index) => (
          <MenuItem
            key={option}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
