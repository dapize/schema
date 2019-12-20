(function (root) {

  // TYPES OF VALUE
  /*
    - String: 'string'
    - Number: 'number
    - Boolean: 'boolean'
    - Object: 'object'
    - Array: 'array'
  */
  

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

  /**
   * Verifica la existencia de una propiedad en un objeto determinado
   * Si la propiedad no existe, se guarda en un array llamado 'missings'
   * @param {Object} obj Objeto donde verificar la existencia de la propiedad
   * @param {String} property Nombre de la propiedad a verificar su existencia
   * @returns {Boolean}
   */
  const existsProp = function (obj, property, propParent) {
    const parent = propParent === undefined ? '' : propParent + '.';
    let exists = true;
    if (!obj.hasOwnProperty(property)) {
      exists = false;
      this.missings.push(parent + property);
    }
    return exists;
  }


  // CONSTRUCTOR
  function Schema (obj) {
    this.schema = Object.assign({}, obj);
    //this.
    this.missings = [];
    this.different = [];
  };

  // PROTO
  const proto = Schema.prototype;

  // METHODS AND PROPERTIES
  proto.validate = function (response) {
    const schema = this.schema,
          _this = this;
    let retorno = true; // ¿Is valid?

    Object.keys(schema).forEach(function (property) {
      if (existsProp.call(_this, response, property)) {
        const valPropObj = response[property];
        const getTypeValObj = getType(valPropObj);

        // cheking if can be multiples types (a array of types)
        const valPropSchema = schema[property];
        const getTypeValSchema = getType(valPropSchema); // getting the type from the value not from the property 'type'

        switch (getTypeValSchema) {
          case 'string': // dont exists 'required', obiusly.
            // can be: 'string', 'number', 'boolean' or 'array' but never 'object' (because a object can't be declare of simple way).
            if (valPropSchema === 'object') { // * bad 'schema structure' designed (by back developer).
              retorno = false;
            } else {
              if (valPropSchema !== getTypeValObj) {
                _this.different.push({
                  name: property,
                  current: getTypeValObj,
                  expected: valPropSchema,
                  value: valPropObj
                });
              }
            }
            break;

          case 'array': // is multi type and can be 'required', obiusly again.
            console.log('es un array');
            const typesValid = valPropSchema.filter(function (type) {
              return type === getTypeValObj;
            });
            // no body match with any types items.
            if (!typesValid.length && valPropObj.required) { // ... just if is required
              retorno = false;
              _this.different.push(valPropObj);
            }
            break;
          
          case 'object':
            console.log('es un objeto');
            if (!existsProp(valPropSchema, 'type')) { // * missing important property. If is object, have to exists the 'type' property.
              retorno = false;
            } else {
              console.log('getTypeValObj ', getTypeValObj);
              if (getTypeValObj !== 'object' && valPropSchema.required) {
                retorno = false;
                _this.different.push({
                  name: property,
                  current: getTypeValObj,
                  expected: 'object',
                  value: valPropObj
                });
              }
            }
            break;
        }
      }
    });

    // Missings
    if (this.missings.length) retorno = false;

    // Returning
    return retorno;
  };

  proto.extend = function () {
  };

  proto.compile = function () {
  };

  // EXPORTING
  root.Schema = Schema;

}(window));