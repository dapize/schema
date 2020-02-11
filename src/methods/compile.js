/**
 * Se obtiene el objeto compilado, el que a pasado por el schema
 * con las variables por defecto fusionadas.
 */
Schema.prototype.compile = function () {
  return this.missings.required.length ? false : this.compiled;
};