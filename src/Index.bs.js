'use strict';

var React = require("react");
var Belt_Array = require("bs-platform/lib/js/belt_Array.js");
var ReactDOMRe = require("reason-react/src/ReactDOMRe.js");
var Belt_Option = require("bs-platform/lib/js/belt_Option.js");
var Data$ReasonReactExamples = require("./Data.bs.js");
var Chart$ReasonReactExamples = require("./Chart.bs.js");
var Filters$ReasonReactExamples = require("./Filters.bs.js");

function useLocations($$default) {
  var white = "#fff";
  var black = "#000";
  var fallbackColor = /* tuple */[
    "#878787",
    white
  ];
  var colors = [
    /* tuple */[
      "#a50026",
      white
    ],
    /* tuple */[
      "#fdae61",
      black
    ],
    /* tuple */[
      "#313695",
      white
    ],
    /* tuple */[
      "#d73027",
      white
    ],
    /* tuple */[
      "#fee090",
      black
    ],
    /* tuple */[
      "#abd9e9",
      black
    ],
    /* tuple */[
      "#f46d43",
      white
    ],
    /* tuple */[
      "#74add1",
      white
    ],
    /* tuple */[
      "#4575b4",
      white
    ],
    fallbackColor
  ];
  var colorMaxIndex = colors.length - 1 | 0;
  var match = React.useState((function () {
          return $$default;
        }));
  return /* tuple */[
          Belt_Array.mapWithIndexU(match[0], (function (index, locationId) {
                  var match = colors[Math.min(index, colorMaxIndex)];
                  return {
                          primaryColor: match[0],
                          secondaryColor: match[1],
                          text: Data$ReasonReactExamples.$$Map.get(Data$ReasonReactExamples.locations, locationId).name,
                          id: locationId
                        };
                })),
          match[1]
        ];
}

function Index$App(Props) {
  var match = useLocations([
        "China (Guangdong)",
        "Germany",
        "Italy",
        "Japan",
        "Spain",
        "US (All regions)"
      ]);
  var locations = match[0];
  var scale = React.useState((function () {
          return /* Logarithmic */0;
        }));
  var timeline = React.useState((function () {
          return /* RelativeToThreshold */0;
        }));
  var threshold = React.useState((function () {
          return 17;
        }));
  var thresholdOr1 = Belt_Option.getWithDefault(threshold[0], 1);
  return React.createElement("div", {
              className: "flex bg-white flex-col-reverse md:flex-row"
            }, React.createElement(Filters$ReasonReactExamples.make, {
                  locations: locations,
                  allLocations: Data$ReasonReactExamples.allLocations,
                  setLocations: match[1],
                  scale: scale,
                  timeline: timeline,
                  threshold: threshold
                }), React.createElement(Chart$ReasonReactExamples.make, {
                  timeline: timeline[0],
                  locations: locations,
                  scale: scale[0],
                  threshold: thresholdOr1
                }));
}

var App = {
  useLocations: useLocations,
  make: Index$App
};

ReactDOMRe.renderToElementWithId(React.createElement(Index$App, { }), "index");

exports.App = App;
/*  Not a pure module */
