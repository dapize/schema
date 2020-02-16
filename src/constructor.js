/**
 * Constructor del schema.
 * @constructor
 * @param {Object} obj Configuraciones iniciales del schema
 * @example
 * const mySchema = {
 *  name: 'string',
 *  age: 'number',
 *  email: {
 *    type: 'string',
 *    required: true
 *  }
 * }
 * const card = new Schema(schema);
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