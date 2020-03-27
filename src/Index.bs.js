'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Js_option = require("bs-platform/lib/js/js_option.js");
var Belt_Array = require("bs-platform/lib/js/belt_Array.js");
var ReactDOMRe = require("reason-react/src/ReactDOMRe.js");
var Belt_Option = require("bs-platform/lib/js/belt_Option.js");
var SerializeQueryParams = require("serialize-query-params");
var Data$ReasonReactExamples = require("./Data.bs.js");
var Chart$ReasonReactExamples = require("./Chart.bs.js");
var Filters$ReasonReactExamples = require("./Filters.bs.js");
var ColorStack$ReasonReactExamples = require("./ColorStack.bs.js");
var UseQueryParam$ReasonReactExamples = require("./UseQueryParam.bs.js");

function useLocations($$default) {
  var match = React.useState((function () {
          return ColorStack$ReasonReactExamples.make($$default);
        }));
  var setColors = match[1];
  var colors = match[0];
  var match$1 = UseQueryParam$ReasonReactExamples.hook((function (param) {
          return $$default;
        }), "loc", SerializeQueryParams.ArrayParam);
  var setLocations = match$1[1];
  var locations = match$1[0];
  return /* tuple */[
          Belt_Array.mapU(locations, (function (locationId) {
                  var match = ColorStack$ReasonReactExamples.getColor(locationId, colors);
                  return {
                          primaryColor: match[0],
                          secondaryColor: match[1],
                          text: Data$ReasonReactExamples.$$Map.get(Data$ReasonReactExamples.locations, locationId).name,
                          id: locationId
                        };
                })),
          (function (updater) {
              Curry._1(setColors, (function (colorStack) {
                      return ColorStack$ReasonReactExamples.updateColors(Curry._1(updater, locations), colorStack);
                    }));
              return Curry._1(setLocations, updater);
            })
        ];
}

function useStringQueryParamState(initial, queryFragment, encode, decode) {
  return UseQueryParam$ReasonReactExamples.hook(initial, queryFragment, {
              encode: (function (x) {
                  return Curry._1(SerializeQueryParams.StringParam.encode, Curry._1(encode, x));
                }),
              decode: (function (x) {
                  return Js_option.andThen(Curry.__1(decode), Curry._1(SerializeQueryParams.StringParam.decode, x));
                })
            });
}

function Index$App(Props) {
  var match = useLocations([
        "China (Guangdong)",
        "Germany",
        "Italy",
        "Japan",
        "Spain",
        "US"
      ]);
  var locations = match[0];
  var scale = useStringQueryParamState((function (param) {
          return /* Logarithmic */0;
        }), "scale", (function (param) {
          if (param) {
            return "linear";
          } else {
            return "log";
          }
        }), (function (param) {
          switch (param) {
            case "linear" :
                return /* Linear */1;
            case "log" :
                return /* Logarithmic */0;
            default:
              return ;
          }
        }));
  var timeline = useStringQueryParamState((function (param) {
          return /* RelativeToThreshold */0;
        }), "timeline", (function (param) {
          if (param) {
            return "calendar";
          } else {
            return "relative";
          }
        }), (function (param) {
          switch (param) {
            case "calendar" :
                return /* CalendarDates */1;
            case "relative" :
                return /* RelativeToThreshold */0;
            default:
              return ;
          }
        }));
  var chartType = useStringQueryParamState((function (param) {
          return /* Number */[/* Confirmed */0];
        }), "chart", (function (param) {
          if (typeof param === "number") {
            if (param !== 0) {
              return "total_mortality_rate";
            } else {
              return "percentage_growth_cases";
            }
          } else if (param[0]) {
            return "deaths_count";
          } else {
            return "cases_count";
          }
        }), (function (param) {
          switch (param) {
            case "cases_count" :
                return /* Number */[/* Confirmed */0];
            case "deaths_count" :
                return /* Number */[/* Deaths */1];
            case "percentage_growth_cases" :
                return /* PercentageGrowthOfCases */0;
            case "total_mortality_rate" :
                return /* TotalMortalityRate */1;
            default:
              return ;
          }
        }));
  var threshold = UseQueryParam$ReasonReactExamples.hook((function (param) {
          return 17;
        }), "threshold", {
        encode: (function (x) {
            return Curry._1(SerializeQueryParams.NumberParam.encode, Belt_Option.getWithDefault(x, 1));
          }),
        decode: (function (x) {
            return Js_option.map((function (x) {
                          return x;
                        }), Curry._1(SerializeQueryParams.NumberParam.decode, x));
          })
      });
  var startDate = UseQueryParam$ReasonReactExamples.hook((function (param) {
          return Data$ReasonReactExamples.startDate;
        }), "since", SerializeQueryParams.DateParam);
  var endDate = UseQueryParam$ReasonReactExamples.hook((function (param) {
          return Data$ReasonReactExamples.endDate;
        }), "until", SerializeQueryParams.DateParam);
  var resetDates = Data$ReasonReactExamples.isInitialRange(startDate[0], endDate[0]) ? undefined : (function (param) {
        var setStart = startDate[1];
        var setEnd = endDate[1];
        Curry._1(setStart, (function (param) {
                return Data$ReasonReactExamples.startDate;
              }));
        return Curry._1(setEnd, (function (param) {
                      return Data$ReasonReactExamples.endDate;
                    }));
      });
  var thresholdOr1 = Belt_Option.getWithDefault(threshold[0], 1);
  return React.createElement("div", {
              className: "flex bg-white flex-col-reverse md:flex-row"
            }, React.createElement(Filters$ReasonReactExamples.make, {
                  locations: locations,
                  allLocations: Data$ReasonReactExamples.allLocations,
                  setLocations: match[1],
                  scale: scale,
                  timeline: timeline,
                  chartType: chartType,
                  threshold: threshold,
                  startDate: startDate,
                  endDate: endDate,
                  resetDates: resetDates
                }), React.createElement(Chart$ReasonReactExamples.make, {
                  timeline: timeline[0],
                  locations: locations,
                  scale: scale[0],
                  threshold: thresholdOr1,
                  chartType: chartType[0],
                  startDate: startDate[0],
                  endDate: endDate[0]
                }));
}

var App = {
  useLocations: useLocations,
  useStringQueryParamState: useStringQueryParamState,
  make: Index$App
};

ReactDOMRe.renderToElementWithId(React.createElement(Index$App, { }), "index");

exports.App = App;
/*  Not a pure module */
