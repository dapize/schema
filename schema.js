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
      if (response.hasOwnProperty(property)) {
        // Data from response
        const valPropObj = response[property];
        const getTypeValObj = getType(valPropObj);

        // Data form schema
        const valPropSchema = schema[property];
        const getTypeValSchema = getType(valPropSchema);

        switch (getTypeValSchema) {
          case 'string': // dont exists 'required', obiusly.
            console.log('es string');
            // can be: 'string', 'number', 'boolean' or 'array' but never 'object' (because a object can't be declare of simple way).
            if (valPropSchema === 'object') { // * bad 'schema structure' builded (by frontEnd developer).
              reg(_this.errors, null, 'Is not possible set the type "object" in "simple way".')
              retorno = false;
            } else {
              if (valPropSchema !== getTypeValObj) {
                reg(_this.different, property, {
                  current: getTypeValObj,
                  expected: valPropSchema,
                  value: valPropObj
                });
              }
            }
            break;

          case 'array': 
            console.log('es array');
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
            console.log('es objecto');
            if (!valPropSchema.hasOwnProperty('type')) { // * missing important property. If is object, have to exists the 'type' property. Error of frontEnd developer.
              reg(_this.errors, null, 'Is the value of a property is a object have to create the property "type".')
              retorno = false;
            } else {
              if (getTypeValObj === 'object') {
                if (!valPropObj.hasOwnProperty('properties')) { // * missing important property. If is object, have to exists the 'properties' property.
                  if (valPropSchema.required) retorno = false;
                } else {
                  reg(_this.errors, null, 'Dont exists the property "properties" in the object.');
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
            console.log('es mixed');
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