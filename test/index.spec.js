import React from 'react';
import { mount } from 'enzyme';
import CurrencyInput from '../src/index';

describe('Currency input', () => {
  it('render input', () => {
    const elem = mount(<CurrencyInput type="text" />);
    expect(elem.find('input[type="text"]')).to.have.length(1);
  });

  it('set value prop', () => {
    const cb = sinon.spy();
    const elem = mount(<CurrencyInput type="text" onChange={cb} precision={2} decimalSeparator="." />);
    elem.instance().value = '999.99';
    expect(cb).to.have.been.calledWith('999.99');
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

    it('normalize two decimal', () => {
      const cb = sinon.spy();
      const elem = mount(<CurrencyInput type="text" onChange={cb} precision={2} decimalSeparator="." />);
      elem.find('input').simulate('input', { target: { value: '100.12.34' } });
      expect(cb).to.have.been.calledWith('100.12');
    });

    it('coma as decimal separator', () => {
      const cb = sinon.spy();
      const elem = mount(<CurrencyInput type="text" onChange={cb} precision={2} decimalSeparator="," />);
      elem.find('input').simulate('input', { target: { value: '100,1234' } });
      expect(cb).to.have.been.calledWith('100,12');
    });

    it('remove before zero', () => {
      const cb = sinon.spy();
      const elem = mount(<CurrencyInput type="text" onChange={cb} precision={2} decimalSeparator="." />);
      elem.find('input').simulate('input', { target: { value: '0100.1234' } });
      expect(cb).to.have.been.calledWith('100.12');
    });

    it('not remove before zero if next is decimal', () => {
      const cb = sinon.spy();
      const elem = mount(<CurrencyInput type="text" onChange={cb} precision={2} decimalSeparator="." />);
      elem.find('input').simulate('input', { target: { value: '0.1234' } });
      expect(cb).to.have.been.calledWith('0.12');
    });

    it('normalize separator and no decimal', () => {
      const cb = sinon.spy();
      const elem = mount(<CurrencyInput type="text" onChange={cb} precision={2} decimalSeparator="." />);
      elem.find('input').simulate('blur', { target: { value: '100.' } });

      expect(cb).to.have.been.calledWith('100.00');
    });

    it('normalize separator and no integer', () => {
      const cb = sinon.spy();
      const elem = mount(<CurrencyInput type="text" onChange={cb} precision={2} decimalSeparator="." />);
      elem.find('input').simulate('input', { target: { value: '.100' } });
      expect(cb).to.have.been.calledWith('0.10');
    });

    it('normalize not number value', () => {
      const cb = sinon.spy();
      const elem = mount(<CurrencyInput type="text" onChange={cb} precision={2} decimalSeparator="." />);
      elem.find('input').simulate('input', { target: { value: 'qwe123qwe' } });
      expect(cb).to.have.been.calledWith('123');
    });

    it('maxLength prop', () => {
      const cb = sinon.spy();
      const elem = mount(<CurrencyInput type="text" onChange={cb} precision={2} maxLength={5} decimalSeparator="." />);
      elem.find('input').simulate('input', { target: { value: '123456789' } });
      expect(cb).to.have.been.calledWith('12345');
    });
  });
});
