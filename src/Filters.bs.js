'use strict';

var Block = require("bs-platform/lib/js/block.js");
var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Caml_obj = require("bs-platform/lib/js/caml_obj.js");
var Js_option = require("bs-platform/lib/js/js_option.js");
var Belt_Array = require("bs-platform/lib/js/belt_Array.js");
var Pervasives = require("bs-platform/lib/js/pervasives.js");
var Belt_Option = require("bs-platform/lib/js/belt_Option.js");
var Caml_option = require("bs-platform/lib/js/caml_option.js");
var ReactSelect = require("react-select");
var ReactDatepicker = require("react-datepicker");
var Colors$ReasonReactExamples = require("./Colors.bs.js");

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
              className: "threshold-input",
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

function Filters$H1(Props) {
  var text = Props.text;
  return React.createElement("h1", {
              className: "text-big font-bold"
            }, text);
}

var H1 = {
  make: Filters$H1
};

function Filters$H2(Props) {
  var text = Props.text;
  return React.createElement("h2", {
              className: "text-md font-bold pt-3"
            }, text);
}

var H2 = {
  make: Filters$H2
};

function Filters$P(Props) {
  var text = Props.text;
  return React.createElement("p", {
              className: "text-base font-regular"
            }, text);
}

var P = {
  make: Filters$P
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
              className: "py-3 overflow-scroll text-base"
            }, React.createElement("div", undefined, React.createElement("span", undefined, "Created by ", React.createElement(Filters$Footer$A, {
                          href: "https://twitter.com/wokalski",
                          str: "Wojtek Czekalski"
                        }), " and Marta Konopko")), React.createElement("div", undefined, React.createElement("span", {
                      className: "text-gray-400 text-base"
                    }, "Data provided by ", React.createElement(Filters$Footer$A, {
                          href: "https://github.com/CSSEGISandData/COVID-19",
                          str: "CSSE at Johns Hopkins University"
                        }))), React.createElement("div", undefined, React.createElement("span", {
                      className: "text-gray-400 text-base"
                    }, "Contribute on ", React.createElement(Filters$Footer$A, {
                          href: "https://github.com/wokalski/COVID-19charts.com",
                          str: "Github"
                        }), " or contact the author at: ", React.createElement("br", undefined), "me (at) wczekalski.com")));
}

var Footer = {
  A: A,
  make: Filters$Footer
};

function Filters$MultiValueContainer(Props) {
  var children = Props.children;
  return React.createElement("div", undefined, children);
}

var MultiValueContainer = {
  make: Filters$MultiValueContainer
};

function Filters$Radio$Circle(Props) {
  var selected = Props.selected;
  var selected$1 = selected ? "-selected" : "";
  return React.createElement("div", {
              className: "radio-button-ring" + selected$1
            }, React.createElement("div", {
                  className: "radio-button-circle" + selected$1
                }));
}

var Circle = {
  make: Filters$Radio$Circle
};

function Filters$Radio(Props) {
  var values = Props.values;
  var selectedValue = Props.selectedValue;
  var format = Props.format;
  var getKeyOpt = Props.getKey;
  var onChange = Props.onChange;
  var getKey = getKeyOpt !== undefined ? getKeyOpt : (function (prim) {
        return String(prim);
      });
  return React.createElement("div", {
              className: "flex flex-col"
            }, Belt_Array.mapU(values, (function (value) {
                    var text = Curry._1(format, value);
                    var selected = Caml_obj.caml_equal(value, selectedValue);
                    var fontWeight = selected ? "font-bold" : "font-regular";
                    return React.createElement("button", {
                                key: Curry._1(getKey, value),
                                className: "flex items-center py-1",
                                onClick: (function (param) {
                                    return Curry._1(onChange, value);
                                  })
                              }, React.createElement(Filters$Radio$Circle, {
                                    selected: Caml_obj.caml_equal(value, selectedValue)
                                  }), React.createElement("span", {
                                    className: "text-black text-base pl-2 " + fontWeight
                                  }, text));
                  })));
}

var Radio = {
  Circle: Circle,
  make: Filters$Radio
};

function Filters$RadioSection(Props) {
  var text = Props.text;
  var values = Props.values;
  var selectedValue = Props.selectedValue;
  var format = Props.format;
  var onChange = Props.onChange;
  return React.createElement("div", undefined, React.createElement(Filters$H2, {
                  text: text
                }), React.createElement(Filters$Radio, {
                  values: values,
                  selectedValue: selectedValue,
                  format: format,
                  onChange: onChange
                }));
}

var RadioSection = {
  make: Filters$RadioSection
};

function Filters$Locations$Remove(Props) {
  return React.createElement("svg", {
              className: "legend-remove-button",
              height: "14px",
              width: "14px",
              version: "1.1",
              viewBox: "0 0 14 14",
              xmlns: "http://www.w3.org/2000/svg"
            }, React.createElement("defs", undefined), React.createElement("g", {
                  id: "Page-1",
                  fill: "none",
                  fillRule: "evenodd",
                  stroke: "none",
                  strokeWidth: "1"
                }, React.createElement("g", {
                      id: "Desktop",
                      transform: "translate(-575.000000, -253.000000)"
                    }, React.createElement("g", {
                          id: "Group-2",
                          transform: "translate(572.000000, 250.000000)"
                        }, React.createElement("g", {
                              id: "Group-3"
                            }, React.createElement("rect", {
                                  id: "Rectangle-2",
                                  height: "14",
                                  width: "14",
                                  x: "3",
                                  y: "3"
                                }), React.createElement("path", {
                                  id: "Combined-Shape",
                                  d: "M11.8994949,7.89949494 L14.8994949,7.89949494 C16.0040644,7.89949494 16.8994949,8.79492544 16.8994949,9.89949494 C16.8994949,11.0040644 16.0040644,11.8994949 14.8994949,11.8994949 L11.8994949,11.8994949 L11.8994949,14.8994949 C11.8994949,16.0040644 11.0040644,16.8994949 9.89949494,16.8994949 C8.79492544,16.8994949 7.89949494,16.0040644 7.89949494,14.8994949 L7.89949494,11.8994949 L4.89949494,11.8994949 C3.79492544,11.8994949 2.89949494,11.0040644 2.89949494,9.89949494 C2.89949494,8.79492544 3.79492544,7.89949494 4.89949494,7.89949494 L7.89949494,7.89949494 L7.89949494,4.89949494 C7.89949494,3.79492544 8.79492544,2.89949494 9.89949494,2.89949494 C11.0040644,2.89949494 11.8994949,3.79492544 11.8994949,4.89949494 L11.8994949,7.89949494 Z",
                                  transform: "translate(9.899495, 9.899495) rotate(45.000000) translate(-9.899495, -9.899495) "
                                }))))));
}

var Remove = {
  make: Filters$Locations$Remove
};

function Filters$Locations$Button(Props) {
  var param = Props.location;
  var onClick = Props.onClick;
  var id = param.id;
  return React.createElement("button", {
              className: "flex items-center py-1 location-button",
              onClick: (function (param) {
                  return Curry._1(onClick, id);
                })
            }, React.createElement(Filters$Locations$Remove, { }), React.createElement("span", {
                  className: "text-base font-bold ml-2 rounded p-1",
                  style: {
                    backgroundColor: param.primaryColor,
                    color: param.secondaryColor
                  }
                }, param.text));
}

var Button = {
  make: Filters$Locations$Button
};

function Filters$Locations(Props) {
  var allLocations = Props.allLocations;
  var locations = Props.locations;
  var setLocations = Props.setLocations;
  return React.createElement("div", undefined, React.createElement(Filters$H2, {
                  text: "Locations"
                }), Belt_Array.mapU(locations, (function ($$location) {
                    return React.createElement(Filters$Locations$Button, {
                                location: $$location,
                                onClick: (function (removedId) {
                                    return Curry._1(setLocations, (function (locations) {
                                                  return locations.filter((function (id) {
                                                                return id !== removedId;
                                                              }));
                                                }));
                                  }),
                                key: $$location.id
                              });
                  })), React.createElement("div", {
                  className: "pt-1"
                }, React.createElement(ReactSelect.default, {
                      components: {
                        IndicatorSeparator: null
                      },
                      styles: {
                        control: (function (base) {
                            return Object.assign(base, {
                                        color: Colors$ReasonReactExamples.colors.fggray,
                                        fontWeight: "regular",
                                        flex: "1",
                                        width: "130px",
                                        minHeight: "29px",
                                        height: "29px",
                                        fontSize: "14px",
                                        border: 0,
                                        backgroundColor: Colors$ReasonReactExamples.colors.bggray,
                                        borderRadius: "4px"
                                      });
                          }),
                        option: (function (base) {
                            return Object.assign(base, {
                                        fontSize: "14px"
                                      });
                          }),
                        noOptionsMessage: (function (base) {
                            return Object.assign(base, {
                                        fontSize: "14px"
                                      });
                          })
                      },
                      controlShouldRenderValue: false,
                      value: Belt_Array.mapU(locations, (function (param) {
                              return {
                                      value: param.id,
                                      label: param.text
                                    };
                            })),
                      isMulti: true,
                      name: "Locations",
                      options: allLocations,
                      placeholder: "Add location",
                      isClearable: false,
                      onChange: (function (newSelection) {
                          if (newSelection == null) {
                            return Curry._1(setLocations, (function (param) {
                                          return [];
                                        }));
                          } else {
                            return Curry._1(setLocations, (function (param) {
                                          return Belt_Array.mapU(newSelection, (function (param) {
                                                        return param.value;
                                                      }));
                                        }));
                          }
                        }),
                      noOptionsMessage: (function (param) {
                          return "Unknown location";
                        })
                    })));
}

var Locations = {
  Remove: Remove,
  Button: Button,
  make: Filters$Locations
};

function Filters$ThresholdInput(Props) {
  var param = Props.threshold;
  var setThreshold = param[1];
  return React.createElement("div", undefined, React.createElement(Filters$H2, {
                  text: "Threshold (# of cases)"
                }), React.createElement("div", {
                  className: "pt-1"
                }, React.createElement(Filters$Input, {
                      id: "nr_of_cases",
                      value: /* Number */Block.__(1, [param[0]]),
                      onBlur: (function (prim) {
                          return /* () */0;
                        }),
                      onChange: (function (ev) {
                          var value = Pervasives.int_of_string_opt(ev.target.value);
                          return Curry._1(setThreshold, (function (param) {
                                        return value;
                                      }));
                        }),
                      label: "1"
                    })));
}

var ThresholdInput = {
  make: Filters$ThresholdInput
};

var make = React.forwardRef((function (Props, forwardedRef) {
        var valueOpt = Props.value;
        var onClickOpt = Props.onClick;
        var forwardedRef$1 = forwardedRef;
        var value = valueOpt !== undefined ? valueOpt : "";
        var onClick = onClickOpt !== undefined ? onClickOpt : (function (prim) {
              return /* () */0;
            });
        var tmp = {
          className: "bg-bggray text-base border-bggray border date-range-button",
          onClick: onClick
        };
        var tmp$1 = Belt_Option.map((forwardedRef$1 == null) ? undefined : Caml_option.some(forwardedRef$1), (function (prim) {
                return prim;
              }));
        if (tmp$1 !== undefined) {
          tmp.ref = Caml_option.valFromOption(tmp$1);
        }
        return React.createElement("div", {
                    className: "p-1"
                  }, React.createElement("button", tmp, new Date(value).toLocaleDateString()));
      }));

var Button$1 = {
  make: make
};

function Filters$CalendarInput(Props) {
  var param = Props.startDate;
  var param$1 = Props.endDate;
  var reset = Props.reset;
  var setEndDate = param$1[1];
  var endDate = param$1[0];
  var setStartDate = param[1];
  var startDate = param[0];
  var tmp;
  if (reset !== undefined) {
    var reset$1 = reset;
    tmp = React.createElement("button", {
          className: "pt-3 hover:opacity-50 text-activeblue text-base pl-2",
          onClick: (function (param) {
              return Curry._1(reset$1, /* () */0);
            })
        }, "Reset");
  } else {
    tmp = null;
  }
  return React.createElement("div", undefined, React.createElement("div", {
                  className: "flex items-center"
                }, React.createElement(Filters$H2, {
                      text: "Date range"
                    }), tmp), React.createElement("div", {
                  className: "pt-1"
                }, React.createElement(ReactDatepicker.default, {
                      selected: startDate,
                      onChange: (function (newDate) {
                          return Curry._1(setStartDate, (function (param) {
                                        return newDate;
                                      }));
                        }),
                      customInput: React.createElement(make, { }),
                      selectsStart: true,
                      startDate: startDate,
                      endDate: endDate
                    }), React.createElement(ReactDatepicker.default, {
                      selected: endDate,
                      onChange: (function (newDate) {
                          return Curry._1(setEndDate, (function (param) {
                                        return newDate;
                                      }));
                        }),
                      customInput: React.createElement(make, { }),
                      selectsEnd: true,
                      startDate: startDate,
                      endDate: endDate,
                      minDate: startDate
                    })));
}

var CalendarInput = {
  Button: Button$1,
  make: Filters$CalendarInput
};

function Filters(Props) {
  var locations = Props.locations;
  var allLocations = Props.allLocations;
  var setLocations = Props.setLocations;
  var param = Props.scale;
  var param$1 = Props.timeline;
  var param$2 = Props.chartType;
  var threshold = Props.threshold;
  var startDate = Props.startDate;
  var endDate = Props.endDate;
  var resetDates = Props.resetDates;
  var setChartType = param$2[1];
  var chartType = param$2[0];
  var setTimeline = param$1[1];
  var timeline = param$1[0];
  var setScale = param[1];
  return React.createElement("div", {
              className: "w-full md:w-64 p-4"
            }, React.createElement(Filters$H1, {
                  text: "Stay at home"
                }), React.createElement(Filters$P, {
                  text: "Most important charts to help you understand the COVID-19 outlook for your location."
                }), React.createElement(Filters$RadioSection, {
                  text: "Chart type",
                  values: [
                    /* Number */[/* Confirmed */0],
                    /* PercentageGrowthOfCases */0,
                    /* Number */[/* Deaths */1],
                    /* TotalMortalityRate */1
                  ],
                  selectedValue: chartType,
                  format: (function (param) {
                      if (typeof param === "number") {
                        if (param !== 0) {
                          return "Mortality rate";
                        } else {
                          return "% growth of cases";
                        }
                      } else if (param[0]) {
                        return "Number of fatalities";
                      } else {
                        return "Number of cases";
                      }
                    }),
                  onChange: (function (chartType) {
                      return Curry._1(setChartType, (function (param) {
                                    return chartType;
                                  }));
                    })
                }), typeof chartType === "number" ? null : React.createElement(Filters$RadioSection, {
                    text: "Scale",
                    values: [
                      /* Logarithmic */0,
                      /* Linear */1
                    ],
                    selectedValue: param[0],
                    format: (function (param) {
                        if (param) {
                          return "Linear";
                        } else {
                          return "Logarithmic";
                        }
                      }),
                    onChange: (function (scale) {
                        return Curry._1(setScale, (function (param) {
                                      return scale;
                                    }));
                      })
                  }), React.createElement(Filters$Locations, {
                  allLocations: allLocations,
                  locations: locations,
                  setLocations: setLocations
                }), React.createElement(Filters$RadioSection, {
                  text: "Timeline",
                  values: [
                    /* RelativeToThreshold */0,
                    /* CalendarDates */1
                  ],
                  selectedValue: timeline,
                  format: (function (param) {
                      if (param) {
                        return "Calendar dates";
                      } else {
                        return "Relative to threshold";
                      }
                    }),
                  onChange: (function (timeline) {
                      return Curry._1(setTimeline, (function (param) {
                                    return timeline;
                                  }));
                    })
                }), timeline ? React.createElement(Filters$CalendarInput, {
                    startDate: startDate,
                    endDate: endDate,
                    reset: resetDates
                  }) : React.createElement(Filters$ThresholdInput, {
                    threshold: threshold
                  }), React.createElement(Filters$Footer, { }));
}

var make$1 = Filters;

exports.Input = Input;
exports.H1 = H1;
exports.H2 = H2;
exports.P = P;
exports.Footer = Footer;
exports.MultiValueContainer = MultiValueContainer;
exports.Radio = Radio;
exports.RadioSection = RadioSection;
exports.Locations = Locations;
exports.ThresholdInput = ThresholdInput;
exports.CalendarInput = CalendarInput;
exports.make = make$1;
/* make Not a pure module */
