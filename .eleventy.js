module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("favicon.ico")
  eleventyConfig.addPassthroughCopy("images/*")
  eleventyConfig.addPassthroughCopy("css/*.css")
}
