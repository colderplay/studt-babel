const { transformFromAstSync } = require("@babel/core");
const path = require("path");
const glob = require("glob");
const { parse } = require("@vue/compiler-sfc");
const { readFileSync, writeFileSync, writeFile } = require("fs");
const autoTrack = require("./auto-track-plugin.js");
const babelParse = require("./parse");
const files = glob.sync("pages/*.vue");

function genter(ast) {
  let str = "";
  const { template, script } = ast;
  str = `<${template.type}>` + template.content + `</${template.type}>` + "\n";
  str +=
    `<${script.type}>` + "\n" + script.content + "\n" + `</${script.type}>`;
  return str;
}

files.forEach((file) => {
  let sourceCode = readFileSync(path.join(__dirname, file), {
    encoding: "utf-8",
  });
  let descriptor = parse(sourceCode);
  const ast = babelParse(descriptor.descriptor.script.content, {
    sourceType: "unambiguous",
    plugins: ["jsx"],
  });

  const { code } = transformFromAstSync(
    ast,
    descriptor.descriptor.script.content,
    {
      plugins: [
        [
          autoTrack,
          {
            trackName: "_$track",
            sliceNum: 7,
          },
        ],
      ],
    }
  );
  descriptor.descriptor.script.content = code;
  const newCode = genter(descriptor.descriptor);
  writeFile(path.join(__dirname, file), newCode, function (err, suc) {
    console.log(suc);
  });
});
