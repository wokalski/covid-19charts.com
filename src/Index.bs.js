'use strict';

var $$Array = require("bs-platform/lib/js/array.js");
var React = require("react");
var Js_dict = require("bs-platform/lib/js/js_dict.js");
var ReactDOMRe = require("reason-react/src/ReactDOMRe.js");
var Belt_Option = require("bs-platform/lib/js/belt_Option.js");
var Caml_format = require("bs-platform/lib/js/caml_format.js");
var Caml_primitive = require("bs-platform/lib/js/caml_primitive.js");
var Chart$ReasonReactExamples = require("./Chart.bs.js");
var Filters$ReasonReactExamples = require("./Filters.bs.js");

function keys(prim) {
  return Object.keys(prim);
}

function get(prim, prim$1) {
  return prim[prim$1];
}

var $$Map = {
  keys: keys,
  get: get,
  get_opt: Js_dict.get,
  map: Js_dict.map,
  entries: Js_dict.entries,
  fromArray: Js_dict.fromArray
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
                    index.toString()
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
                row[locations[countryId].name] = data[countryId][day].toString();
                return /* () */0;
              }));
        return row;
      }));

function alignToDay0(threshold) {
  var data$1 = Js_dict.map((function (dataPoints) {
          return Js_dict.fromArray(Js_dict.entries(dataPoints).map((function (param) {
                                    return /* tuple */[
                                            Caml_format.caml_int_of_string(dayToIndex[param[0]]),
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

function Index$App(Props) {
  var match = React.useState((function () {
          return /* array */[
                      "Germany",
                      "Italy",
                      "Japan",
                      "China (Guangdong)",
                      "Spain"
                    ].map((function (param) {
                          return locations[param];
                        })).map((function (value) {
                        return {
                                value: value,
                                label: value.name
                              };
                      }));
        }));
  var locations$1 = match[0];
  var scale = React.useState((function () {
          return /* Logarithmic */0;
        }));
  var timeline = React.useState((function () {
          return /* Day0 */0;
        }));
  var threshold = React.useState((function () {
          return 17;
        }));
  var thresholdOr1 = Belt_Option.getWithDefault(threshold[0], 1);
  var match$1 = timeline[0];
  var data = match$1 ? calendar : alignToDay0(thresholdOr1);
  var match$2 = scale[0];
  return React.createElement("div", {
              className: "flex bg-gray-900 flex-col-reverse md:flex-row"
            }, React.createElement(Filters$ReasonReactExamples.make, {
                  locations: locations$1,
                  allLocations: allLocations,
                  setLocations: match[1],
                  scale: scale,
                  timeline: timeline,
                  threshold: threshold
                }), React.createElement(Chart$ReasonReactExamples.make, {
                  data: data,
                  color: (function (param) {
                      return colors[param];
                    }),
                  locations: locations$1,
                  scale: match$2 ? /* linear */-325037595 : /* log */5395588,
                  threshold: thresholdOr1
                }));
}

var App = {
  make: Index$App
};

ReactDOMRe.renderToElementWithId(React.createElement(Index$App, { }), "index");

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
exports.App = App;
/* locations Not a pure module */
