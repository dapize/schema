/**
 * Utilidades varias
 * @namespace uSchema
 * @property {Array} typesAccepted Lista de tipos aceptados para ser procesados.
 */
const uSchema = {
  /**
   * Setea los valores por defecto del constructor
   * @param {Function} _this Constructor
   */
  initValues: function (_this) {
    _this.missings = {
      required: [],
      optional: []
    };
    _this.different = {};
    _this.errors = [];
    _this.compiled = {};
  },

  /**
   * Verifica si lo pasado es un objeto literal o no
   * @memberof uSchema
   * @param {Object} obj Objeto a ser verificado
   * @returns {Boolean}
   * @example
   * uSchema.objLiteral({});
   * => true
   * @example
   * uSchema.objLiteral('obj');
   * => false
   */
  objLiteral: function (obj) {
    return Object.prototype.toString.call(obj).toLowerCase() === '[object object]'
  },

  typesAccepted: ['string', 'number', 'boolean', 'array', 'object'],

  /**
   * Devuelve el tipo de dato de una propiedad en un ojeto
   * @memberof uSchema
   * @namespace getType
   */
  getType: {
    /**
     * Devuelve el tipo de dato de una propiedad de un objeto comun y corriente.
     * @memberof uSchema.getType
     * @param {*} value Valor de la propiedad del objeto a obtener su tipo.
     * @returns {String} 'string', 'number', 'boolean', 'array' u 'object
     */
    obj: function (value) {
      return Array.isArray(value) ? 'array' : typeof value;
    },

    /**
     * Devuelve el tipo de dato de una propiedad de un objeto schema.
     * @memberof uSchema.getType
     * @param {*} value Valor de la propiedad del objeto a obtener su tipo.
     * @returns {String} 'string', 'number', 'boolean', 'array' u 'object
     */
    schema: function (value) {
      let retorno;
      if (Array.isArray(value)) {
        retorno = 'mixed';
      } else {
        if (uSchema.objLiteral(value)) {
          retorno = value.hasOwnProperty('type') ? this.schema(value.type) : 'object';
        } else {
          const typeOfVal = typeof value;
          if (typeOfVal === 'string') {
            retorno = (uSchema.typesAccepted.indexOf(value) !== -1) ? value : typeOfVal;
          } else {
            retorno = typeOfVal
          }
        }
      }
      return retorno;
    }
  },

  /**
   * Registra incidentes dentro de un objeto, para que sirva de log o para el compilado.
   * @memberof uSchema
   * @param {Array|Object} target Lista y objeto destino.
   * @param {Object|String} data Objeto que contendrá información de la propiedad faltante o tambien el string que será agregado al array.
   * @param {String=} propName Nombre de la propiedad a crear dentro del objeto.
   * @returns {Boolean} Registro exitoso: true. Intento de registro duplicado: false
   */
  reg: function (target, data, propName) {
    let retorno = false;
    if (propName) { // if exists this argument the target is a 'object'...
      if (!target.hasOwnProperty(propName)) {
        target[propName] = data;
        retorno = true;
      }
    } else { // ... is not is a 'array'
      target.push(data);
      retorno = true;
    }
    return retorno;
  },

  /**
   * Realiza un merge de los registros obtenidos por el tratado de un subschema.
   * @memberof uSchema
   * @param {Object} target Objeto destino en donde se realizará el merge de las propiedades.
   * @param {Object} schema Objeto que contiene los registros (missings, errors, different)
   * @param {String} parentProp Nombre de la propiedad padre de los registros
   * @returns {Object}
   */
  mergeProps: function (target, schema, parentProp) {
    // ERRORS
    const itemReg = schema.errors;
    if (itemReg.length) target.errors = target.errors.concat(itemReg);
    
    // MISSINGS
    let missing;
    ['required', 'optional'].forEach(function (item) {
      missing = schema.missings[item];
      if (missing.length) target.missings[item] = target.missings[item].concat(missing);
    });
    
    // DIFFERENT AND COMPILED
    let currentSchema;
    ['different', 'compiled'].forEach(function (objName) {
      currentSchema = schema[objName];
      if (Object.keys(currentSchema).length) {
        if (!target[objName].hasOwnProperty(parentProp)) target[objName][parentProp] = {};
        target[objName][parentProp] = currentSchema;
      };
    });
  }
};