'use strict';

var Block = require("bs-platform/lib/js/block.js");
var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Js_dict = require("bs-platform/lib/js/js_dict.js");
var Recharts = require("recharts");
var BsRecharts__XAxis = require("@ahrefs/bs-recharts/src/BsRecharts__XAxis.bs.js");
var BsRecharts__YAxis = require("@ahrefs/bs-recharts/src/BsRecharts__YAxis.bs.js");
var BsRecharts__ResponsiveContainer = require("@ahrefs/bs-recharts/src/BsRecharts__ResponsiveContainer.bs.js");

function calculateMaxValue(locations, data) {
  return data.reduce((function (maxValue, row) {
                return locations.reduce((function (maxValue, $$location) {
                              var match = Js_dict.get(row, $$location.label);
                              if (match !== undefined) {
                                return Math.max(maxValue, match);
                              } else {
                                return maxValue;
                              }
                            }), maxValue);
              }), 1);
}

function Chart(Props) {
  var data = Props.data;
  var color = Props.color;
  var locations = Props.locations;
  var scale = Props.scale;
  var threshold = Props.threshold;
  var divRef = React.useRef(null);
  var domain = /* array */[
    threshold === 0 ? 1 : threshold,
    calculateMaxValue(locations, data)
  ];
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
        }), /* array */[]);
  return React.createElement("div", {
              ref: divRef,
              className: "max-h-screen flex-1"
            }, React.createElement(Recharts.ResponsiveContainer, BsRecharts__ResponsiveContainer.makeProps(undefined, undefined, /* Prc */Block.__(1, [100]), 400, undefined, /* Prc */Block.__(1, [100]), React.createElement(Recharts.LineChart, {
                          data: data,
                          margin: {
                            top: 20,
                            right: 50,
                            bottom: 20,
                            left: 0
                          },
                          children: null
                        }, locations.map((function (param) {
                                var dataKey = param.label;
                                return React.createElement(Recharts.Line, {
                                            type: "monotone",
                                            dataKey: dataKey,
                                            dot: dot,
                                            stroke: Curry._1(color, dataKey),
                                            strokeWidth: 2,
                                            key: dataKey
                                          });
                              })), React.createElement(Recharts.Tooltip, {
                              content: (function (data) {
                                  var match = data.payload;
                                  if (match !== null) {
                                    return React.createElement("div", {
                                                className: "tooltip flex flex-col border-solid border border-gray-800 rounded p-2"
                                              }, match.map((function (payload) {
                                                      return React.createElement("span", {
                                                                  key: payload.dataKey,
                                                                  className: "tooltip-label"
                                                                }, React.createElement("span", {
                                                                      style: {
                                                                        color: payload.stroke
                                                                      }
                                                                    }, payload.name), data.separator + payload.value);
                                                    })));
                                  } else {
                                    return null;
                                  }
                                })
                            }), React.createElement(Recharts.XAxis, BsRecharts__XAxis.makeProps(undefined, undefined, undefined, undefined, undefined, undefined, "name", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, {
                                  left: 0,
                                  right: 30
                                }, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, /* () */0)), React.createElement(Recharts.YAxis, BsRecharts__YAxis.makeProps(/* number */561678025, undefined, undefined, undefined, undefined, undefined, undefined, domain, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, scale, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, /* () */0)), React.createElement(Recharts.Legend, { })), /* () */0)));
}

var make = Chart;

exports.calculateMaxValue = calculateMaxValue;
exports.make = make;
/* react Not a pure module */
