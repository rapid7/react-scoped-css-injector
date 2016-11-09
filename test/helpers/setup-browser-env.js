const jsdom = require('jsdom');
const jsdomGlobal = require('jsdom-global');

const doc = jsdom.jsdom('<!DOCTYPE html><html><body></body></html>');
const win = doc.defaultView;
const nav = win.navigator;

global.document = doc;
global.window = win;
global.navigator = nav;

jsdomGlobal();
