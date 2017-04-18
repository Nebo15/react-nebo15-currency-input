import React from 'react';
import KeyboardEvent from 'keyboardevent-key-polyfill';

import normalizeValue from './normalizeValue';

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

export default class CurrencyInput extends React.Component {
  static defaultProps = {
    onChange: () => {},
    onBlur: () => {},
    onInput: () => {},
    onPaste: () => {},
    onKeyDown: () => {},
    precision: 0,
  };

  constructor(props) {
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onInput = this.onInput.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onPaste = this.onPaste.bind(this);
  }

  componentDidMount() { // eslint-disable-line
    KeyboardEvent.polyfill();
  }

  onKeyDown(e) {
    const { decimalSeparator, precision, maxLength } = this.props;
    const decimalPosition = e.target.value.indexOf(decimalSeparator);

    if (e.key === decimalSeparator && !~decimalPosition && precision) {
      return;
    }

    if (!isWhiteListKey(e.key) && !isNumber(e.key) && !e.ctrlKey && !e.metaKey) {
      prevent(e);
    }

    if (isNumber(e.key) && e.target.value.split(decimalSeparator)[0].length >= maxLength) {
      const focus = this.$input.selectionStart;

      if (!~decimalPosition || focus <= decimalPosition) {
        prevent(e);
      }
    }

    this.props.onKeyDown(e);
  }

  onBlur(e) {
    const { decimalSeparator, precision } = this.props;

    this.value = normalizeValue(e.target.value, {
      decimalSeparator,
      precision,
      zeroFill: true,
    });

    this.props.onBlur(e);
  }

  onPaste(e) {
    const { decimalSeparator, precision, maxLength } = this.props;
    setTimeout(() => {
      this.value = normalizeValue(this.$input.value, { decimalSeparator, precision, maxLength });
    }, 0);

    this.props.onPaste(e);
  }

  onInput(e) {
    const { decimalSeparator, precision, maxLength } = this.props;
    const value = e.target.value;
    const decimalPosition = value.indexOf(decimalSeparator);

    if (~decimalPosition) {
      const decimalLength = value.split(decimalSeparator)[1].length;

      if (decimalLength > precision) {
        const val = value.split(decimalSeparator);
        this.setValueAndFocus(`${val[0]}${decimalSeparator}${val[1].slice(0, precision)}`);
      }
    }

    if (!~decimalPosition) {
      const intLength = value.split(decimalSeparator)[0].length;

      if (intLength > maxLength) {
        this.value = value.slice(0, maxLength);
        return;
      }
    }

    if (/^0[\d]+/.test(this.$input.value)) {
      const focus = this.$input.selectionStart;
      this.setValueAndFocus(value.replace(/^0/, ''), focus - 1);
    }

    const normalize = normalizeValue(value, { decimalSeparator, precision, maxLength });
    (value !== this.lastValue) && this.props.onChange(normalize, value);
    this.lastValue = value;

    this.props.onInput(e);
  }

  setValueAndFocus(value, focus) {
    focus = focus !== undefined ? focus : this.$input.selectionStart; // eslint-disable-line

    this.$input.value = value;
    this.$input.selectionStart = focus;
    this.$input.selectionEnd = focus;
  }

  lastValue = null;

  set value(value) {
    if (this.lastValue === value) {
      return;
    }

    if (this.$input.value !== value) {
      this.setValueAndFocus(value);
    }

    this.lastValue = value;
    this.props.onChange(value, this.$input.value);
  }

  render() {
    const { decimalSeparator, thousandSeparator, precision, onChange, maxLength, ...props } = this.props; // eslint-disable-line

    return (
      <input
        {...props}
        onInput={this.onInput}
        onKeyDown={this.onKeyDown}
        onPaste={this.onPaste}
        onBlur={this.onBlur}
        ref={(v) => { this.$input = v; }}
      />
    );
  }
}
