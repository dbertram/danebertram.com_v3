const eleventySass = require('eleventy-sass')

module.exports = function (eleventyConfig) {
    eleventyConfig.addPlugin(eleventySass)

    eleventyConfig.addPassthroughCopy("favicon.ico")
    eleventyConfig.addPassthroughCopy("images/*")
}
