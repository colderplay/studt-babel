const importModule = require('@babel/helper-module-imports');
module.exports = function ({ types, template }) {
  return {
    visitor: {
        Program:{
          enter(path,state){
            path.traverse({
                ImportDeclaration(curPath){
                    const requirePath = curPath.get('source').node.value;
                    const tarckName=state.opts.trackerPath
                    if (requirePath===tarckName) {
                        const specifierPath = curPath.get('specifiers.0');
                        if (specifierPath.isImportSpecifier()) { 
                            state.trackerImportId = specifierPath.toString();
                        } else if(specifierPath.isImportNamespaceSpecifier()) {
                            state.trackerImportId = specifierPath.get('local').toString();// tracker 模块的 id
                        }
                        curPath.stop();// 找到了就终止遍历
                    }
                }
            })
            if (!state.trackerImportId) {
                state.trackerImportId  = importModule.addDefault(path, '@/utils/track',{
                    nameHint: path.scope.generateUid('tracker')
                }).name; // tracker 模块的 id
            }
        }
        },
       'FunctionDeclaration|ArrowFunctionExpression|FunctionExpression|VariableDeclarator'(path, state) {
        const newNode = template.expression(
          `${state.trackerImportId}()`
        )();
        if (path.node.id && path.node.id.name.slice(0,4) === "name") {
            path.node.body &&  path.node.body.body.unshift(newNode);
            path.node.init &&  path.node.init.body.body.unshift(newNode);

        }
      },
    },
  };
};
