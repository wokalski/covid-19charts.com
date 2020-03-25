'use strict';

var $$Array = require("bs-platform/lib/js/array.js");
var Block = require("bs-platform/lib/js/block.js");
var Js_dict = require("bs-platform/lib/js/js_dict.js");
var Caml_obj = require("bs-platform/lib/js/caml_obj.js");
var Js_option = require("bs-platform/lib/js/js_option.js");
var Belt_MapInt = require("bs-platform/lib/js/belt_MapInt.js");
var Belt_MapString = require("bs-platform/lib/js/belt_MapString.js");
var Caml_primitive = require("bs-platform/lib/js/caml_primitive.js");
var CamlinternalLazy = require("bs-platform/lib/js/camlinternalLazy.js");
var Belt_HashMapString = require("bs-platform/lib/js/belt_HashMapString.js");

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

var dataWithGrowth = Belt_MapString.fromArray(Js_dict.entries(data).map((function (param) {
            var dataPoints = param[1];
            var data = Caml_obj.caml_lazy_make((function (param) {
                    var countryDataWithGrowth = { };
                    days.reduce((function (prevNumberOfCases, day) {
                            var numberOfCases = dataPoints[day];
                            var numberOfCasesF = numberOfCases;
                            var prevNumberOfCasesF = prevNumberOfCases;
                            var growth = prevNumberOfCases === 0 ? 0 : (numberOfCasesF - prevNumberOfCasesF) / prevNumberOfCasesF;
                            set(countryDataWithGrowth, day, {
                                  numberOfCases: numberOfCases,
                                  growth: growth
                                });
                            return numberOfCases;
                          }), 0);
                    return countryDataWithGrowth;
                  }));
            return /* tuple */[
                    param[0],
                    data
                  ];
          })));

var calendar = days.map((function (day, index) {
        var values = Belt_HashMapString.make(countryIds.length);
        countryIds.forEach((function (countryId) {
                return Belt_HashMapString.set(values, locations[countryId].name, Caml_obj.caml_lazy_make((function (param) {
                                  return CamlinternalLazy.force(Belt_MapString.getExn(dataWithGrowth, countryId))[day];
                                })));
              }));
        return {
                x: /* Date */Block.__(0, [new Date(day)]),
                index: index,
                values: (function (countryId) {
                    return Js_option.map(CamlinternalLazy.force, Belt_HashMapString.get(values, countryId));
                  })
              };
      }));

function alignToDay0(threshold) {
  var data = Belt_MapString.mapU(dataWithGrowth, (function (dataPoints) {
          return Caml_obj.caml_lazy_make((function (param) {
                        var dataPoints$1 = CamlinternalLazy.force(dataPoints);
                        return Belt_MapInt.fromArray(Js_dict.entries(dataPoints$1).map((function (param) {
                                                  return /* tuple */[
                                                          dayToIndex[param[0]],
                                                          param[1]
                                                        ];
                                                })).sort((function (a, b) {
                                                return Caml_primitive.caml_int_compare(a[0], b[0]);
                                              })).map((function (param) {
                                              return param[1];
                                            })).filter((function (value) {
                                            return value.numberOfCases >= threshold;
                                          })).map((function (value, index) {
                                          return /* tuple */[
                                                  index,
                                                  value
                                                ];
                                        })));
                      }));
        }));
  return $$Array.init(days.length, (function (day) {
                return {
                        x: /* Day */Block.__(1, [day]),
                        index: day,
                        values: (function (countryId) {
                            return Js_option.andThen((function (countryData) {
                                          return Belt_MapInt.get(CamlinternalLazy.force(countryData), day);
                                        }), Belt_MapString.get(data, countryId));
                          })
                      };
              }));
}

var allLocations = Js_dict.entries(locations).map((function (param) {
        return {
                value: param[0],
                label: param[1].name
              };
      }));

exports.$$Map = $$Map;
exports.locations = locations;
exports.days = days;
exports.data = data;
exports.countryIds = countryIds;
exports.dayToIndex = dayToIndex;
exports.dataWithGrowth = dataWithGrowth;
exports.calendar = calendar;
exports.alignToDay0 = alignToDay0;
exports.allLocations = allLocations;
/* locations Not a pure module */
