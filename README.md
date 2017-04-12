# CurrencyInput

Component for formatting amount in input

### Usage

```javascript
import CurrencyInput from 'react-nebo15-currency-input';

ReactDOM.render(
  <CurrencyInput
    type="text"
    decimalSeparator="."
    precision={2}
    onChange={(value) => console.log('Change', value)}
  />,
  document.getElementById('root')
);
```

### Properties

- `decimalSeparator` — Decimal separator
- `precision` - Max decimal precision length
- `onChange(value: String)` - On input change callback, value is normalized

Other props thrown into input element