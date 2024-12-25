const path = require("path");

module.exports = {
  entry: {
    AutoScroll: "./src/components/AutoScroll/content.js",
    LinkNavigator: "./src/components/LinkNavigator/content.js",
    OpenResponseGenerator: "./src/components/OpenResponseGenerator/content.js",
    ProfileSaver: "./src/components/ProfileSaver/content.js",
    SkoolSideKick: "./src/components/SkoolSideKick/content.js",
    SmartLinkSaver: "./src/components/SmartLinkSaver/content.js",
},
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].content.js",
  },
  mode: "production",
};
