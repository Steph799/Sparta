import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormLabel from '@material-ui/core/FormLabel';

const useStyles = makeStyles((theme) => ({
  button: {display: 'block', marginTop: theme.spacing(2),},
  formControl: {margin: theme.spacing(1), minWidth: 120}
}));

export default function ControlledOpenSelect({ value, name: Name, constants }) {
  const classes = useStyles();
  const [values, setValues, handleGeneralChange] = constants;
  const [open, setOpen] = useState(false);
  const { rate } = values;
  const [prevRate, setPrevRate] = useState(rate);

  useEffect(() => {
    if (prevRate !== rate) {
      setPrevRate(rate)
      handleGeneralChange(values);
    }
  }, [rate]);

  return (
    <div>
      <FormLabel component="legend" style={{ marginBottom: '-0.5rem' }}>
        Rating
      </FormLabel>
      <FormControl className={classes.formControl} id="selectRate">
        <InputLabel id="demo-controlled-open-select-label">Stars</InputLabel>
        <Select
          name={Name}
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={open}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          value={value}
          onChange={(event) => setValues({ ...values, rate: event.target.value })}
        >
          <MenuItem value={'All rates'}>All rates</MenuItem>
          <MenuItem value={1}>0-2 stars</MenuItem>
          <MenuItem value={2}>2-4 stars</MenuItem>
          <MenuItem value={3}>4-5 stars</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
