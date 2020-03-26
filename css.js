const fs = require('fs');
const path = require.resolve("react-datepicker/dist/react-datepicker.min.css");
const css = fs.readFileSync(path, 'utf8');
fs.appendFileSync(process.argv[2], css);
