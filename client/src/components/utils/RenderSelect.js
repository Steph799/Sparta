import React from 'react';
import { TextField } from '@material-ui/core';
import TextError from './TextError';
import { ErrorMessage } from 'formik';

function RenderSelect(props) {

  const { value, formik, options, name, label } = props;
  const { handleChange, handleBlur } = formik;
  const Label = `Select ${label}`
  
  return (
    <div>
      <TextField
        select
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        name={name}
        variant="outlined"
        label={Label}
        margin="normal"
        style={{ width: '14rem' }}
        required
      >
        {options.map((option) => <option key={option} value={option} style={{ cursor: "pointer" }}> {option} </option>)}      
      </TextField>
      <ErrorMessage name={name} component={TextError} />
    </div>
  );
}

export default RenderSelect;
//omit index