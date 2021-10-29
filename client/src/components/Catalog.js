import React, { useEffect, useState } from 'react';
import FilterMenu from './filters/FilterMenu';
import MyMenu from './menu/MyMenu';
import DisplayProducts from './DisplayProducts';
import axios from 'axios';
import { pageSize, productsUrl } from './shared/constants';

/* axios should be a file that handle all http request / response and error */
/* also learn about interceptor */
/* all http request should be in a http service and you should just call the functions in the components that needs it */


export const getCompleteStock = async (pageNumber=1, numOfProducts= null) => {
  try {
    return await axios.get(productsUrl,{ params: { pageNumber: pageNumber, pageSize: pageSize, numOfProducts: numOfProducts}});
  } catch (error) {
   alert(error); 
  }
};

function Catalog(props) {
  const [filteredStock, setFilteredStock] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [prevInputValue, setPrevInputValue] = useState(searchValue)
  const [sortByInput, setSortByInput] = useState(false)
  const [numOfProducts, setNumOfProducts] = useState(0)
  const [user, setUser] = useState(props.history.location.state);
  const [page, setPage] = useState(1);


  const onSelect = () =>{
    setSortByInput(false)
    return searchValue && setSearchValue('');
  } 

  useEffect( () => {
    async function fetchMyApi(){
      const stock = await getCompleteStock();
      setFilteredStock(stock.data.products);
      setNumOfProducts(stock.data.quantity)
    }
    fetchMyApi()
  }, []);

  return (
    <div>
      <MyMenu
        user={user} 
        setUser={setUser}
        setFilteredStock={setFilteredStock}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        onSelect={onSelect}
        setNumOfProducts={setNumOfProducts}
        setSortByInput={setSortByInput}
        setPrevInputValue={setPrevInputValue}
        setPage={setPage}
      />
      <FilterMenu
        setFilteredStock={setFilteredStock}
        onSelect={onSelect}
        setNumOfProducts={setNumOfProducts}
        setPage={setPage}
      />
      <DisplayProducts
        filteredStock={filteredStock}
        setFilteredStock={setFilteredStock}
        user={user}
        numOfProducts={numOfProducts}
        setNumOfProducts={setNumOfProducts}
        searchValue={searchValue}
        sortByInput={sortByInput}
        prevInputValue={prevInputValue}
        page={page}
        setPage={setPage}
      />
    </div>
  );
}

export default Catalog;

