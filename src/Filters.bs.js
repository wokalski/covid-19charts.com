'use strict';

var Block = require("bs-platform/lib/js/block.js");
var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Js_option = require("bs-platform/lib/js/js_option.js");
var Pervasives = require("bs-platform/lib/js/pervasives.js");
var ReactSelect = require("react-select");

function Filters$Input(Props) {
  var id = Props.id;
  var value = Props.value;
  var onBlur = Props.onBlur;
  var onChange = Props.onChange;
  var label = Props.label;
  var tmp;
  switch (value.tag | 0) {
    case /* Float */0 :
    case /* Number */1 :
        tmp = "number";
        break;
    case /* Text */2 :
        tmp = "text";
        break;
    
  }
  var tmp$1;
  switch (value.tag | 0) {
    case /* Float */0 :
        tmp$1 = Js_option.getWithDefault("", Js_option.map((function ($$int) {
                    return $$int.toString();
                  }), value[0]));
        break;
    case /* Number */1 :
        tmp$1 = Js_option.getWithDefault("", Js_option.map((function ($$int) {
                    return $$int.toString();
                  }), value[0]));
        break;
    case /* Text */2 :
        tmp$1 = value[0];
        break;
    
  }
  return React.createElement("input", {
              className: "appearance-none leading-tight focus:outline-none placeholder-dimmed bg-gray-800 rounded-lg overflow-hidden border border-solid border-gray-700 p-2 text-gray-400 text-sm font-light",
              id: id,
              placeholder: label,
              type: tmp,
              value: tmp$1,
              onBlur: onBlur,
              onChange: onChange
            });
}

var Input = {
  make: Filters$Input
};

function Filters$SegmentedControl$Button(Props) {
  var text = Props.text;
  var isSelected = Props.isSelected;
  var onClick = Props.onClick;
  return React.createElement("button", {
              className: (
                isSelected ? "bg-gray-700 text-gray-400" : "bg-gray-800 text-gray-500"
              ) + " text-sm flex-1 py-1 font-light",
              onClick: (function ($$event) {
                  Curry._1(onClick, /* () */0);
                  $$event.preventDefault();
                  return /* () */0;
                })
            }, text);
}

var Button = {
  make: Filters$SegmentedControl$Button
};

function Filters$SegmentedControl(Props) {
  var allValues = Props.allValues;
  var selectedIndex = Props.selectedIndex;
  var onChange = Props.onChange;
  return React.createElement("div", {
              className: "flex bg-gray-800 rounded-lg overflow-hidden border border-solid border-gray-700"
            }, allValues.map((function (param, index) {
                    var value = param.value;
                    var label = param.label;
                    return React.createElement(Filters$SegmentedControl$Button, {
                                text: label,
                                isSelected: selectedIndex === index,
                                onClick: (function (param) {
                                    return Curry._2(onChange, value, index);
                                  }),
                                key: label
                              });
                  })));
}

var SegmentedControl = {
  Button: Button,
  make: Filters$SegmentedControl
};

function Filters$Header(Props) {
  var title = Props.title;
  return React.createElement("div", {
              className: "pt-2 pb-1"
            }, React.createElement("span", {
                  className: "text-gray-600 text-sm"
                }, title));
}

var Header = {
  make: Filters$Header
};

function Filters$Title(Props) {
  return React.createElement("div", undefined, React.createElement("h2", {
                  className: "text-gray-300 pb-1"
                }, "Number of COVID-19 cases per location."), React.createElement("span", {
                  className: "text-gray-300 text-md pt-3"
                }, "The single most important chart to help you understand the COVID-19 outlook for your location."));
}

var Title = {
  make: Filters$Title
};

function Filters$Footer$A(Props) {
  var href = Props.href;
  var str = Props.str;
  return React.createElement("a", {
              className: "font-bold",
              href: href
            }, str);
}

var A = {
  make: Filters$Footer$A
};

function Filters$Footer(Props) {
  return React.createElement("div", {
              className: "py-3 overflow-scroll"
            }, React.createElement("div", undefined, React.createElement("span", {
                      className: "text-gray-400 text-sm"
                    }, "Created by ", React.createElement(Filters$Footer$A, {
                          href: "https://twitter.com/wokalski",
                          str: "Wojtek Czekalski"
                        }))), React.createElement("div", undefined, React.createElement("span", {
                      className: "text-gray-400 text-sm"
                    }, "Data provided by ", React.createElement(Filters$Footer$A, {
                          href: "https://github.com/CSSEGISandData/COVID-19",
                          str: "CSSE at Johns Hopkins University"
                        }))), React.createElement("div", undefined, React.createElement("span", {
                      className: "text-gray-400 text-sm"
                    }, "Contribute on ", React.createElement(Filters$Footer$A, {
                          href: "https://github.com/wokalski/COVID-19charts",
                          str: "Github"
                        }), " or contact the author at: ", React.createElement("br", undefined), "me (at) wczekalski.com")));
}

var Footer = {
  A: A,
  make: Filters$Footer
};

function Filters(Props) {
  var locations = Props.locations;
  var allLocations = Props.allLocations;
  var setLocations = Props.setLocations;
  var match = Props.scale;
  var setScale = match[1];
  var match$1 = Props.timeline;
  var setTimeline = match$1[1];
  var timeline = match$1[0];
  var match$2 = Props.threshold;
  var setThreshold = match$2[1];
  return React.createElement("div", {
              className: "w-64 p-4"
            }, React.createElement(Filters$Title, { }), React.createElement(Filters$Header, {
                  title: "Locations"
                }), React.createElement(ReactSelect.default, {
                  defaultValue: locations,
                  isMulti: true,
                  name: "Locations",
                  options: allLocations,
                  placeholder: "Select",
                  isClearable: false,
                  onChange: (function (newSelection) {
                      if (newSelection == null) {
                        return Curry._1(setLocations, (function (param) {
                                      return /* array */[];
                                    }));
                      } else {
                        return Curry._1(setLocations, (function (param) {
                                      return newSelection;
                                    }));
                      }
                    })
                }), React.createElement(Filters$Header, {
                  title: "Scale"
                }), React.createElement(Filters$SegmentedControl, {
                  allValues: /* array */[
                    {
                      label: "Logarithmic",
                      value: /* Logarithmic */0
                    },
                    {
                      label: "Linear",
                      value: /* Linear */1
                    }
                  ],
                  selectedIndex: match[0] ? 1 : 0,
                  onChange: (function (value, param) {
                      return Curry._1(setScale, (function (param) {
                                    return value;
                                  }));
                    })
                }), React.createElement(Filters$Header, {
                  title: "Timeline"
                }), React.createElement(Filters$SegmentedControl, {
                  allValues: /* array */[
                    {
                      label: "Align to day 0",
                      value: /* Day0 */0
                    },
                    {
                      label: "Dates",
                      value: /* Dates */1
                    }
                  ],
                  selectedIndex: timeline ? 1 : 0,
                  onChange: (function (value, param) {
                      return Curry._1(setTimeline, (function (param) {
                                    return value;
                                  }));
                    })
                }), timeline ? null : React.createElement(React.Fragment, undefined, React.createElement(Filters$Header, {
                        title: "Threshold (# of cases)"
                      }), React.createElement(Filters$Input, {
                        id: "nr_of_cases",
                        value: /* Number */Block.__(1, [match$2[0]]),
                        onBlur: (function (prim) {
                            return /* () */0;
                          }),
                        onChange: (function (ev) {
                            var value = Pervasives.int_of_string_opt(ev.target.value);
                            return Curry._1(setThreshold, (function (param) {
                                          return value;
                                        }));
                          }),
                        label: "Threshold"
                      })), React.createElement(Filters$Footer, { }));
}

var make = Filters;

exports.Input = Input;
exports.SegmentedControl = SegmentedControl;
exports.Header = Header;
exports.Title = Title;
exports.Footer = Footer;
exports.make = make;
/* react Not a pure module */
