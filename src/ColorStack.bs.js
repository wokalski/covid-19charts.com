'use strict';

var Belt_MapString = require("bs-platform/lib/js/belt_MapString.js");
var Belt_SetString = require("bs-platform/lib/js/belt_SetString.js");
var Belt_MutableStack = require("bs-platform/lib/js/belt_MutableStack.js");

var white = "#fff";

var black = "#000";

var fallbackColor = /* tuple */[
  "#878787",
  white
];

var colors = [
  /* Color */[
    "#a50026",
    white
  ],
  /* Color */[
    "#fdae61",
    black
  ],
  /* Color */[
    "#313695",
    white
  ],
  /* Color */[
    "#d73027",
    white
  ],
  /* Color */[
    "#fee090",
    black
  ],
  /* Color */[
    "#abd9e9",
    black
  ],
  /* Color */[
    "#f46d43",
    white
  ],
  /* Color */[
    "#74add1",
    white
  ],
  /* Color */[
    "#4575b4",
    white
  ]
];

var stack = Belt_MutableStack.make(/* () */0);

colors.forEach((function (color) {
        return Belt_MutableStack.push(stack, color);
      }));

function popColor(colorQueue) {
  var match = Belt_MutableStack.pop(colorQueue);
  if (match !== undefined) {
    return match;
  } else {
    return /* Fallback */0;
  }
}

function make(locations) {
  var colors = Belt_MutableStack.copy(stack);
  return {
          colors: colors,
          associations: locations.reduce((function (associations, $$location) {
                  var color = popColor(colors);
                  return Belt_MapString.set(associations, $$location, color);
                }), null)
        };
}

function updateColors(locations, param) {
  var associations = param.associations;
  var colors = Belt_MutableStack.copy(param.colors);
  var locations$1 = Belt_SetString.fromArray(locations);
  var prevLocations = Belt_SetString.fromArray(Belt_MapString.keysToArray(associations));
  var removed = Belt_SetString.diff(prevLocations, locations$1);
  Belt_SetString.forEach(removed, (function ($$location) {
          var match = Belt_MapString.get(associations, $$location);
          if (match !== undefined) {
            var color = match;
            if (color) {
              return Belt_MutableStack.push(colors, color);
            } else {
              return /* () */0;
            }
          } else {
            return /* () */0;
          }
        }));
  return {
          colors: colors,
          associations: Belt_SetString.reduce(locations$1, null, (function (newAssociations, $$location) {
                  var match = Belt_MapString.get(associations, $$location);
                  if (match !== undefined) {
                    return Belt_MapString.set(newAssociations, $$location, match);
                  } else {
                    var color = popColor(colors);
                    return Belt_MapString.set(newAssociations, $$location, color);
                  }
                }))
        };
}

function getColor($$location, param) {
  var match = Belt_MapString.getWithDefault(param.associations, $$location, /* Fallback */0);
  if (match) {
    return /* tuple */[
            match[0],
            match[1]
          ];
  } else {
    return fallbackColor;
  }
}

exports.make = make;
exports.updateColors = updateColors;
exports.getColor = getColor;
/* stack Not a pure module */
