const { transformFileSync } = require("@babel/core");
const insertParametersPlugin = require("./track.js");
const path = require("path");
const fs = require("fs");

const { code } = transformFileSync(path.join(__dirname, "./test.js"), {
  plugins: [[insertParametersPlugin, { trackerPath: "tracker" }]],
  parserOpts: {
    sourceType: "module"
  },
});

fs.writeFileSync(path.join(__dirname, "./new.js"), code);
