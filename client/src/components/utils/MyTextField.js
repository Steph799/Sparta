import React from 'react';
import { ErrorMessage } from 'formik';
import { TextField } from '@material-ui/core';
import TextError from './TextError';


function MyTextField(props) {
  const { handleChange, handleBlur } = props.formik;
  const { value, name, label, id, type, block, option, setIsBrowsed, path, setPath, setFile } = props;
  const isTextArea = option === 'textarea'

  const insertFile = (e) => {
    setIsBrowsed(true) //verify that user uploaded an image and didn't import it from the internet
    setPath(e.target.files[0].name)  
    setFile(e.target.files[0]); 
  }

  return (
    <div className="form-control" style={{ marginBottom: '1rem' }}>
      <TextField
        value={path || value}
        onChange={handleChange}
        onBlur={handleBlur}
        variant="outlined"
        required
        name={name}
        id={id}
        label={label}
        type={'text' && type}
        style={isTextArea ? { width: '14rem' } : null}
        multiline={isTextArea}
        minRows={isTextArea ? 2 : null}
        maxRows={isTextArea ? 4 : null}
        autoFocus={name === 'firstName' || name === 'name'}
        disabled={block}
      />
      {option === "file" && (
        <input
          type="file"
          accept="image/*"
          name={name}
          onChange={(e) => { handleChange(e); insertFile(e) }}      
        />
      )}
      <ErrorMessage name={name} component={TextError} />
    </div>
  );
}

export default MyTextField;

