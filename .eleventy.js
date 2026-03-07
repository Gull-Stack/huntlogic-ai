module.exports = function(eleventyConfig) {
  // Pass through static assets
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");

  // Date filter for sitemap
  eleventyConfig.addFilter("dateToISO", (date) => {
    return new Date(date).toISOString();
  });

  // Create collections for services and areas if needed
  eleventyConfig.addCollection("services", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/services/*.njk");
  });

  eleventyConfig.addCollection("guides", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/guides/**/*.njk");
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html", "11ty.js", "json", "txt"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
