'use strict';

var $$Array = require("bs-platform/lib/js/array.js");
var Block = require("bs-platform/lib/js/block.js");
var Js_dict = require("bs-platform/lib/js/js_dict.js");
var Caml_obj = require("bs-platform/lib/js/caml_obj.js");
var Js_option = require("bs-platform/lib/js/js_option.js");
var Caml_array = require("bs-platform/lib/js/caml_array.js");
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

var startDate = new Date(Caml_array.caml_array_get(days, 0));

var endDate = new Date(Caml_array.caml_array_get(days, days.length - 1 | 0));

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
                    days.reduce((function (prevRecord, day) {
                            var record = dataPoints[day];
                            set(countryDataWithGrowth, day, prevRecord !== undefined ? /* Pair */Block.__(1, [
                                      /* prevRecord */prevRecord,
                                      /* record */record
                                    ]) : /* First */Block.__(0, [record]));
                            return record;
                          }), undefined);
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

function isInitialRange(selectedStartDate, selectedEndDate) {
  if (selectedEndDate.getTime() === endDate.getTime()) {
    return selectedStartDate.getDate() === startDate.getTime();
  } else {
    return false;
  }
}

function calendar$1(selectedStartDate, selectedEndDate) {
  if (isInitialRange(selectedStartDate, selectedEndDate)) {
    return calendar;
  } else {
    return calendar.filter((function (param) {
                  var x = param.x;
                  if (x.tag) {
                    return false;
                  } else {
                    var date = x[0];
                    if (Caml_obj.caml_greaterequal(date, selectedStartDate)) {
                      return Caml_obj.caml_lessequal(date, selectedEndDate);
                    } else {
                      return false;
                    }
                  }
                }));
  }
}

function getRecord(param) {
  if (param.tag) {
    return param[/* record */1];
  } else {
    return param[0];
  }
}

function getValueFromRecord(dataType, record) {
  if (dataType) {
    return record.deaths;
  } else {
    return record.confirmed;
  }
}

function getValue(dataType, dataItem) {
  return getValueFromRecord(dataType, getRecord(dataItem));
}

function alignToDay0(dataType, threshold) {
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
                                            return getValueFromRecord(dataType, getRecord(value)) >= threshold;
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

function getGrowth(dataType, param) {
  if (param.tag) {
    var numberOfCasesF = getValueFromRecord(dataType, param[/* record */1]);
    var prevNumberOfCases = getValueFromRecord(dataType, param[/* prevRecord */0]);
    var prevNumberOfCasesF = prevNumberOfCases;
    if (prevNumberOfCases === 0) {
      return 0;
    } else {
      return (numberOfCasesF - prevNumberOfCasesF) / prevNumberOfCasesF;
    }
  } else {
    return 0;
  }
}

function getTotalMortailityRate(param) {
  if (param.tag) {
    var match = param[/* record */1];
    var confirmed = match.confirmed;
    if (confirmed > 0) {
      return match.deaths / confirmed;
    } else {
      return 0;
    }
  } else {
    var match$1 = param[0];
    var confirmed$1 = match$1.confirmed;
    if (confirmed$1 > 0) {
      return match$1.deaths / confirmed$1;
    } else {
      return 0;
    }
  }
}

function getDailyNewCases(param) {
  if (param.tag) {
    var record = param[/* record */1];
    var prevRecord = param[/* prevRecord */0];
    var confirmed = record.confirmed - prevRecord.confirmed | 0;
    var deaths = record.deaths - prevRecord.deaths | 0;
    return {
            confirmed: confirmed,
            deaths: deaths
          };
  } else {
    return param[0];
  }
}

function getDailyMortailityRate(x) {
  var match = getDailyNewCases(x);
  var confirmed = match.confirmed;
  if (confirmed > 0) {
    return match.deaths / confirmed;
  } else {
    return 0;
  }
}

var allLocations = Js_dict.entries(locations).map((function (param) {
        return {
                value: param[0],
                label: param[1].name
              };
      }));

window.global = window;

exports.$$Map = $$Map;
exports.locations = locations;
exports.days = days;
exports.data = data;
exports.countryIds = countryIds;
exports.startDate = startDate;
exports.endDate = endDate;
exports.dayToIndex = dayToIndex;
exports.dataWithGrowth = dataWithGrowth;
exports.isInitialRange = isInitialRange;
exports.calendar = calendar$1;
exports.getRecord = getRecord;
exports.getValueFromRecord = getValueFromRecord;
exports.getValue = getValue;
exports.alignToDay0 = alignToDay0;
exports.getGrowth = getGrowth;
exports.getTotalMortailityRate = getTotalMortailityRate;
exports.getDailyNewCases = getDailyNewCases;
exports.getDailyMortailityRate = getDailyMortailityRate;
exports.allLocations = allLocations;
/* locations Not a pure module */
