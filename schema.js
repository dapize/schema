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
      if (objLiteral(value)) {
        if (value.hasOwnProperty('type')) {
          retorno = Array.isArray(value.type) ? 'mixed' : value.type
        } else {
          retorno = 'object';
        }
      } else {
        retorno = typeof value;
      }
    }
    return retorno;
  };

  /**
   * Registra incidentes dentro de un objeto, para que sirva de log.
   * @param {String} propName Nombre de la propiedad a crear dentro del objeto.
   * @param {Object} data Objeto que contendrá información de la propiedad faltante.
   * @param {Object} objTarget Objeto destino en donde se crearán los registros.
   * @returns {Boolean} Registro exitoso: true. Intento de registro duplicado: false
   */
  const reg = function (target, propName, data) {
    let retorno = false;
    if (Array.isArray(target)) { // reg in list. (Errors)
      target.push(data);
      retorno = true;
    } else {
      if (!target.hasOwnProperty(propName)) {
        target[propName] = data;
        retorno = true;
      }
    }
    return retorno;
  };

  /**
   * Realiza un merge de los registros obtenidos de por el tratado de un subschema.
   * @param {Object} objTarget Objeto destino en donde se realizará el merge de las propiedades.
   * @param {Object} schema Objeto que contiene los registros (missings, errors, different)
   * @param {String} parentProp Nombre de la propiedad padre de los registros
   * @returns {Object}
   */
  const mergeRegisters = function (objTarget, schema, parentProp) {
    let itemReg;
    ['missings', 'errors'].forEach(function (nameReg) {
      itemReg = schema[nameReg];
      if (itemReg.length) objTarget[nameReg] = objTarget[nameReg].concat(itemReg);
    });
    const schemaDifferent = schema.different;
    if (Object.keys(schemaDifferent).length) {
      if (!objTarget.different.hasOwnProperty(parentProp)) objTarget.different[parentProp] = {};
      objTarget.different[parentProp] = schemaDifferent;
    }
  };

  
  // CONSTRUCTOR
  function Schema (obj) {
    this.schema = Object.assign({}, obj);
    this.missings = [];
    this.different = {};
    this.errors = [];
  };

  // PROTO
  const proto = Schema.prototype;

  // METHODS AND PROPERTIES
  proto.validate = function (response) {
    const schema = this.schema,
          _this = this;
    let retorno = true; // by default, is valid :)

    Object.keys(schema).forEach(function (property) {
      // Data form schema
      const valPropSchema = schema[property];
      const getTypeValSchema = getType(valPropSchema);

      if (response.hasOwnProperty(property)) {
        // Data from response
        const valPropObj = response[property];
        const getTypeValObj = getType(valPropObj);

        switch (getTypeValSchema) {          
          case 'string': // dont exists 'required', obiusly.
            // can be: 'string', 'number', 'boolean' or 'array' but never 'object' (because a object can't be declare of simple way).
            if (valPropSchema === 'object') { // * bad 'schema structure' builded (by frontEnd developer).
              reg(_this.errors, null, 'Is not possible set the type "object" in "simple way".')
              retorno = false;
            } else {
              if (getTypeValObj !== 'string') {
                reg(_this.different, property, {
                  current: getTypeValObj,
                  expected: 'string',
                  value: valPropObj
                });
              }
            }
            break;

          case 'array':
            if (valPropSchema !== getTypeValObj) {
              if (valPropSchema.required) retorno = false;
              reg(_this.different, property, {
                current: getTypeValObj,
                expected: 'array',
                value: valPropObj
              });
            };
            break;
          
          case 'object':
            if (!valPropSchema.hasOwnProperty('type')) { // * missing important property. If is object, have to exists the 'type' property. Error of frontEnd developer.
              reg(_this.errors, null, 'Is the value of a property is a object have to create the property "type".')
              retorno = false;
            } else {
              if (getTypeValObj === 'object') {
                if (!valPropSchema.hasOwnProperty('properties')) { // * missing important property. If is object, have to exists the 'properties' property.
                  reg(_this.errors, null, 'Dont exists the property "properties" in the object.');
                  if (valPropSchema.required) retorno = false;
                } else {
                  const propertiesSchema = new Schema(valPropSchema.properties);
                  if (!propertiesSchema.validate(valPropObj)) retorno = false;
                  mergeRegisters(_this, propertiesSchema, property);
                }
              } else {
                if (valPropSchema.required) {
                  retorno = false;
                  reg(_this.different, property,{
                    current: getTypeValObj,
                    expected: getTypeValSchema,
                    value: valPropObj
                  });
                }
              }
            }
            break;
          
          case 'mixed':
            const typesList = valPropSchema.type;
            if (typesList.indexOf('object') !== -1) { // a type 'object' can be declare in 'simple way' nor in a 'multi types' way.
              reg(_this.errors, null, 'Is not possible set the type "object" in a property of mixed types.');
              retorno = false;
            } else {
              const typesValid = typesList.filter(function (type) {
                return type === getTypeValObj;
              });
              // no body match with any types items.
              if (!typesValid.length && valPropSchema.required) { 
                retorno = false;
                reg(_this.different, property, {
                  current: getTypeValObj,
                  expected: typesList,
                  value: valPropObj
                });
              }
            }
            break;

          default:
            console.log('es cualquiera otra cosa');
        }
      } else {
        reg(_this.missings, null, 'Dont exist the variable "' + property + '" in the object');
        if (valPropSchema.required) retorno = false;
      }
    });

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