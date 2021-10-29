import React from 'react';
import { Alert } from '@material-ui/lab';

const TextError = (props) => <Alert severity="error" style={{ width: '12.5rem' }}> {props.children} </Alert>
 
    
export default TextError;
