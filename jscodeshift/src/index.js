const jf = require("jscodeshift");
const fs = require("fs");

fs.readFile("./example.js", { encoding: "utf-8" }, function (err, res) {
  if (err) return;
  const root = jf(res);
 root.find(jf.Program).forEach((item) => {
    item.node.body.unshift(
      jf(`import _tracker2 from "tracker"`).find(jf.ImportDeclaration).__paths[0].value
    );
  });
//   console.log(root.toSource());
  const ast = root.find(jf.FunctionExpression);
  ast.find(jf.ExpressionStatement).forEach((path) => {
    //    console.log(path);
    jf(path).insertAfter(`console.log('新加入一个名字')`);

    fs.writeFile("./example.js", root.toSource(), function (err) {
      if (err) {
        console.log(err);
      }
    });
  });
});

// console.log(root.toSource());
