var colors = require("./src/Colors.bs.js");

module.exports = {
  theme: {
    ...colors,
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    borderWidth: {
      default: '1px',
      '0': '0',
      '2': '2px',
      '4': '4px',
    },
    fontSize: {
      sm: '12px',
      base: '14px',
      md: '16px',
      big: '20px',
    },
    maxHeight: {
     '0': '0',
     '1/4': '25%',
     '1/2': '50%',
     '3/4': '75%',
     'full': '100%',
     '600': '600px',
     'screen': '100vh',
    },
    minHeight: {
     '0': '0',
     '1/4': '25%',
     '1/2': '50%',
     '3/4': '75%',
     'full': '100%',
     '400': '400px',
     'screen': '100vh',
    }
  }
}
