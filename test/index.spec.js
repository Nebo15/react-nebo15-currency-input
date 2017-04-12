import React from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

chai.use(spies);

import CurrencyInput from '../src/index';

describe('Currency input', () => {
  it('render input', () => {
    const elem = mount(<CurrencyInput type="text" />);
    expect(elem.find('input[type="text"]')).to.have.length(1);
  });

  it('onChange', () => {
    const onChange = chai.spy(() => {});
    const elem = mount(<CurrencyInput type="text" onChange={onChange} />);

    document.body.dispatchEvent(new window.Event('input', { bubbles: true }));

    elem.find('input').simulate('change', { target: { value: '1000' } });

    expect(onChange).to.have.been.called();
  })
});
