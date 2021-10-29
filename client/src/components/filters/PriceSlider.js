import React, { useState, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import Slider from '@material-ui/core/Slider';
import FormLabel from '@material-ui/core/FormLabel';

const valueText = (value) => value;

export default function PriceSlider(props) {
  const [values, setValues, handleGeneralChange] = props.constants;
  const { range } = values;
  const [prevRange, setPrevRange] = useState(range)

  useEffect(() => {
    if (range[0] !== prevRange[0] || range[1] !== prevRange[1]) {
      setPrevRange(range)
      handleGeneralChange(values);
    }
  }, [range]);

  return (
    <div component="fieldset" >
      <FormLabel
        component="legend"
        style={{ marginBottom: '1.8rem', marginLeft: '5rem' }}
      >
        Price range
      </FormLabel>
      <div style={{ margin: '1rem' }}>
        <Box sx={{ width: 300 }}>
          <Slider
            id="priceSlider"
            name={props.name}
            getAriaLabel={() => 'Price range'}
            min={5}
            step={5}
            max={500}
            value={props.value}
            onChange={(event, newValue) => setValues({ ...values, range: newValue })}
            valueLabelDisplay="auto"
            getAriaValueText={valueText}
          />
        </Box>
      </div>
    </div>
  );
}
