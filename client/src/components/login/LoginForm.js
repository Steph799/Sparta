import * as React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons//LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import {accessDenied, loginUrl, userNameMinError, passwordMinError, minUserNameLength, minPasswordLength} from '../shared/constants'
import { copyright } from '../Footer';

const alertAccessDenied = (error = null) => alert(error || accessDenied) 

const validationSchema = Yup.object().shape({
  username: Yup.string().min(minUserNameLength, userNameMinError).required('Required!'),
  password: Yup.string().min(minPasswordLength, passwordMinError).required('Required!'),
});


const theme = createTheme();

export default function LoginForm({ isManager }) {
  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const username = data.get('username');
    const password = data.get('password');
    try {
      const login = await axios.post(loginUrl, { userName: username, password: password }); //login
      const jwt = login.data; //get JSON web token
      localStorage.setItem('token', jwt);
      const user = jwtDecode(jwt); //get user from decoding JWT

      if (user) { //user exist
        //enter as a manager if you are the manager  
        if (isManager && user.isAdmin) history.push('/catalog', { manager: 'Manager' });  
        //enter as a manager but you are a regular user
        else if (isManager && !user.isAdmin) alertAccessDenied("userName or password is incorrect"); 
        //enter as a user (event if you are manager)  
        else history.push('/catalog', { userMember: username, userData: user });     
      }
    } catch (error) {
      alertAccessDenied(error); //not even a user
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Button
        color="primary"
        style={{ align: 'left' }}
        onClick={() => history.push('/catalog')}
      >
        Return to catalog
      </Button>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="username"
              name="username"
              autoComplete="username"
              autoFocus
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              color="primary"
            >
              Sign In
            </Button>
          </Box>
        </Box>
       {copyright()}
      </Container>
    </ThemeProvider>
  );
}

