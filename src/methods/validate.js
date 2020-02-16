/**
 * Valida si un objeto cumple con el schema designado.
 * @param {Object} response Objeto que comunmente se obtiene de un 'response' en una solicitud ajax
 * @returns {Boolean} Indica si el objeto pasado es válido o no con el schema.
 */
Schema.prototype.validate = function (response) {
  const schema = this.schema,
        _this = this;
  let retorno = true; // by default, is valid :)

  Object.keys(schema).forEach(function (property) {
    // Data form schema
    const valPropSchema = schema[property];
    const getTypeValSchema = uSchema.getType.schema(valPropSchema);

    if (response.hasOwnProperty(property)) {
      // Data from response
      const valPropObj = response[property];
      const getTypeValObj = uSchema.getType.obj(valPropObj);

      switch (getTypeValSchema) {
        case 'string':
        case 'number':
        case 'boolean':
        case 'array':
          if (getTypeValSchema !== getTypeValObj) {
            if (valPropSchema.required) retorno = false;
            uSchema.reg(_this.different, {
              current: getTypeValObj,
              expected: getTypeValSchema,
              value: valPropObj
            }, property);
          } else {
            uSchema.reg(_this.compiled, valPropObj, property)
          }
          break;
        
        case 'object':
          if (getTypeValObj === 'object') {
            if (valPropSchema.hasOwnProperty('properties')) {
              const propertiesSchema = new Schema(valPropSchema.properties);
              if (!propertiesSchema.validate(valPropObj)) retorno = false;
              uSchema.mergeProps(_this, propertiesSchema, property);
            } else {
              uSchema.reg(_this.compiled, valPropObj, property);
            }
          } else {
            if (valPropSchema.required) {
              retorno = false;
              uSchema.reg(_this.different, {
                current: getTypeValObj,
                expected: getTypeValSchema,
                value: valPropObj
              }, property);
            }
          }
          break;
        
        case 'mixed':
          const typesValid = valPropSchema.filter(function (type) {
            return type === getTypeValObj;
          });
          // no body match with any types items.
          if (!typesValid.length && valPropSchema.required) { 
            retorno = false;
            uSchema.reg(_this.different, {
              current: getTypeValObj,
              expected: valPropSchema,
              value: valPropObj
            }, property);
          } else {
            uSchema.reg(_this.compiled, valPropObj, property)
          }
          break;

        default:
          console.log('format type dont accepted: ' + getTypeValSchema);
          retorno = false;
      }
    } else {
      let missing;
      if (valPropSchema.required) {
        retorno = false;
        missing = 'required';
      } else {
        missing = 'optional';
      }
      uSchema.reg(_this.missings[missing], property);
      if (valPropSchema.default) _this.compiled[property] = valPropSchema.default;
    }
  });

  // Returning
  return retorno;
};