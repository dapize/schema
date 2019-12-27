(function (root) {
  'use strict';

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
   * Lista de tipos de formato de variables
   */
  const typesAccepted = ['string', 'number', 'boolean', 'array', 'object'];

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
        const typeOfVal = typeof value;
        if (typeOfVal === 'string') {
          retorno = (typesAccepted.indexOf(value) === -1) ? typeOfVal : value;
        } else {
          retorno = typeOfVal
        }

      }
    }
    return retorno;
  };

  /**
   * Registra incidentes dentro de un objeto, para que sirva de log.
   * @param {Array|Object} target Lista y objeto destino.
   * @param {String} propName Nombre de la propiedad a crear dentro del objeto.
   * @param {Object} data Objeto que contendrá información de la propiedad faltante.
   * @returns {Boolean} Registro exitoso: true. Intento de registro duplicado: false
   */
  const reg = function (target, propName, data, self) {
    let retorno = false;
    if (Array.isArray(target)) {
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
  const mergeProps = function (objTarget, schema, parentProp) {
    // MISSINGS AND ERRORS
    let itemReg;
    ['missings', 'errors'].forEach(function (nameReg) {
      itemReg = schema[nameReg];
      if (itemReg.length) objTarget[nameReg] = objTarget[nameReg].concat(itemReg);
    });
    // DIFFERENT AND COMPILED
    let currentSchema;
    ['different', 'compiled'].forEach(function (objName) {
      currentSchema = schema[objName];
      if (Object.keys(currentSchema).length) {
        if (!objTarget[objName].hasOwnProperty(parentProp)) objTarget[objName][parentProp] = {};
        objTarget[objName][parentProp] = currentSchema;
      };
    });
  };


  
  // CONSTRUCTOR
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
              console.log('false 1');
            } else {
              if (getTypeValObj !== 'string') {
                reg(_this.different, property, {
                  current: getTypeValObj,
                  expected: 'string',
                  value: valPropObj
                });
              } else {
                reg(_this.compiled, property, valPropObj)
              }
            }
            break;

          case 'array':
            if (getTypeValSchema !== getTypeValObj) {
              if (valPropSchema.required) {
                retorno = false;
                console.log('false 2');
              }
              reg(_this.different, property, {
                current: getTypeValObj,
                expected: 'array',
                value: valPropObj
              });
            } else {
              reg(_this.compiled, property, valPropObj)
            }
            break;
          
          case 'object':
            if (!valPropSchema.hasOwnProperty('type')) { // * missing important property. If is object, have to exists the 'type' property. Error of frontEnd developer.
              reg(_this.errors, null, 'Is the value of a property is a object have to create the property "type".')
              retorno = false;
              console.log('false 3');
            } else {
              if (getTypeValObj === 'object') {
                if (!valPropSchema.hasOwnProperty('properties')) { // * missing important property. If is object, have to exists the 'properties' property.
                  reg(_this.errors, null, 'Dont exists the property "properties" in the object.');
                  if (valPropSchema.required) {
                    retorno = false;
                    console.log('false 4');
                  }
                } else {
                  const propertiesSchema = new Schema(valPropSchema.properties);
                  if (!propertiesSchema.validate(valPropObj)) {
                    retorno = false;
                    console.log('false 5: ' + property);
                  }
                  mergeProps(_this, propertiesSchema, property);
                }
              } else {
                if (valPropSchema.required) {
                  retorno = false;
                  console.log('false 6');
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
              console.log('false 7');
            } else {
              const typesValid = typesList.filter(function (type) {
                return type === getTypeValObj;
              });
              // no body match with any types items.
              if (!typesValid.length && valPropSchema.required) { 
                retorno = false;
                console.log('false 8');
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
        if (valPropSchema.required) {
          retorno = false;
          reg(_this.missings.required, null, property);
        } else {
          reg(_this.missings.optional, null, property);
        }
        console.log('suerte: ', _this);
        if (valPropSchema.default) _this.compiled[property] = valPropSchema.default;
      }
    });

    // Returning
    return retorno;
  };

  proto.compile = function () {
    return this.compiled;
  };

  proto.extend = function () {
  };

  // EXPORTING
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      module.exports = Schema;
    }
    exports.Schema = Schema;
  } else {
    root.Schema = Schema;
  }
}(window));