const track = function ({ types, template }) {
  return {
    visitor: {
      Program: {
        enter(path, state) {
          path.traverse({
            "StringLiteral|TemplateLiteral"(path, state) {
              const newPath = path.node;
              const leadComArr = newPath.leadingComments;
              if (leadComArr && leadComArr.length) {
                for (let i = 0; i < leadComArr.length; i++) {
                  if (leadComArr[i].value.includes("i18n-disable")) {
                    newPath.skipTransform = true;
                    path.skip();
                    return;
                  }
                }
              }
            },
          });
        },
      },
      StringLiteral(path, state) {
        if (path.node.skipTransform) {
          return;
        }
        const value = path.node.value;
        const newNode = template.expression(`this.$init('${value}')`)();

        path.replaceWith(newNode);
        path.skip();
      },
    },
  };
};

module.exports = track;
