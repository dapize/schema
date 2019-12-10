(function (root) {
  if (!root.Smart) root.Smart = {};

  // Utils
  /**
   * 
   * @param {Object} obj Objeto a separar
   * @param {string} type Tipo de separación 'pura', '
   */
  const splitObj = function (obj, type) {
    const excluded = ['type', 'default', 'required'];
    const pure = {};

    Object.keys(obj).forEach(function (keyname) {
      if (excluded.indexOf(keyname) === -1) {
        
      } else {

      }
      container[keyname] = obj[keyname];
    });
  }

  function Checker (schema, obj) {
    this.schema = schema;
    this.obj = obj;
  }; 

  Checker.prototype.missing = [];
  Checker.prototype.different = [];

  /**
   * Verifica si en el objeto 1 existen las propiedades del objeto 2.
   * @param {Object} obj1 Objeto a comprobar
   * @param {Object} obj2 Objeto base de donde comprobar
   * @returns {Boolean}
   */
  Checker.prototype.equal = function () {
    const objSchema = this.schema;
    const keysSchema = Object.keys(objSchema);
    const obj = this.obj;
    
    // checking by exists keys
    const isLiteral = this.objLiteral;
    const different = [];
    const missing = [];
    let currentObj;
    keysSchema.forEach(function (keyname) {
      currentObj = objSchema[keyname];
      if (obj.hasOwnProperty(keyname)) {
        if (isLiteral(currentObj)) {
          currentObj = currentObj.type;
        }
        if (currentObj !== obj[keyname].constructor) {
          different.push(keyname);
        }
      } else {
        if (isLiteral(currentObj) && currentObj.required) {
          missing.push(keyname);
        }
      }
    });

    if (missing.length) {
      this.missing = missing;
      return false;
    }

    if (different.length) {
      this.different = different;
      return false;
    }

    return true;
  };

  /**
   * Verifica si el objeto pasado es un objeto literal.
   * @param {Object} obj Objeto a verificar
   * @returns {Boolean}
   */
  Checker.prototype.objLiteral = function (obj) {
    return Object.prototype.toString.call(obj).toLowerCase() === '[object object]'
  };

  root.Smart.schema = function (schema, response) {
    if (typeof response === 'string') response = JSON.parse(response);
    return new Checker(schema, response);
  };
}(window));