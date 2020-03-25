'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Js_math = require("bs-platform/lib/js/js_math.js");
var Recharts = require("recharts");
var Js_option = require("bs-platform/lib/js/js_option.js");
var CopyToClipboard = require("copy-to-clipboard");
var Data$ReasonReactExamples = require("./Data.bs.js");
var Colors$ReasonReactExamples = require("./Colors.bs.js");
var Recharts$ReasonReactExamples = require("./Recharts.bs.js");

var R = Recharts$ReasonReactExamples.Make({ });

function calculateMaxValue(locations, data) {
  return data.reduce((function (maxValue, param) {
                var values = param.values;
                return locations.reduce((function (maxValue, $$location) {
                              var match = Curry._1(values, $$location.id);
                              if (match !== undefined) {
                                return Math.max(maxValue, match.numberOfCases);
                              } else {
                                return maxValue;
                              }
                            }), maxValue);
              }), 1);
}

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

function Chart(Props) {
  var timeline = Props.timeline;
  var locations = Props.locations;
  var scale = Props.scale;
  var threshold = Props.threshold;
  var formatLabel = timeline ? (function (x) {
        return x;
      }) : (function (str) {
        if (str === "1") {
          return "1 day since " + (ordinalSuffix(threshold) + " case");
        } else {
          return str + (" days since " + (ordinalSuffix(threshold) + " case"));
        }
      });
  var displayGrowthBaseline = timeline || scale ? false : true;
  var data = timeline ? Data$ReasonReactExamples.calendar : Data$ReasonReactExamples.alignToDay0(threshold);
  var threshold$1 = threshold;
  var maxValue = calculateMaxValue(locations, data);
  var exponent = Js_math.ceil(Math.log(maxValue / threshold$1) / Math.log(1.33));
  var divRef = React.useRef(null);
  var match = React.useState((function () {
          return true;
        }));
  var setDot = match[1];
  var dot = match[0];
  React.useEffect((function () {
          var opt = divRef.current;
          if (!(opt == null)) {
            Curry._1(setDot, (function (param) {
                    return opt.clientHeight > 500;
                  }));
          }
          return ;
        }), []);
  var match$1 = React.useState((function () {
          return false;
        }));
  var setLinkCopied = match$1[1];
  var linkCopied = match$1[0];
  React.useEffect((function (param) {
          Curry._1(setLinkCopied, (function (param) {
                  return false;
                }));
          return ;
        }), /* tuple */[
        timeline,
        scale,
        locations,
        threshold
      ]);
  var tmp;
  if (timeline) {
    tmp = null;
  } else {
    var value = "Number of days since " + (ordinalSuffix(threshold) + " case");
    tmp = React.createElement(Recharts.Label, {
          style: {
            fontWeight: "bold",
            fontSize: "14px"
          },
          value: value,
          position: "insideTop",
          offset: 30
        });
  }
  return React.createElement("div", {
              ref: divRef,
              className: "max-h-screen flex-1 flex flex-col justify-center flex-basis-100"
            }, React.createElement("div", {
                  className: "flex-1 min-h-400 max-h-600 flex-basis-100"
                }, React.createElement(Recharts.ResponsiveContainer, {
                      minHeight: 400,
                      height: Recharts$ReasonReactExamples.pct(100),
                      width: Recharts$ReasonReactExamples.pct(100),
                      children: React.createElement(Recharts.LineChart, {
                            margin: {
                              top: 20,
                              right: 50,
                              bottom: 20,
                              left: 0
                            },
                            data: data,
                            children: null
                          }, React.createElement(Recharts.CartesianGrid, {
                                strokeDasharray: "3 3"
                              }), displayGrowthBaseline ? React.createElement(Recharts.Line, {
                                  type: "monotone",
                                  dataKey: (function (item) {
                                      if (item.index <= exponent) {
                                        return threshold * Math.pow(1.33, item.index) | 0;
                                      } else {
                                        return null;
                                      }
                                    }),
                                  stroke: Colors$ReasonReactExamples.colors.black,
                                  strokeWidth: 2,
                                  strokeDasharray: "3 3",
                                  dot: false,
                                  activeDot: false,
                                  name: "daily-growth-indicator"
                                }) : null, locations.map((function (param) {
                                    var id = param.id;
                                    var primaryColor = param.primaryColor;
                                    return React.createElement(Recharts.Line, {
                                                type: "monotone",
                                                dataKey: (function (item) {
                                                    var match = Curry._1(item.values, id);
                                                    if (match !== undefined) {
                                                      var x = match;
                                                      if (x.numberOfCases !== 0) {
                                                        return x.numberOfCases;
                                                      } else {
                                                        return null;
                                                      }
                                                    } else {
                                                      return null;
                                                    }
                                                  }),
                                                stroke: primaryColor,
                                                strokeWidth: 2,
                                                dot: dot ? ({
                                                      r: 3,
                                                      strokeWidth: 0,
                                                      fill: primaryColor
                                                    }) : false,
                                                activeDot: {
                                                  strokeWidth: 2,
                                                  fill: Colors$ReasonReactExamples.colors.white,
                                                  stroke: primaryColor
                                                },
                                                name: id,
                                                key: id
                                              });
                                  })).reverse(), React.createElement(Recharts.Tooltip, {
                                content: (function (param) {
                                    var separator = param.separator;
                                    var payload = param.payload;
                                    if (payload !== null) {
                                      return React.createElement("div", {
                                                  className: "tooltip flex flex-col bg-white shadow-lg border-solid border border-lightgrayblue rounded p-2"
                                                }, React.createElement("span", {
                                                      className: "text-base font-bold"
                                                    }, Curry._1(formatLabel, param.label)), payload.filter((function (payload) {
                                                          return payload.name !== "daily-growth-indicator";
                                                        })).map((function (payload) {
                                                        var growthString = Js_option.getWithDefault("", Js_option.map((function (param) {
                                                                    return " (+" + ((param.growth * 100).toFixed() + "%)");
                                                                  }), Curry._1(payload.payload.values, payload.name)));
                                                        return React.createElement("span", {
                                                                    key: payload.name,
                                                                    className: "text-base font-bold"
                                                                  }, React.createElement("span", {
                                                                        style: {
                                                                          color: payload.stroke
                                                                        }
                                                                      }, payload.name), separator + payload.value.toString(), React.createElement("span", {
                                                                        className: "text-base font-normal"
                                                                      }, growthString));
                                                      })));
                                    } else {
                                      return null;
                                    }
                                  })
                              }), React.createElement(Recharts.XAxis, {
                                padding: {
                                  left: 0,
                                  right: 30
                                },
                                dataKey: (function (item) {
                                    var match = item.x;
                                    if (match.tag) {
                                      return match[0];
                                    } else {
                                      return match[0].toLocaleDateString();
                                    }
                                  }),
                                axisLine: false,
                                tickLine: false,
                                interval: "preserveStartEnd",
                                minTickGap: 70,
                                children: tmp
                              }), React.createElement(Recharts.YAxis, {
                                type: "number",
                                scale: (function () {
                                      switch (scale ? /* linear */-325037595 : /* log */5395588) {
                                        case 5395588 :
                                            return "log";
                                        case -325037595 :
                                            return "linear";
                                        
                                      }
                                    })(),
                                domain: /* tuple */[
                                  "dataMin",
                                  "dataMax"
                                ],
                                axisLine: false,
                                tickLine: false
                              }))
                    }), React.createElement("div", {
                      className: "pl-4"
                    }, React.createElement("button", {
                          className: "border border-activeblue text-activeblue text-base px-2 py-1 rounded hover:bg-activeblue hover:text-white " + (
                            linkCopied ? "text-white bg-activeblue" : ""
                          ),
                          onClick: (function (param) {
                              Curry._1(setLinkCopied, (function (param) {
                                      return true;
                                    }));
                              CopyToClipboard(window.location.href);
                              return /* () */0;
                            })
                        }, linkCopied ? "Link copied to clipboard" : "Copy link to current chart"))));
}

var make = Chart;

exports.R = R;
exports.calculateMaxValue = calculateMaxValue;
exports.ordinalSuffix = ordinalSuffix;
exports.make = make;
/* R Not a pure module */
