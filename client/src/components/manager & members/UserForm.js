import React from 'react';
import {minUserNameLength, minPasswordLength, usersUrl, minIdVal, minIdDigitsError, minUserNameDigitsError,
   minPasswordDigitsError} from '../shared/constants' 
import MyTextField from '../utils/MyTextField';
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
  userName: '',
  password: '',
  showPassword: true,
};

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('Required!'),
  lastName: Yup.string().required('Required!'),
  id: Yup.number().min(minIdVal, minIdDigitsError).required('Required!'),
  email: Yup.string().email('Invalid email format').required('Required!'),
  userName: Yup.string().min(minUserNameLength, minUserNameDigitsError).required('Required!'),
  password: Yup.string().when('showPassword', {is: true,then: Yup.string()
    .min(minPasswordLength, minPasswordDigitsError).required('Required!')}),
});

function UserForm(props) {
  const history = useHistory();
  const { user } = props.location.state;

  const savedValues = user.userData && {
    firstName: user.userData.firstName,
    lastName: user.userData.lastName,
    id: user.userData.id,
    email: user.userData.email,
    userName: user.userData.userName,
  };

  const userType = user.userMember ? 'userMember' : 'manager';

  const navigate = (newValues = null) => {
    if (user.userMember) history.push(`/catalog`, { userMember: user[userType], userData: newValues || user.userData });
    else history.push(`/catalog`, { manager: user[userType] });
  };

  const onSubmit = async (values) => {
    axios.defaults.headers.common['x-auth-token'] = localStorage.getItem('token');
    try {
      if (user.userMember) await axios.put(usersUrl, { ...values }); //update user values in the db    
      else await axios.post(usersUrl, { ...values }); //add user values to the db        
    } catch (error) {
      alert(error);
    }
    navigate(values);
  };

  return (
    <div>
      <Button color="primary" style={{ align: 'left' }} onClick={() => navigate()}>
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
                  label="First name"
                  value={formik.values.firstName}
                  name={'firstName'}
                  formik={formik}
                />
                <MyTextField
                  label="Last name"
                  value={formik.values.lastName}
                  name="lastName"
                  formik={formik}
                  id="LastName"
                />
                <MyTextField
                  label="Id"
                  value={formik.values.id >= 0 ? formik.values.id : 0}
                  name="id"
                  formik={formik}
                  type="number"
                  id="id"
                />
                <MyTextField
                  label="Email"
                  value={formik.values.email}
                  name="email"
                  formik={formik}
                  type="email"
                  id="email"
                />
                <MyTextField
                  label="UserName"
                  value={formik.values.userName}
                  name="userName"
                  formik={formik}
                  id="userName"
                />
                {!user.userMember && (
                  <MyTextField
                    label="Password"
                    value={formik.values.password}
                    name="password"
                    formik={formik}
                    type="password"
                    id="password"
                  />
                )}
                <div style={{ marginTop: '1rem' }}>
                  <Button
                    type="submit"
                    disabled={!(formik.dirty && formik.isValid)}
                    variant="contained"
                    color="primary" >
                    {user.userMember ? 'Save changes' : 'Add user'}
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

export default UserForm;


