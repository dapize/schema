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
    const getTypeValSchema = getType(valPropSchema);

    if (response.hasOwnProperty(property)) {
      // Data from response
      const valPropObj = response[property];
      const getTypeValObj = getType(valPropObj);

      switch (getTypeValSchema) {          
        case 'string': // dont exists 'required', obiusly.
          if (getTypeValObj !== 'string') {
            reg(_this.different, property, {
              current: getTypeValObj,
              expected: 'string',
              value: valPropObj
            });
          } else {
            reg(_this.compiled, property, valPropObj)
          }
          break;

        case 'array':
          if (getTypeValSchema !== getTypeValObj) {
            if (valPropSchema.required) retorno = false;
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
          if (getTypeValObj === 'object') {
            if (valPropSchema.hasOwnProperty('properties')) {
              const propertiesSchema = new Schema(valPropSchema.properties);
              if (!propertiesSchema.validate(valPropObj)) retorno = false;
              mergeProps(_this, propertiesSchema, property);
            } else {
              reg(_this.compiled, property, valPropObj);
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
          break;
        
        case 'mixed':
          const typesList = valPropSchema.type;
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
          } else {
            reg(_this.compiled, property, valPropObj)
          }
          break;

        default:
          console.log('format type dont accepted: ' + getTypeValSchema);
      }
    } else {
      let missing;
      if (valPropSchema.required) {
        retorno = false;
        missing = 'required';
      } else {
        missing = 'optional';
      }
      reg(_this.missings[missing], null, property);
      if (valPropSchema.default) _this.compiled[property] = valPropSchema.default;
    }
  });

  // Returning
  return retorno;
};