'use strict';

var Block = require("bs-platform/lib/js/block.js");
var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Recharts = require("recharts");
var BsRecharts__XAxis = require("@ahrefs/bs-recharts/src/BsRecharts__XAxis.bs.js");
var BsRecharts__YAxis = require("@ahrefs/bs-recharts/src/BsRecharts__YAxis.bs.js");
var BsRecharts__ResponsiveContainer = require("@ahrefs/bs-recharts/src/BsRecharts__ResponsiveContainer.bs.js");

function Chart(Props) {
  var data = Props.data;
  var color = Props.color;
  var locations = Props.locations;
  var scale = Props.scale;
  var threshold = Props.threshold;
  var domain = scale !== 5395588 ? undefined : /* array */[
      threshold === 0 ? "dataMin" : threshold,
      "dataMax"
    ];
  return React.createElement("div", {
              className: "flex-1"
            }, React.createElement(Recharts.ResponsiveContainer, BsRecharts__ResponsiveContainer.makeProps(undefined, undefined, /* Prc */Block.__(1, [100]), undefined, undefined, /* Prc */Block.__(1, [100]), React.createElement(Recharts.LineChart, {
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
                                            stroke: Curry._1(color, dataKey),
                                            strokeWidth: 2,
                                            key: dataKey
                                          });
                              })), React.createElement(Recharts.Tooltip, {
                              content: (function (data) {
                                  return React.createElement("div", {
                                              className: "tooltip flex flex-col border-solid border border-gray-800 rounded p-2"
                                            }, data.payload.map((function (payload) {
                                                    return React.createElement("span", {
                                                                key: payload.dataKey,
                                                                className: "tooltip-label"
                                                              }, React.createElement("span", {
                                                                    style: {
                                                                      color: payload.stroke
                                                                    }
                                                                  }, payload.name), data.separator + payload.value);
                                                  })));
                                })
                            }), React.createElement(Recharts.XAxis, BsRecharts__XAxis.makeProps(undefined, undefined, undefined, undefined, undefined, undefined, "name", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, {
                                  left: 0,
                                  right: 30
                                }, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, /* () */0)), React.createElement(Recharts.YAxis, BsRecharts__YAxis.makeProps(undefined, undefined, undefined, undefined, undefined, undefined, undefined, domain, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, scale, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, /* () */0)), React.createElement(Recharts.Legend, { })), /* () */0)));
}

var make = Chart;

exports.make = make;
/* react Not a pure module */
