import React, {  useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar } from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import SimpleListMenu from './MenuBtn';
import SearchField from './SearchField';
import { confirmLogOut } from '../shared/constants';

const useStyles = makeStyles((theme) => ({
  root: { flexGrow: 1 },
  menuButton: { marginRight: theme.spacing(2) },
  title: { flexGrow: 1 },
}));

function MyMenu({ user, setUser, setFilteredStock, searchValue, setSearchValue, onSelect, setNumOfProducts, setSortByInput,
 setPrevInputValue, setPage}) {
  const classes = useStyles();
  const history = useHistory();
  const inputField = useRef();
  

  const redirect = (value, isManager) => {
    switch (value) {
      case 'login':
      case 'admin':
        history.push(`/${value}`, { isManager: isManager }); //enter as a vip member or admin
        break;
      case 'adduser':
      case 'edituser':
        history.push(`/${value}`, { user: user }); //add or edit user
        break;
      default:
        history.push(`/${value}`, { mode: 'add', product: null }); //add item
        break;
    }
  };

  const logOut = () => {
    if (window.confirm(confirmLogOut)) {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          {SimpleListMenu(setFilteredStock, onSelect, setNumOfProducts, setPage )}
          <SearchField
            setFilteredStock={setFilteredStock}
            inputRef={inputField}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            setNumOfProducts={setNumOfProducts}
            setSortByInput={setSortByInput}
            setPrevInputValue={setPrevInputValue}
            setPage={setPage}
          />
          <Typography
            variant="h5"
            className={classes.title}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            Sparta catalog
          </Typography>
          {user && user.manager && (
            <React.Fragment>
              <Button color="inherit" onClick={() => redirect('additem')}>
                Add item
              </Button>
              <Button color="inherit" onClick={() => redirect('adduser')}>
                Add user
              </Button>
            </React.Fragment>
          )}
          {user && user.userMember && (
            <Button color="inherit" onClick={() => redirect('edituser')}>
              Change details
            </Button>
          )}
          {(!user || (user && user.userMember)) && (
            <Button
              color="inherit"
              onClick={user && user.userMember ? logOut : () => redirect('login', false)}   
            >
              {user && user.userMember ? `Hi ${user.userMember}` : 'Login'}
            </Button>
          )}
          {(!user || (user && user.manager)) && (
            <Button
              color="inherit"
              onClick={user && user.manager ? logOut : () => redirect('admin', true)}  
            >
              {user && user.manager ? 'Manger mode' : 'Admin'}
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default MyMenu;
