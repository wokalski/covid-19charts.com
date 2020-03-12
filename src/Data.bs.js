'use strict';

var $$Array = require("bs-platform/lib/js/array.js");
var Js_dict = require("bs-platform/lib/js/js_dict.js");
var Caml_primitive = require("bs-platform/lib/js/caml_primitive.js");

function keys(prim) {
  return Object.keys(prim);
}

function get(prim, prim$1) {
  return prim[prim$1];
}

function set(prim, prim$1, prim$2) {
  prim[prim$1] = prim$2;
  return /* () */0;
}

function empty(prim) {
  return { };
}

var $$Map = {
  keys: keys,
  get: get,
  get_opt: Js_dict.get,
  map: Js_dict.map,
  entries: Js_dict.entries,
  fromArray: Js_dict.fromArray,
  set: set,
  empty: empty
};

function randomColor(index) {
  var random = 360 * (index / 100);
  return "hsla(" + (String(random) + ",70%,70%,0.8)");
}

var locations = require("../data/locations.json");

var days = require("../data/days.json");

var data = require("../data/data.json");

var countryIds = Object.keys(locations);

var dayToIndex = Js_dict.fromArray(days.map((function (day, index) {
            return /* tuple */[
                    day,
                    index
                  ];
          })));

var colors = Js_dict.fromArray(Object.keys(locations).map((function ($$location, index) {
            return /* tuple */[
                    $$location,
                    randomColor(index)
                  ];
          })));

var calendar = days.map((function (day) {
        var row = { };
        row["name"] = day;
        countryIds.forEach((function (countryId) {
                if (countryId === "US (All regions)") {
                  console.log(data[countryId][day]);
                }
                row[locations[countryId].name] = data[countryId][day].toString();
                return /* () */0;
              }));
        return row;
      }));

function alignToDay0(threshold) {
  var data$1 = Js_dict.map((function (dataPoints) {
          return Js_dict.fromArray(Js_dict.entries(dataPoints).map((function (param) {
                                    return /* tuple */[
                                            dayToIndex[param[0]],
                                            param[1]
                                          ];
                                  })).sort((function (a, b) {
                                  return Caml_primitive.caml_int_compare(a[0], b[0]);
                                })).map((function (param) {
                                return param[1];
                              })).filter((function (value) {
                              return value >= threshold;
                            })).map((function (value, index) {
                            return /* tuple */[
                                    index.toString(),
                                    value
                                  ];
                          })));
        }), data);
  return $$Array.init(days.length, (function (day) {
                var row = { };
                var day$1 = day.toString();
                row["name"] = day$1;
                countryIds.forEach((function (countryId) {
                        var match = Js_dict.get(data$1[countryId], day$1);
                        if (match !== undefined) {
                          row[locations[countryId].name] = match.toString();
                          return /* () */0;
                        } else {
                          return /* () */0;
                        }
                      }));
                return row;
              }));
}

var allLocations = Js_dict.entries(locations).map((function (param) {
        return {
                value: param[1],
                label: param[0]
              };
      }));

exports.$$Map = $$Map;
exports.randomColor = randomColor;
exports.locations = locations;
exports.days = days;
exports.data = data;
exports.countryIds = countryIds;
exports.dayToIndex = dayToIndex;
exports.colors = colors;
exports.calendar = calendar;
exports.alignToDay0 = alignToDay0;
exports.allLocations = allLocations;
/* locations Not a pure module */
