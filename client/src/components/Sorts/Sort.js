import React, {  useEffect } from 'react';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';


function Sort({ value, name, constants, handleSort }) {
  const [values, setValues] = constants;
  const { sort } = values;

  useEffect(() => {
    if (sort) handleSort(values);
  }, [sort]);

  return (
    <div>
      <FormLabel component="legend" style={{ marginLeft: '3rem' }}>
        Sorts
      </FormLabel>
      <RadioGroup
        value={value}
        name={name}
        className="radioGroup"
        row
        aria-label="sort"
        onChange={(e) => { setValues({ ...values, sort: e.target.value });}}       
      >
        <FormControlLabel
          value="Sort by price"
          control={<Radio />}
          label="By price"
        />
        <FormControlLabel
          value="Sort by rate"
          control={<Radio />}
          label="By rate"
        />
      </RadioGroup>
    </div>
  );
}

export default Sort;
