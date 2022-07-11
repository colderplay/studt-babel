const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const template=require('@babel/template')
const types = require("@babel/types");
const fs = require("fs");
const path = require("path");
const sourceCode = fs.readFileSync(path.join(__dirname, "./sourceCode.js"), {
  encoding: "utf-8",
});

const ast = parser.parse(sourceCode, {
  sourceType: "unambiguous",
  plugins: ["jsx"],
});

const targentList = ["log", "info", "error", "debug"].map(
  (item) => `console.${item}`
);
traverse(ast, {
  CallExpression(path, state) {
    const calleeName = generator(path.node.callee).code;
    if (targentList.includes(calleeName)) {
      const { line, column } = path.node.loc.start;
      path.node.arguments.unshift(
        types.stringLiteral(`filename: (${line}, ${column})`)
      );
    }
  },
});

const { code, map } = generator(ast);

// console.log(code);
