import React from 'react';
import ReactDOM from 'react-dom';

import CurrencyInput from '../src/index';

ReactDOM.render(
  <CurrencyInput
    type="text"
    decimalSeparator="."
    precision={2}
    onChange={value => console.log('Change', value)}
  />,
  document.getElementById('example')
);
