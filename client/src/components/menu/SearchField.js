import React from 'react';
import { currentIndex, includeFilters, noFilters } from './MenuBtn';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { currentValues } from '../filters/FilterMenu';
import axios from 'axios';
import { filterUrl, pageSize} from '../shared/constants'

const useStyles = makeStyles((theme) => ({input: { background: 'rgb(255, 255, 255)' }}));

export const findMatch = async (searchValue, currentPage = 1) => {
  const findByInput = await axios.get(filterUrl,{ params: { input: searchValue, pageNumber: currentPage, pageSize: pageSize } });
  return findByInput.data
}

function SearchField({ setFilteredStock, inputRef, searchValue, setSearchValue, setNumOfProducts, setSortByInput, setPrevInputValue,
   setPage }) { 
  const classes = useStyles();
  const filterByCurrentValues = async () => currentValues ? await includeFilters(currentIndex) : await noFilters(currentIndex);

  const searchByInput = async () => {
    setSortByInput(true)
    setPrevInputValue(searchValue)
    try {
      const matches = await findMatch(searchValue)
      setFilteredStock(matches.products);
      setNumOfProducts(matches.quantity)
      setPage(1)
    } catch (error) {
      alert(error);
    }
  };

  const handleSearch = async (value) => {
    setSearchValue(value);
    if (!value) {
      try {
        const formerStock = await filterByCurrentValues()
        setPage(1)
        setFilteredStock(formerStock.products);
        setNumOfProducts(formerStock.quantity)
        setSortByInput(false)
      } catch (error) {
        alert(error)
      }
    }  //empty string in the filed (after deleting-return to
    // the normal search)- search in the whole stock without considering the other filters
  };
  return (
    <div>
      <TextField
        value={searchValue}
        inputRef={inputRef}
        onInput={(e) => { handleSearch(e.target.value.toLowerCase()) }}
        placeholder="Search in the store"
        style={{ width: '15rem' }}
        InputProps={{
          className: classes.input,
          endAdornment: (
            <IconButton onClick={() => searchByInput()}>
              <SearchIcon />
            </IconButton>
          )
        }}
      />
    </div>
  );
}

export default SearchField;

