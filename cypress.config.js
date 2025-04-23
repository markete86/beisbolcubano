const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.beisbolcubano.cu/', // URL base
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
