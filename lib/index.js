'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SCRAPERS = exports.createScraper = undefined;

var _factory = require('./scrapers/factory');

Object.defineProperty(exports, 'createScraper', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_factory).default;
  }
});

var _definitions = require('./definitions');

Object.defineProperty(exports, 'SCRAPERS', {
  enumerable: true,
  get: function get() {
    return _definitions.SCRAPERS;
  }
});
exports.requestedChromiumVersion = requestedChromiumVersion;

require('core-js/modules/es6.typed.array-buffer');

require('core-js/modules/es6.typed.int8-array');

require('core-js/modules/es6.typed.uint8-array');

require('core-js/modules/es6.typed.uint8-clamped-array');

require('core-js/modules/es6.typed.int16-array');

require('core-js/modules/es6.typed.uint16-array');

require('core-js/modules/es6.typed.int32-array');

require('core-js/modules/es6.typed.uint32-array');

require('core-js/modules/es6.typed.float32-array');

require('core-js/modules/es6.typed.float64-array');

require('core-js/modules/es6.map');

require('core-js/modules/es6.set');

require('core-js/modules/es6.weak-map');

require('core-js/modules/es6.weak-set');

require('core-js/modules/es6.promise');

require('core-js/modules/es6.symbol');

require('core-js/modules/es6.function.name');

require('core-js/modules/es6.array.from');

require('core-js/modules/es7.object.values');

require('core-js/modules/es7.object.entries');

require('core-js/modules/es7.object.get-own-property-descriptors');

require('core-js/modules/es7.string.pad-start');

require('core-js/modules/es7.string.pad-end');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function requestedChromiumVersion() {
  // The chromium version was copied automatically during the publish process
  // from './node_modules/puppeteer-core/package.json, property:
  //   "puppeteer": {
  //     "chromium_revision": "XXXX"
  //   }
  return '656675';
}