const schema = {
  'lh-section': {
    type: 'object',
    required: true,
    properties: {
      content: {
        type: 'object',
        required: true,
        properties: {
          'lh-section__header': {
            type: 'object',
            required: true
          },
          'lh-section__slider': {
            type: 'object',
            required: true,
            properties: {
              content: {
                type: 'object',
                required: true,
                properties: {
                  mensaje: 'string'
                }
              }
            }
          }
        }
      }
    }
  }
};

const response = {
  "lh-section":{
    "content":{
      "lh-section__header2":{
        "content":{
          "preTitle":{
            "text":"más rápida y cómoda",
            "classes":"lh-color-light-blue"
          },
          "title":{
            "text":"Descubre tu nueva herramienta de trabajo",
            "classes":"lh-typo__sectitle lh-typo__sectitle--2"
          }
        }
      },
      "lh-section__slider": {
        "content": {
          "mensaje": "soy un mensaje",
          "alerta": "sunami rojo"
        }
      }
    }
  }
};

const headerSchema = new Schema(schema);
const isValid = headerSchema.validate(response);

console.log(headerSchema);
console.log('\n\n');
console.log('isValid: ', isValid);
console.dir('different: ', headerSchema.different);
console.log('missings required: ', headerSchema.missings.required);
console.log('missings optional: ', headerSchema.missings.optional);
console.dir('errors: ', headerSchema.errors);


console.log('\n\n\nCompilation...');
const compile = headerSchema.compile();
console.log(compile);

/*
const modHeader = {
  "badge": "string"
};

const headerExtended = headerSchema.extend(modHeader);

console.log(headerExtended);
*/