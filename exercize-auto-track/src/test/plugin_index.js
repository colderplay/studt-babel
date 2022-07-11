const parametersInsertPlugin = require("./plugin_insetBefore");
const { transformFileSync } = require("@babel/core");
const path = require("path");
const { code } = transformFileSync(path.join(__dirname, './sourceCode.js'), {
    plugins: [parametersInsertPlugin],
    parserOpts: {
        sourceType: 'unambiguous',
        plugins: ['jsx']       
    }
});

console.log(code);