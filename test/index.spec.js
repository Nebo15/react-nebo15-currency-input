import React from 'react';
import { mount } from 'enzyme';
import CurrencyInput from '../src/index';

describe('Currency input', () => {
  it('render input', () => {
    const elem = mount(<CurrencyInput type="text" />);
    expect(elem.find('input[type="text"]')).to.have.length(1);
  });

  describe('onChange', () => {
    it('should be called on input event', () => {
      const cb = sinon.spy();
      const elem = mount(<CurrencyInput type="text" onChange={cb} />);
      elem.find('input').simulate('input', { target: { value: '1000' } });
      expect(cb).to.have.been.calledWith('1000');
    });

    it('normalize decimal', () => {
      const cb = sinon.spy();
      const elem = mount(<CurrencyInput type="text" onChange={cb} precision={2} decimalSeparator="." />);
      elem.find('input').simulate('input', { target: { value: '100.1234' } });
      expect(cb).to.have.been.calledWith('100.12');
    });
  });
});
