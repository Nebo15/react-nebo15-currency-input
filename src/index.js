import React from 'react';
import KeyboardEvent from 'keyboardevent-key-polyfill';

KeyboardEvent.polyfill();

const WHITELIST_KEYS = [
  'Backspace', 'ArrowUp', 'ArrowDown', 'Tab',
  'ArrowLeft', 'ArrowRight', 'Enter', 'Escape',
];

const prevent = (e) => {
  e.preventDefault();
  e.stopPropagation();
  e.returnValue = false; // eslint-disable-line
  e.cancelBubble = true; // eslint-disable-line
};

const isNumber = key => /[\d]+/.test(key);
const isWhiteListKey = key => ~WHITELIST_KEYS.indexOf(key);
const normalizeValue = (value, decimalSeparator, precision) => {
  let result = value.replace(new RegExp(`[^\\d\\${decimalSeparator}]+`, 'g'), '');

  result = result.split('.');

  if (result.length > 2) {
    result[1] = result.slice(1).join('');
  }

  if (result.length > 2) {
    result = `${result[0]}.${result[1].replace('.', '').slice(0, precision)}`;
  } else {
    if (result[1]) {
      result[1] = result[1].slice(0, precision);
    }

    result = result.join('.');
  }

  if (result.indexOf(decimalSeparator) === 0) {
    result = `0${result}`;
  }

  if (result.length && result.indexOf(decimalSeparator) === result.length - 1) {
    result = `${result}${new Array(precision + 1).join('0')}`;
  }

  return result;
};

export default class CurrencyInput extends React.Component {
  static defaultProps = {
    onChange: () => {},
  };

  componentDidMount() {
    const { decimalSeparator, precision } = this.props;

    this.onKeyDown = (e) => {
      const decimalPosition = e.target.value.indexOf(decimalSeparator);

      if (e.key === decimalSeparator && !~decimalPosition && precision) {
        return;
      }

      if (!isWhiteListKey(e.key) && !isNumber(e.key) && !e.ctrlKey && !e.metaKey) {
        prevent(e);
      }
    };

    this.onBlur = () => {
      this.value = normalizeValue(this.$input.value, decimalSeparator, precision);
    };

    this.onPaste = () => {
      setTimeout(() => {
        this.value = normalizeValue(this.$input.value, decimalSeparator, precision);
      }, 0);
    };

    this.onInput = () => {
      const decimalPosition = this.$input.value.indexOf(decimalSeparator);

      if (~decimalPosition) {
        const decimalLength = this.$input.value.split(decimalSeparator)[1].length;

        if (decimalLength > precision) {
          const focus = this.$input.selectionStart;
          const val = this.$input.value.split(decimalSeparator);

          this.$input.value = `${val[0]}${decimalSeparator}${val[1].slice(0, precision)}`;
          this.$input.selectionStart = focus;
          this.$input.selectionEnd = focus;
        }
      }

      if (/^0[\d]+/.test(this.$input.value)) {
        const focus = this.$input.selectionStart;

        this.$input.value = this.$input.value.replace(/^0+/, '');
        this.$input.selectionStart = focus - 1;
        this.$input.selectionEnd = focus - 1;
      }

      const value = this.$input.value;
      const normalize = normalizeValue(value, decimalSeparator, precision);

      (value !== this.lastValue) && this.props.onChange(normalize);
      this.lastValue = value;
    };

    this.$input.addEventListener('keydown', this.onKeyDown, false);
    this.$input.addEventListener('blur', this.onBlur, false);
    this.$input.addEventListener('paste', this.onPaste, false);
    this.$input.addEventListener('input', this.onInput, false);
  }

  componentWillUnmount() {
    this.$input.removeEventListener('keydown', this.onKeyDown, false);
    this.$input.removeEventListener('blur', this.onBlur, false);
    this.$input.removeEventListener('paste', this.onPaste, false);
    this.$input.removeEventListener('input', this.onInput, false);
  }

  lastValue = null;
  set value(value) {
    if (this.lastValue === value) {
      return;
    }

    if (this.$input.value !== value) {
      const focus = this.$input.selectionStart;
      this.$input.value = value;
      this.$input.selectionStart = focus;
      this.$input.selectionEnd = focus;
    }

    this.lastValue = value;
    this.props.onChange && this.props.onChange(value);
  }

  render() {
    const { decimalSeparator, thousandSeparator, precision, onChange, ...props } = this.props; // eslint-disable-line

    return (
      <input ref={ref => (this.$input = ref)} {...props} />
    );
  }
}
