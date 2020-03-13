'use strict';

var React = require("react");
var ReactDOMRe = require("reason-react/src/ReactDOMRe.js");
var Belt_Option = require("bs-platform/lib/js/belt_Option.js");
var Data$ReasonReactExamples = require("./Data.bs.js");
var Chart$ReasonReactExamples = require("./Chart.bs.js");
var Filters$ReasonReactExamples = require("./Filters.bs.js");

function ordinalSuffix(i) {
  var j = i % 10;
  var k = i % 100;
  var i$1 = i.toString();
  if (j === 1 && k !== 11) {
    return i$1 + "st";
  } else if (j === 2 && k !== 12) {
    return i$1 + "nd";
  } else if (j === 3 && k !== 13) {
    return i$1 + "rd";
  } else {
    return i$1 + "th";
  }
}

function Index$App(Props) {
  var match = React.useState((function () {
          return /* array */[
                      "Germany",
                      "Italy",
                      "Japan",
                      "China (Guangdong)",
                      "Spain",
                      "US (All regions)"
                    ].map((function (param) {
                          return Data$ReasonReactExamples.$$Map.get(Data$ReasonReactExamples.locations, param);
                        })).map((function (value) {
                        return {
                                value: value,
                                label: value.name
                              };
                      }));
        }));
  var locations = match[0];
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
  var match$2 = match$1 ? /* tuple */[
      Data$ReasonReactExamples.calendar,
      (function (str) {
          return str;
        })
    ] : /* tuple */[
      Data$ReasonReactExamples.alignToDay0(thresholdOr1),
      (function (str) {
          if (str === "1") {
            return "1 day since " + (ordinalSuffix(thresholdOr1) + " case");
          } else {
            return str + (" days since " + (ordinalSuffix(thresholdOr1) + " case"));
          }
        })
    ];
  var match$3 = scale[0];
  return React.createElement("div", {
              className: "flex bg-gray-900 flex-col-reverse md:flex-row"
            }, React.createElement(Filters$ReasonReactExamples.make, {
                  locations: locations,
                  allLocations: Data$ReasonReactExamples.allLocations,
                  setLocations: match[1],
                  scale: scale,
                  timeline: timeline,
                  threshold: threshold
                }), React.createElement(Chart$ReasonReactExamples.make, {
                  data: match$2[0],
                  color: (function (param) {
                      return Data$ReasonReactExamples.$$Map.get(Data$ReasonReactExamples.colors, param);
                    }),
                  locations: locations,
                  scale: match$3 ? /* linear */-325037595 : /* log */5395588,
                  threshold: thresholdOr1,
                  formatLabel: match$2[1]
                }));
}

var App = {
  ordinalSuffix: ordinalSuffix,
  make: Index$App
};

ReactDOMRe.renderToElementWithId(React.createElement(Index$App, { }), "index");

exports.App = App;
/*  Not a pure module */
