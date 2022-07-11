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
    if (path.node.isNew) {
        return;
    }
    const calleeName = generator(path.node.callee).code;
    if (targentList.includes(calleeName)) {
      const { line, column } = path.node.loc.start;
      const newNode=template.expression(`console.log("filename: (${line}, ${column})")`)()
      newNode.isNew = true;
      if (path.findParent(path => path.isJSXElement())) {
        path.replaceWith(types.arrayExpression([newNode, path.node]))
        path.skip();// 跳过子节点处理
      }else{
        path.insertBefore(newNode);
      }
    }
  },
});

const { code, map } = generator(ast);

console.log(code);
