import React, { useEffect } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { genderTypes } from '../shared/constants';


export default function Genders({ value, name, constants }) {
  const [values, setValues, handleGeneralChange] = constants;
  const { gender } = values;

  useEffect(() => {
    if (gender) handleGeneralChange(values)
  }, [gender]);

  return (
    <FormControl component="fieldset" >
      <FormLabel component="legend">Gender</FormLabel>
      <RadioGroup
        value={value}
        className="radioGroup"
        row
        aria-label="gender"
        onChange={(e) => setValues({ ...values, gender: e.target.value })}
        name={name}
      >
        {genderTypes.map((type, index) => <FormControlLabel key={index} value={type} control={<Radio />} label={type} />)}
      </RadioGroup>
    </FormControl>
  );
}

