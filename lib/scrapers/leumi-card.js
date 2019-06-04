'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var getCardContainers = function () {
  var _ref = _asyncToGenerator(function* (page) {
    return page.$$('.infoList_holder');
  });

  return function getCardContainers(_x) {
    return _ref.apply(this, arguments);
  };
}();

var getCardContainer = function () {
  var _ref2 = _asyncToGenerator(function* (page, cardIndex) {
    var cardContainers = yield getCardContainers(page);
    var cardContainer = cardContainers[cardIndex];
    return cardContainer;
  });

  return function getCardContainer(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

var getCardSections = function () {
  var _ref3 = _asyncToGenerator(function* (page, cardIndex) {
    var cardContainer = yield getCardContainer(page, cardIndex);
    var cardSections = yield cardContainer.$$('.NotPaddingTable');
    return cardSections;
  });

  return function getCardSections(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();

var getAccountNumber = function () {
  var _ref4 = _asyncToGenerator(function* (page, cardIndex) {
    var cardContainer = yield getCardContainer(page, cardIndex);
    var infoContainer = yield cardContainer.$('.creditCard_name');
    var numberListItems = yield infoContainer.$$('li');
    var numberListItem = numberListItems[1];
    var accountNumberStr = yield page.evaluate(function (li) {
      return li.innerText;
    }, numberListItem);
    var accountNumber = accountNumberStr.replace('(', '').replace(')', '');

    return accountNumber;
  });

  return function getAccountNumber(_x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}();

var getTransactionsForSection = function () {
  var _ref5 = _asyncToGenerator(function* (page, cardIndex, sectionIndex) {
    var cardSections = yield getCardSections(page, cardIndex);
    var txnsRows = yield cardSections[sectionIndex].$$('.jobs_regular');
    var expandedBusinessesNamesHeaders = yield cardSections[sectionIndex].$$('.openedJob .bisName');
    var expandedBusinessesNames = yield Promise.all(expandedBusinessesNamesHeaders.map(function (header) {
      return page.evaluate(function (x) {
        return x.innerText;
      }, header);
    }), expandedBusinessesNamesHeaders);

    // Leumicard keeps hidden open transactions without any content, filter them out
    expandedBusinessesNames = expandedBusinessesNames.filter(function (x) {
      return !!x;
    });

    var txns = [];
    for (var txnIndex = 0; txnIndex < txnsRows.length; txnIndex += 1) {
      var txnColumns = yield txnsRows[txnIndex].$$('td');

      var typeStr = yield page.evaluate(function (td) {
        return td.innerText;
      }, txnColumns[4]);

      var dateStr = yield page.evaluate(function (td) {
        return td.innerText;
      }, txnColumns[1]);

      var processedDateStr = yield page.evaluate(function (td) {
        return td.innerText;
      }, txnColumns[2]);

      var originalAmountStr = yield page.evaluate(function (td) {
        return td.innerText;
      }, txnColumns[5]);

      var chargedAmountStr = yield page.evaluate(function (td) {
        return td.innerText;
      }, txnColumns[6]);

      var description = expandedBusinessesNames[txnIndex].replace(/\s+/g, ' ');

      var comments = yield page.evaluate(function (td) {
        return td.innerText;
      }, txnColumns[7]);

      var txn = {
        typeStr: typeStr,
        dateStr: dateStr,
        processedDateStr: processedDateStr,
        originalAmountStr: originalAmountStr,
        chargedAmountStr: chargedAmountStr,
        description: description,
        comments: comments
      };
      txns.push(txn);
    }

    return txns;
  });

  return function getTransactionsForSection(_x8, _x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

var getNextPageButtonForSection = function () {
  var _ref6 = _asyncToGenerator(function* (page, cardIndex, sectionIndex) {
    var cardSections = yield getCardSections(page, cardIndex);
    return cardSections[sectionIndex].$('.difdufLeft a');
  });

  return function getNextPageButtonForSection(_x11, _x12, _x13) {
    return _ref6.apply(this, arguments);
  };
}();

var getCurrentTransactions = function () {
  var _ref7 = _asyncToGenerator(function* (page) {
    var result = {};
    var cardContainers = yield getCardContainers(page);

    for (var cardIndex = 0; cardIndex < cardContainers.length; cardIndex += 1) {
      var txns = [];
      var cardSections = yield getCardSections(page, cardIndex);
      for (var sectionIndex = 0; sectionIndex < cardSections.length; sectionIndex += 1) {
        var hasNext = true;
        while (hasNext) {
          var sectionTxns = yield getTransactionsForSection(page, cardIndex, sectionIndex);
          txns.push(...sectionTxns);

          var nextPageBtn = yield getNextPageButtonForSection(page, cardIndex, sectionIndex);
          if (nextPageBtn) {
            yield nextPageBtn.click();
            yield (0, _navigation.waitForNavigationAndDomLoad)(page);
          } else {
            hasNext = false;
          }
        }
      }

      var accountNumber = yield getAccountNumber(page, cardIndex);
      result[accountNumber] = convertTransactions(txns);
    }

    return result;
  });

  return function getCurrentTransactions(_x14) {
    return _ref7.apply(this, arguments);
  };
}();

var fetchTransactionsForMonth = function () {
  var _ref8 = _asyncToGenerator(function* (browser, navigateToFunc, monthMoment) {
    var page = yield browser.newPage();

    var url = getTransactionsUrl(monthMoment);
    yield navigateToFunc(url, page);

    if (page.url() !== url) {
      throw new Error(`Error while trying to navigate to url ${url}`);
    }

    var txns = yield getCurrentTransactions(page);
    yield page.close();

    return txns;
  });

  return function fetchTransactionsForMonth(_x15, _x16, _x17) {
    return _ref8.apply(this, arguments);
  };
}();

var fetchTransactions = function () {
  var _ref9 = _asyncToGenerator(function* (browser, options, navigateToFunc) {
    var defaultStartMoment = (0, _moment2.default)().subtract(1, 'years');
    var startDate = options.startDate || defaultStartMoment.toDate();
    var startMoment = _moment2.default.max(defaultStartMoment, (0, _moment2.default)(startDate));
    var allMonths = (0, _dates2.default)(startMoment, false);

    var allResults = {};
    for (var i = 0; i < allMonths.length; i += 1) {
      var result = yield fetchTransactionsForMonth(browser, navigateToFunc, allMonths[i]);
      allResults = addResult(allResults, result);
    }

    var currentMonthResult = yield fetchTransactionsForMonth(browser, navigateToFunc);
    allResults = addResult(allResults, currentMonthResult);

    Object.keys(allResults).forEach(function (accountNumber) {
      var txns = allResults[accountNumber];
      txns = prepareTransactions(txns, startMoment, options.combineInstallments);
      allResults[accountNumber] = txns;
    });

    return allResults;
  });

  return function fetchTransactions(_x18, _x19, _x20) {
    return _ref9.apply(this, arguments);
  };
}();

var _buildUrl = require('build-url');

var _buildUrl2 = _interopRequireDefault(_buildUrl);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _baseScraperWithBrowser = require('./base-scraper-with-browser');

var _navigation = require('../helpers/navigation');

var _elementsInteractions = require('../helpers/elements-interactions');

var _constants = require('../constants');

var _dates = require('../helpers/dates');

var _dates2 = _interopRequireDefault(_dates);

var _transactions = require('../helpers/transactions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var BASE_ACTIONS_URL = 'https://online.max.co.il';
var BASE_WELCOME_URL = 'https://www.max.co.il';
var DATE_FORMAT = 'DD/MM/YYYY';
var NORMAL_TYPE_NAME = 'רגילה';
var ATM_TYPE_NAME = 'חיוב עסקות מיידי';
var INTERNET_SHOPPING_TYPE_NAME = 'אינטרנט/חו"ל';
var INSTALLMENTS_TYPE_NAME = 'תשלומים';
var MONTHLY_CHARGE_TYPE_NAME = 'חיוב חודשי';
var ONE_MONTH_POSTPONED_TYPE_NAME = 'דחוי חודש';
var MONTHLY_POSTPONED_TYPE_NAME = 'דחוי לחיוב החודשי';
var THIRTY_DAYS_PLUS_TYPE_NAME = 'עסקת 30 פלוס';
var TWO_MONTHS_POSTPONED_TYPE_NAME = 'דחוי חודשיים';
var MONTHLY_CHARGE_PLUS_INTEREST_TYPE_NAME = 'חודשי + ריבית';
var CREDIT_TYPE_NAME = 'קרדיט';

var INVALID_DETAILS_SELECTOR = '#popupWrongDetails';
var LOGIN_ERROR_SELECTOR = '#popupCardHoldersLoginError';

function redirectOrDialog(page) {
  return Promise.race([(0, _navigation.waitForRedirect)(page, 20000, false, [BASE_WELCOME_URL, `${BASE_WELCOME_URL}/`]), (0, _elementsInteractions.waitUntilElementFound)(page, INVALID_DETAILS_SELECTOR, true), (0, _elementsInteractions.waitUntilElementFound)(page, LOGIN_ERROR_SELECTOR, true)]);
}

function getTransactionsUrl(monthMoment) {
  var monthCharge = null;
  var actionType = 1;
  if (monthMoment) {
    var month = monthMoment.month() + 1;
    var monthStr = month < 10 ? `0${month}` : month.toString();
    var year = monthMoment.year();
    monthCharge = `${year}${monthStr}`;
    actionType = 2;
  }
  return (0, _buildUrl2.default)(BASE_ACTIONS_URL, {
    path: 'Registred/Transactions/ChargesDeals.aspx',
    queryParams: {
      ActionType: actionType,
      MonthCharge: monthCharge,
      Index: -2
    }
  });
}

function getTransactionType(txnTypeStr) {
  var cleanedUpTxnTypeStr = txnTypeStr.replace('\t', ' ').trim();
  switch (cleanedUpTxnTypeStr) {
    case ATM_TYPE_NAME:
    case NORMAL_TYPE_NAME:
    case MONTHLY_CHARGE_TYPE_NAME:
    case ONE_MONTH_POSTPONED_TYPE_NAME:
    case MONTHLY_POSTPONED_TYPE_NAME:
    case THIRTY_DAYS_PLUS_TYPE_NAME:
    case TWO_MONTHS_POSTPONED_TYPE_NAME:
    case INTERNET_SHOPPING_TYPE_NAME:
    case MONTHLY_CHARGE_PLUS_INTEREST_TYPE_NAME:
      return _constants.NORMAL_TXN_TYPE;
    case INSTALLMENTS_TYPE_NAME:
    case CREDIT_TYPE_NAME:
      return _constants.INSTALLMENTS_TXN_TYPE;
    default:
      throw new Error(`Unknown transaction type ${cleanedUpTxnTypeStr}`);
  }
}

function getAmountData(amountStr) {
  var amountStrCopy = amountStr.replace(',', '');
  var currency = null;
  var amount = null;
  if (amountStrCopy.includes(_constants.SHEKEL_CURRENCY_SYMBOL)) {
    amount = parseFloat(amountStrCopy.replace(_constants.SHEKEL_CURRENCY_SYMBOL, ''));
    currency = _constants.SHEKEL_CURRENCY;
  } else {
    var parts = amountStrCopy.split(' ');
    amount = parseFloat(parts[0]);

    var _parts = _slicedToArray(parts, 2);

    currency = _parts[1];
  }

  return {
    amount: amount,
    currency: currency
  };
}

function getInstallmentsInfo(comments) {
  if (!comments) {
    return null;
  }
  var matches = comments.match(/\d+/g);
  if (!matches || matches.length < 2) {
    return null;
  }

  return {
    number: parseInt(matches[0], 10),
    total: parseInt(matches[1], 10)
  };
}

function convertTransactions(rawTxns) {
  return rawTxns.map(function (txn) {
    var originalAmountData = getAmountData(txn.originalAmountStr);
    var chargedAmountData = getAmountData(txn.chargedAmountStr);
    return {
      type: getTransactionType(txn.typeStr),
      date: (0, _moment2.default)(txn.dateStr, DATE_FORMAT).toISOString(),
      processedDate: (0, _moment2.default)(txn.processedDateStr, DATE_FORMAT).toISOString(),
      originalAmount: -originalAmountData.amount,
      originalCurrency: originalAmountData.currency,
      chargedAmount: -chargedAmountData.amount,
      description: txn.description.trim(),
      memo: txn.comments,
      installments: getInstallmentsInfo(txn.comments),
      status: _constants.TRANSACTION_STATUS.COMPLETED
    };
  });
}

function addResult(allResults, result) {
  var clonedResults = Object.assign({}, allResults);
  Object.keys(result).forEach(function (accountNumber) {
    if (!clonedResults[accountNumber]) {
      clonedResults[accountNumber] = [];
    }
    clonedResults[accountNumber].push(...result[accountNumber]);
  });
  return clonedResults;
}

function prepareTransactions(txns, startMoment, combineInstallments) {
  var clonedTxns = Array.from(txns);
  if (!combineInstallments) {
    clonedTxns = (0, _transactions.fixInstallments)(clonedTxns);
  }
  clonedTxns = (0, _transactions.sortTransactionsByDate)(clonedTxns);
  clonedTxns = (0, _transactions.filterOldTransactions)(clonedTxns, startMoment, combineInstallments);
  return clonedTxns;
}

function getPossibleLoginResults(page) {
  var urls = {};
  urls[_baseScraperWithBrowser.LOGIN_RESULT.SUCCESS] = [`${BASE_WELCOME_URL}/homepage/personal`];
  urls[_baseScraperWithBrowser.LOGIN_RESULT.CHANGE_PASSWORD] = [`${BASE_ACTIONS_URL}/Anonymous/Login/PasswordExpired.aspx`];
  urls[_baseScraperWithBrowser.LOGIN_RESULT.INVALID_PASSWORD] = [_asyncToGenerator(function* () {
    return (0, _elementsInteractions.elementPresentOnPage)(page, INVALID_DETAILS_SELECTOR);
  })];
  urls[_baseScraperWithBrowser.LOGIN_RESULT.UNKNOWN_ERROR] = [_asyncToGenerator(function* () {
    return (0, _elementsInteractions.elementPresentOnPage)(page, LOGIN_ERROR_SELECTOR);
  })];
  return urls;
}

function createLoginFields(inputGroupName, credentials) {
  return [{ selector: `#${inputGroupName}_txtUserName`, value: credentials.username }, { selector: '#txtPassword', value: credentials.password }];
}

class LeumiCardScraper extends _baseScraperWithBrowser.BaseScraperWithBrowser {
  getLoginOptions(credentials) {
    var _this = this;

    var inputGroupName = 'PlaceHolderMain_CardHoldersLogin1';
    return {
      loginUrl: `${BASE_ACTIONS_URL}/Anonymous/Login/CardholdersLogin.aspx`,
      fields: createLoginFields(inputGroupName, credentials),
      submitButtonSelector: `#${inputGroupName}_btnLogin`,
      preAction: function () {
        var _ref12 = _asyncToGenerator(function* () {
          if (yield (0, _elementsInteractions.elementPresentOnPage)(_this.page, '#closePopup')) {
            yield (0, _elementsInteractions.clickButton)(_this.page, '#closePopup');
          }
        });

        return function preAction() {
          return _ref12.apply(this, arguments);
        };
      }(),
      postAction: function () {
        var _ref13 = _asyncToGenerator(function* () {
          return redirectOrDialog(_this.page);
        });

        return function postAction() {
          return _ref13.apply(this, arguments);
        };
      }(),
      possibleResults: getPossibleLoginResults(this.page)
    };
  }

  fetchData() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      var results = yield fetchTransactions(_this2.browser, _this2.options, _this2.navigateTo);
      var accounts = Object.keys(results).map(function (accountNumber) {
        return {
          accountNumber: accountNumber,
          txns: results[accountNumber]
        };
      });

      return {
        success: true,
        accounts: accounts
      };
    })();
  }
}

exports.default = LeumiCardScraper;