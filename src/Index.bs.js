'use strict';

var React = require("react");
var ReactDOMRe = require("reason-react/src/ReactDOMRe.js");
var Belt_Option = require("bs-platform/lib/js/belt_Option.js");
var Data$ReasonReactExamples = require("./Data.bs.js");
var Chart$ReasonReactExamples = require("./Chart.bs.js");
var Filters$ReasonReactExamples = require("./Filters.bs.js");

function Index$App(Props) {
  var match = React.useState((function () {
          return /* array */[
                      "Germany",
                      "Italy",
                      "Japan",
                      "China (Guangdong)",
                      "Spain",
                      "US (California)"
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
  var data = match$1 ? Data$ReasonReactExamples.calendar : Data$ReasonReactExamples.alignToDay0(thresholdOr1);
  var match$2 = scale[0];
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
                  data: data,
                  color: (function (param) {
                      return Data$ReasonReactExamples.$$Map.get(Data$ReasonReactExamples.colors, param);
                    }),
                  locations: locations,
                  scale: match$2 ? /* linear */-325037595 : /* log */5395588,
                  threshold: thresholdOr1
                }));
}

var App = {
  make: Index$App
};

ReactDOMRe.renderToElementWithId(React.createElement(Index$App, { }), "index");

exports.App = App;
/*  Not a pure module */
