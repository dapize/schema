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
  if (!obj) return console.log('Object missing ', obj);
  this.schema = Object.assign({}, obj);
  uSchema.initValues(this);
};