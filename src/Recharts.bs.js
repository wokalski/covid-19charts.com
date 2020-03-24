'use strict';


function pct($$float) {
  return $$float.toString() + "%";
}

var PctOrPx = {
  pct: pct
};

function px(prim) {
  return prim;
}

var Dot = { };

function Make(Config) {
  var ResponsiveContainer = { };
  var LineChart = { };
  var Line = { };
  var XAxis = { };
  var YAxis = { };
  var Tooltip = { };
  var CartesianGrid = { };
  var Label = { };
  return {
          ResponsiveContainer: ResponsiveContainer,
          LineChart: LineChart,
          Line: Line,
          XAxis: XAxis,
          YAxis: YAxis,
          Tooltip: Tooltip,
          CartesianGrid: CartesianGrid,
          Label: Label
        };
}

exports.PctOrPx = PctOrPx;
exports.px = px;
exports.pct = pct;
exports.Dot = Dot;
exports.Make = Make;
/* No side effect */
