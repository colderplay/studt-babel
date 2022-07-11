const j = require("jscodeshift");
const value = `
import { ConstantsForTrack } from 'an-npm-package-containing-constants'
`;
const root = j(value);

const trackConstantsImportDeclarations = root.find(j.ImportDeclaration, {
  source: { value: "an-npm-package-containing-constants" },
});

console.log(trackConstantsImportDeclarations.length);
if (!trackConstantsImportDeclarations.length) {
  // 返回 undefined 表示此文件无需修改
  console.log("没有文件");
  return;
}
