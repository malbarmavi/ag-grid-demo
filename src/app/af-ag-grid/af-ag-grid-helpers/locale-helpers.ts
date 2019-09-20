// import { Injectable } from '@angular/core';
// import BigNumber from 'bignumber.js';

// @Injectable({
//   providedIn: 'root'
// })
// export class LocaleHelperService {
//   constructor() {
//     function LocaleHelpersSvc() {
//       // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
//       var self = {
//         createFloatFormatterWithNumDigits: createFloatFormatterWithNumDigits,
//         parseNumber: parseNumber,
//         getMinDecimals: getMinDecimals,
//         getMaxDecimals: getMaxDecimals,
//         getDefaultDecimals: getDefaultDecimals,
//         getExcelFormatters: getExcelFormatters
//       };

//       var MIN_DECIMALS = 0;
//       var MAX_DECIMALS = 16;
//       var DEFAULT_DECIMALS = 2;
//       var currencySymbols = ['RON', 'USD', 'EUR', 'XPF'];

//       var formatters = {};
//       self.formatters = formatters;
//       var locale =
//         window.navigator.userLanguage || window.navigator.language || 'en-US';

//       // numbers
//       var numOptions = {
//         localeMatcher: 'best fit',
//         useGrouping: true,
//         minimumIntegerDigits: 1
//       };

//       // currency
//       var currencyOptions = {
//         style: 'currency',
//         currencyDisplay: 'symbol' //symbol, code, name
//       };

//       // date
//       var dateOptions = {
//         year: 'numeric',
//         month: '2-digit',
//         day: '2-digit'
//       };

//       var dateTimeOptions = Object.assign(
//         {
//           hour: 'numeric',
//           minute: 'numeric'
//         },
//         dateOptions
//       );

//       // formatters
//       function createFloatFormatterWithNumDigits(numDigits) {
//         return new Intl.NumberFormat(
//           locale,
//           Object.assign({}, numOptions, {
//             minimumFractionDigits: numDigits,
//             maximumFractionDigits: numDigits
//           })
//         );
//       }
//       function createFormatters() {
//         // date formatter
//         formatters['dateTimeFormatter'] = new Intl.DateTimeFormat(
//           locale,
//           dateTimeOptions
//         );
//         formatters['dateFormatter'] = new Intl.DateTimeFormat(
//           locale,
//           dateOptions
//         );

//         // generic number formatter (no decimal places restrictions, just separators)
//         formatters['numberFormatter'] = new Intl.NumberFormat(
//           locale,
//           numOptions
//         );

//         // variable number of digits formatters
//         for (var i = MIN_DECIMALS; i <= MAX_DECIMALS; i++) {
//           formatters[
//             'floatNumberFormatter' + i
//           ] = createFloatFormatterWithNumDigits(i);
//         }

//         // big number formatters
//         for (var i = MIN_DECIMALS; i <= MAX_DECIMALS; i++) {
//           formatters['bigNumberFormatter' + i] = createBigNumberFormatter(i);
//         }

//         // add currency formatters
//         for (i = 0; i < currencySymbols.length; i++) {
//           formatters[
//             currencySymbols[i].toLowerCase() + 'NumberFormatter'
//           ] = new Intl.NumberFormat(
//             locale,
//             Object.assign({}, currencyOptions, { currency: currencySymbols[i] })
//           );
//         }
//       }
//       createFormatters();

//       var sample = formatters.numberFormatter.format(1000.1);
//       var decimalDelimitator = sample.charAt(5);
//       var groupDelimitator = sample.charAt(1);

//       self.decimalDelimitator = decimalDelimitator;
//       self.groupDelimitator = groupDelimitator;

//       // parser
//       function parseNumber(value) {
//         var decimalDelimitator = Intl.NumberFormat(locale)
//           .format(1.1)
//           .charAt(1);
//         var cleanPattern = new RegExp(
//           '[^-+0-9' + decimalDelimitator + ']',
//           'g'
//         );
//         var cleaned = value.replace(cleanPattern, '');
//         var normalized = cleaned.replace(decimalDelimitator, '.');

//         return parseFloat(normalized);
//       }

//       /**
//        * Parses a string into a number.
//        * If the string contains an invalid format, either with digit grouping separator or without, it returns NaN.
//        * Ex: "1,000,000.123" => 1000000.123
//        * Ex: "1000000.123" => 1000000.123
//        * Ex: "1,000,1234.123" => NaN (formatted incorectly)
//        * @param {String} value the string value to parse
//        * @param {boolean} permissive if true, the input value is cleaned of non numeric related characters [=-0-9 decimalSeparator]
//        *                  and then the conversion is attempted
//        * @return {Number}
//        */
//       function advancedParseNumber(value, permissive) {
//         value = '' + value;

//         var testCase = Intl.NumberFormat(locale).format(1000.1);
//         var decimalDelimitator = testCase.charAt(5);
//         var groupDelimitator = testCase.charAt(1);

//         if (!!permissive) {
//           var cleanPattern = new RegExp(
//             '[^-+0-9' + decimalDelimitator + ']',
//             'g'
//           );
//           value = value.replace(cleanPattern, '');
//         }

//         var minimumLeadingOrTrailingDigits = permissive ? 0 : 1;

//         var formattedPattern = new RegExp(
//           '^[+-]{0,1}' + // starts with optional sign
//           '([0-9]{1,3}){' +
//           minimumLeadingOrTrailingDigits +
//           ', 1}' + // 1 to 3 digits {repeated 0 (permissive) or 1 times}
//           '([' +
//           groupDelimitator +
//           ']{1}[0-9]{3}){0,}' + // (groupDelimitator {once} and 3 digits) {0 or more times}
//             '([' +
//             decimalDelimitator +
//             ']{1}[0-9]{' +
//             minimumLeadingOrTrailingDigits +
//             ',}){0,1}$', // (decimalDelimitator {once} and 0 (permissive) or 1 or more digits) {0 or 1 times}
//           'm'
//         );
//         // console.log(formattedPattern);

//         var unformattedPattern = new RegExp(
//           '^[+-]{0,1}' + // starts with optional sign
//           '([0-9]{1,}){' +
//           minimumLeadingOrTrailingDigits +
//           ',1}' + // 1 to 3 digits {repeated 0 (permissive) or 1 times}
//             '([' +
//             decimalDelimitator +
//             ']{1}[0-9]{' +
//             minimumLeadingOrTrailingDigits +
//             ',}){0,1}$', // (decimalDelimitator {once} and 1 or more digits) {0 or 1 times}
//           'm'
//         );
//         // console.log(unformattedPattern);

//         if (!(formattedPattern.test(value) || unformattedPattern.test(value))) {
//           return NaN;
//         }

//         var normalised = value
//           .replace(new RegExp('[' + groupDelimitator + ']', 'g'), '')
//           .replace(new RegExp('[' + decimalDelimitator + ']', 'g'), '.');
//         // console.log(normalised);
//         return Number(normalised);
//       }

//       function getMinDecimals() {
//         return MIN_DECIMALS;
//       }
//       function getMaxDecimals() {
//         return MAX_DECIMALS;
//       }
//       function getDefaultDecimals() {
//         return DEFAULT_DECIMALS;
//       }

//       // ================================================ BIG NUMBER ================================================
//       BigNumber.config({
//         DECIMAL_PLACES: 20,
//         POW_PRECISION: 20,
//         EXPONENTIAL_AT: [-100, 100],
//         FORMAT: {
//           decimalSeparator: decimalDelimitator,
//           fractionGroupSeparator: '',
//           fractionGroupSize: 3,
//           groupSeparator: groupDelimitator,
//           groupSize: 3,
//           prefix: '',
//           secondaryGroupSize: 0,
//           suffix: ''
//         }
//       });

//       function createBigNumberFormatter(numDecimals) {
//         return function(bigNum) {
//           var str = BigNumber(bigNum.toFixed(numDecimals)).toString();
//           if (isNaN(str)) {
//             return '';
//           }
//           var pointPos = str.indexOf('.');
//           var padLength =
//             pointPos !== -1
//               ? numDecimals - (str.length - pointPos - 1)
//               : numDecimals;
//           var padStr =
//             pointPos !== -1 || numDecimals === 0 ? '' : decimalDelimitator;
//           for (var i = 0; i < padLength; i++) {
//             padStr += '0';
//           }
//           return BigNumber(str).toFormat() + padStr;
//         };
//       }

//       // ================================================ CLEAVE ================================================
//       var cleaveNumberSetup = {
//         numeral: true,
//         stripLeadingZeroes: true,
//         numeralPositiveOnly: false,
//         numeralThousandsGroupStyle: 'thousand',
//         delimiter: groupDelimitator,
//         numeralDecimalMark: decimalDelimitator,
//         numeralIntegerScale: 14,
//         numeralDecimalScale: DEFAULT_DECIMALS
//       };
//       self.getCleaveNumberSetup = function() {
//         return Object.assign({}, cleaveNumberSetup);
//       };

//       function getExcelFormatters() {
//         var arr = [];
//         var toRepeat = '0';
//         for (var i = MIN_DECIMALS; i <= MAX_DECIMALS; i++) {
//           var obj = {};
//           obj.id = 'exportNumberFormat' + i;
//           obj.numberFormat = {};
//           obj.numberFormat.format =
//             '#' +
//             groupDelimitator +
//             '##0' +
//             decimalDelimitator +
//             toRepeat.repeat(i);
//           //obj.dataType = 'string';
//           arr.push(obj);
//         }
//         return arr;
//       }

//       return self;
//     }
//   }
// }
