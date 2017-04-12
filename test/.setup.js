import { expect } from 'chai';
import { jsdom } from 'jsdom';

var exposedProperties = ['window', 'navigator', 'document', 'KeyboardEvent', 'Event'];

global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js'
};

global.KeyboardEvent = window.KeyboardEvent;

global.documentRef = document;
global.expect = expect;