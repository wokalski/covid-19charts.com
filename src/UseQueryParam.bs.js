'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Js_dict = require("bs-platform/lib/js/js_dict.js");
var Belt_Option = require("bs-platform/lib/js/belt_Option.js");
var SerializeQueryParams = require("serialize-query-params");

function hook(makeInitial, queryFragment, coder) {
  var isInitialRender = React.useRef(true);
  var match = React.useState((function () {
          return Curry._1(makeInitial, /* () */0);
        }));
  var setValue = match[1];
  var value = match[0];
  React.useEffect((function () {
          if (isInitialRender.current) {
            var pathname = SerializeQueryParams.parse(window.location.search);
            Belt_Option.forEach(Belt_Option.flatMap(Js_dict.get(pathname, queryFragment), coder.decode), (function (x) {
                    return Curry._1(setValue, (function (param) {
                                  return x;
                                }));
                  }));
            isInitialRender.current = false;
            return ;
          } else {
            var obj = { };
            obj[queryFragment] = Curry._1(coder.encode, value);
            var match = SerializeQueryParams.updateInLocation(obj, window.location);
            var state = match.state;
            console.log(state);
            window.history.replaceState(state, "", "" + (String(match.protocol) + ("//" + (String(match.host) + ("" + (String(match.pathname) + ("" + (String(match.search) + ""))))))));
            return ;
          }
        }), [value]);
  return /* tuple */[
          value,
          setValue
        ];
}

exports.hook = hook;
/* react Not a pure module */
