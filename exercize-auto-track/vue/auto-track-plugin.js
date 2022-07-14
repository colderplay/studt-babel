const { declare } = require("@babel/helper-plugin-utils");

const autoTrack = declare(({ template }, option, dirname) => {
  return {
    visitor: {
      ObjectMethod(path, state) {
        if (path.isTracked) {
          path.stop();
          return
        }
        const namePath = path.get("key");
        let funName = namePath.node.name;
        let n = funName.slice(funName.length - option.sliceNum);
        if (
          funName.slice(funName.length - option.sliceNum) === option.trackName
        ) {
          path.isTracked = true;
          path.node.body.body.unshift(template.expression(`this.$track()`)());
          path.skip();
        }
      },
    },
  };
});

module.exports = autoTrack;
