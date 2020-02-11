/**
 * Constructor del schema.
 * @constructor
 * @param {Object} obj Configuraciones iniciales del schema
 */
function Schema (obj) {
  this.schema = Object.assign({}, obj);
  this.missings = {
    required: [],
    optional: []
  };
  this.different = {};
  this.errors = [];
  this.compiled = {};
};