
export default (value, { decimalSeparator, precision, zeroFill = false }) => {
  let result = value.replace(new RegExp(`[^\\d\\${decimalSeparator}]+`, 'g'), '');
  result = result.split(decimalSeparator);

  if (result.length > 2) {
    result[1] = result.slice(1).join('');
  }

  if (result.length > 2) {
    result = `${result[0]}.${result[1].replace(decimalSeparator, '').slice(0, precision)}`;
  } else {
    if (result[1]) {
      result[1] = result[1].slice(0, precision);
    }

    result = result.join(decimalSeparator);
  }

  if (result.indexOf(decimalSeparator) === 0) {
    result = `0${result}`;
  }

  if (zeroFill && result.length && result.indexOf(decimalSeparator) === result.length - 1) {
    result = `${result}${new Array(precision + 1).join('0')}`;
  }

  if (/^0[\d]+/.test(result)) {
    result = result.replace(/^0+/, '');
  }

  return result;
};
