const schema = {
  'lh-section': {
    type: 'object',
    properties: {
      'lh-container': {
        type: 'object',
        properties: {
          'lh-section__header': {
            type: 'object',
            properties: {
              image: {
                type: 'object',
                properties: {
                  srcset: 'string'
                }
              },
              preTitle: {
                type: 'object',
                properties: {
                  text: 'string',
                  classes: {
                    type: 'string',
                    default: 'lh-color-light-blue'
                  }
                }
              },
              title: {
                type: 'object',
                properties: {
                  text: {
                    type: 'string',
                    required: true
                  },
                  classes: {
                    type: 'string',
                    default: 'lh-typo lh-typo__sectitle lh-typo__sectitle--2'
                  }
                },
                required: true
              },
              description: {
                type: 'object',
                properties: {
                  text: 'string',
                  classes: {
                    type: 'string',
                    default: 'lh-typo lh-typo__p2'
                  }
                }
              }
            },
            required: true
          }
        },
        required: true
      }
    },
    required: true
  }
};

const response = {
  "lh-section":{
    "content":{
      "lh-container":{
        "content":{
          "lh-section__header":{
            "content":{
              "image":{
                "srcset":"images/icons/icon-fraude.png 1x, images/icons/icon-fraude@2x.png 2x"
              },
              "preTitle":{
                "text":"más rápida y cómoda",
                "classes":"lh-color-light-blue"
              },
              "title":{
                "text":"Descubre tu nueva herramienta de trabajo",
                "classes":"lh-typo__sectitle lh-typo__sectitle--2"
              },
              "description":{
                "text":"Nosotros nunca te pediremos tus contraseñas, fecha de cumpleaños, lugar de nacimiento, nombre de familiares ni demás datos personales."
              }
            }
          }
        }
      }
    }
  }
};

const headerSchema = new Schema(schema);
const isValid = headerSchema.validate(response);
console.log('Instancia: ', headerSchema);
/*
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
*/
/*
const modHeader = {
  "badge": "string"
};

const headerExtended = headerSchema.extend(modHeader);

console.log(headerExtended);
*/