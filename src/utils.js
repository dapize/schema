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
const reg = function (target, propName, data) {
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
  // ERRORS
  const itemReg = schema.errors;
  if (itemReg.length) objTarget.errors = objTarget.errors.concat(itemReg);
  
  // MISSINGS
  let missing;
  ['required', 'optional'].forEach(function (item) {
    missing = schema.missings[item];
    if (missing.length) objTarget.missings[item] = objTarget.missings[item].concat(missing);
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