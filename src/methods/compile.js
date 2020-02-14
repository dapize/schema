/**
 * Fusiona el objeto pasado con el schema creado
 * @param {Object} [obj] Objeto que se necesita compilar con el squema creado.
 * @returns {Object} El objeto fusionado con los valores por defecto en el esquema (si es que existen claro).
 */
Schema.prototype.compile = function (obj) {
  if (obj) this.validate(obj);
  return this.missings.required.length ? false : this.compiled;
};