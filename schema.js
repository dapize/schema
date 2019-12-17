(function (root) {

  // UTILS

  /**
   * Verifica si el objeto pasado es un objeto literal.
   * @param {Object} obj Objeto a verificar
   * @returns {Boolean}
   */
  const objLiteral = function (obj) {
    return Object.prototype.toString.call(obj).toLowerCase() === '[object object]'
  };

  /**
   * Obtiene el tipo del valor pasado.
   * @param {Object|String} value El string y objecto que contiene el valor del objeto
   * @return {String}
   */
  const getType = function (value) {
    let retorno;
    if (Array.isArray(value)) {
      retorno = 'array';
    } else {
      retorno = objLiteral(value) ? 'object' : typeof value;
    }
    return retorno;
  };


  // CONSTRUCTOR
  function Schema (obj) {
    const _this = this;
    Object.keys(obj).forEach(function (property) {
      _this[property] = obj[property];
    });
  };

  // METHODS AND PROPERTIES
  Schema.prototype.validate = function (obj) {
    const _this = this;
    let retorno = true; // ¿Is valid?

    Object.keys(_this).forEach(function (property) {
      // if dont exits the property in the response...
      if (!obj.hasOwnProperty(property)) {
        if (_this[property].required) { // ... dont exits but is not required, ¡continuous!
          _this.missings.push(property);
        }
      } else {
        const valPropertyObj = obj[property];
        const getTypeObj = getType(valPropertyObj);
        // cheking if can be multiples types (a array of types)
        const valPropertySchema = _this[property];
        const getTypeSchema = getType(valPropertySchema);
        if (getTypeSchema === 'array') {
          const typesValid = valPropertySchema.filter(function (type) {
            return type === getTypeObj;
          });
          // no body match with any types items.
          if (!typesValid.length && valPropertyObj.required) { // ... just if is required
            retorno = false;
            _this.different.push(valPropertyObj);
          }
        } else {
          // is different type and is required this property
          if (getTypeObj !== getTypeSchema && valPropertyObj.required) {
            retorno = false;
            _this.different.push(valPropertyObj);
          } else {
            // is the same type property obj of type property schema
            // TODO: me quedé ACA, continuar trabajando desde aquí.
          }
        }
      }
    });

    // Missings
    if (_this.missings.length) retorno = false;

    // Returning
    return retorno;
  };

  Schema.prototype.extend = function () {
  };

  Schema.prototype.missings = [];
  Schema.prototype.different = [];

  // EXPORTING
  root.Schema = Schema;

}(window));