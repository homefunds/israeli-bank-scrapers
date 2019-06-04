'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var NORMAL_TXN_TYPE = exports.NORMAL_TXN_TYPE = 'normal';
var INSTALLMENTS_TXN_TYPE = exports.INSTALLMENTS_TXN_TYPE = 'installments';

var SHEKEL_CURRENCY_SYMBOL = exports.SHEKEL_CURRENCY_SYMBOL = '₪';
var SHEKEL_CURRENCY_KEYWORD = exports.SHEKEL_CURRENCY_KEYWORD = 'ש"ח';
var ALT_SHEKEL_CURRENCY = exports.ALT_SHEKEL_CURRENCY = 'NIS';
var SHEKEL_CURRENCY = exports.SHEKEL_CURRENCY = 'ILS';

var DOLLAR_CURRENCY_SYMBOL = exports.DOLLAR_CURRENCY_SYMBOL = '$';
var DOLLAR_CURRENCY = exports.DOLLAR_CURRENCY = 'USD';

var SCRAPE_PROGRESS_TYPES = exports.SCRAPE_PROGRESS_TYPES = {
  INITIALIZING: 'INITIALIZING',
  START_SCRAPING: 'START_SCRAPING',
  LOGGING_IN: 'LOGGING_IN',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILED: 'LOGIN_FAILED',
  CHANGE_PASSWORD: 'CHANGE_PASSWORD',
  END_SCRAPING: 'END_SCRAPING',
  TERMINATING: 'TERMINATING'
};

var LOGIN_RESULT = exports.LOGIN_RESULT = {
  SUCCESS: 'SUCCESS',
  INVALID_PASSWORD: 'INVALID_PASSWORD',
  CHANGE_PASSWORD: 'CHANGE_PASSWORD',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

var ERRORS = exports.ERRORS = {
  TIMEOUT: 'TIMEOUT',
  GENERIC: 'GENERIC'
};

var GENERAL_ERROR = exports.GENERAL_ERROR = 'GENERAL_ERROR';

var TRANSACTION_STATUS = exports.TRANSACTION_STATUS = {
  COMPLETED: 'completed',
  PENDING: 'pending'
};