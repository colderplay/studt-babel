const { transformFileSync } = require("@babel/core");
const track = require("./track");
const path = require("path");
const fs = require("fs");
const { code } = transformFileSync(path.join(__dirname, "./test.js"), {
  plugins: [[track]],
});

fs.writeFileSync(path.join(__dirname, "./new.js"), code);
