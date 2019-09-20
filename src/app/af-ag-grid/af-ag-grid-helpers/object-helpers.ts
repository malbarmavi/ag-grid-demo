import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ObjectHelpersService {
  constructor() {
    function ObjectHelpersSvc(EventHelpersSvc) {
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat

      var self = {
        createAndSetChainedProperty: createAndSetChainedProperty,
        shallowPropertyCopy: shallowPropertyCopy,
        simpleDeepCopy: simpleDeepCopy,
        deepCircularCopy: deepCircularCopy,
        getSafeValue: getSafeValue
      };

      // ================================================  ================================================
      /**
       *
       * @param {Object} rootObj the object inside which you want to set a specific properties value
       * @param {String} propertyAccesorStr the path inside the object you want to create or set the value
       *            Ex: a.b.c.d
       * @param {*} value the value you want to set at the path set by propertyAccesorStr inside the rootObj
       * @param {Boolean} overwrite if the value is already set, or there are any conflicts in the path, if the function should overwrite the data and continue with the execution
       * @return {Boolean} if the value has been set or it has been aborted due to the value already existing, or path conflicts
       * Ex: createAndSetChainedProperty({}, 'a.b.c.d', 100) => true; the object will now have {a:{b:{c:{d:100}}}}
       */
      function createAndSetChainedProperty(
        rootObj,
        propertyAccesorStr,
        value,
        overwrite
      ) {
        var arr = propertyAccesorStr.split('.');
        if (arr.length < 1) return;

        var lastProperty = arr.pop();

        var currentPosition = rootObj;
        for (var i = 0; i < arr.length; i++) {
          if (currentPosition[arr[i]] === undefined) {
            currentPosition[arr[i]] = {};
          } else if (typeof currentPosition[arr[i]] !== 'object') {
            return false;
          }
          currentPosition = currentPosition[arr[i]];
        }

        if (currentPosition[lastProperty] === undefined || overwrite) {
          currentPosition[lastProperty] = value;
        } else {
          return false;
        }
        return true;
      }

      // ================================================  ================================================
      /**
       *
       * @param {*} target
       * @param {Objects} sources variable number of arguments, any of the following arguments after the 1st one (target) should be objects whose properties will be shallow copied
       */
      function shallowPropertyCopy(target) {
        for (var i = 1; i < arguments.length; i++) {
          var currentSource = arguments[i];
          var keysArr = Object.keys(currentSource);
          for (var j = 0; j < keysArr.length; j++) {
            var currentKey = keysArr[j];
            if (
              target[currentKey] === undefined &&
              currentSource.hasOwnProperty(currentKey)
            ) {
              var currentValue = currentSource[currentKey];
              target[currentKey] = currentValue;
            }
          }
        }
      }

      function deepCircularCopy(o) {
        var gdcc = '__getDeepCircularCopy__';
        if (o !== Object(o)) return o; // primitive value
        var set = gdcc in o,
          cache = o[gdcc],
          result;
        if (set && typeof cache == 'function') return cache();
        // else
        o[gdcc] = function() {
          return result;
        }; // overwrite
        if (o instanceof Array) {
          result = [];
          for (var i = 0; i < o.length; i++) {
            result[i] = deepCircularCopy(o[i]);
          }
        } else {
          result = {};
          for (var prop in o)
            if (prop != gdcc) result[prop] = deepCircularCopy(o[prop]);
            else if (set) result[prop] = deepCircularCopy(cache);
        }
        if (set) o[gdcc] = cache;
        // reset
        else delete o[gdcc]; // unset again
        return result;
      }

      function simpleDeepCopy(o) {
        return JSON.parse(JSON.stringify(o));
      }

      function getSafeValue(obj, arr) {
        var currentValue = obj;

        for (var i = 0; i < arr.length; i++) {
          var currentKey = arr[i];
          currentValue = currentValue[currentKey];
          if (currentValue === undefined) {
            return;
          }
        }
        return currentValue;
      }

      return self;
    }
  }
}
