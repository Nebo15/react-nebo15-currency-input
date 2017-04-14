
export default (value, decimalSeparator, precision) => {
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

  if (/^0[\d]+/.test(result)) {
    result = result.replace(/^0+/, '');
  }

  return result;
};
