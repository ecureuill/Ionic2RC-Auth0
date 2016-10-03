// https://www.npmjs.com/package/node-sass

module.exports = {
  /**
   * variableSassFiles: Lists out the files which include
   * only sass variables. These variables are the first sass files
   * to be imported so their values override default variables.
   */
  variableSassFiles: [
    '{{SRC}}/theme/variables.scss',
    '{{SRC}}/theme/global.scss' // workadound problem #8307
  ]
};