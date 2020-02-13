const response2 = {
  "content": {
    "image": {
      "srcset": "images/icons/icon-fraude.png 1x, images/icons/icon-fraude@2x.png 2x"
    },
    "preTitle": {
      "text": "más rápida y cómoda",
      "classes": "lh-color-light-blue"
    },
    "title": {
      "text": "Descubre tu nueva herramienta de trabajo",
      "classes": "lh-typo lh-typo__sectitle lh-typo__sectitle--2"
    },
    "description": {
      "text": "Nosotros nunca te pediremos tus contraseñas, fecha de cumpleaños, lugar de nacimiento, nombre de familiares ni demás datos personales.",
      "classes": "lh-typo lh-typo__p2"
    }
  }
};

const schema2 = {
  content: {
    type: 'object',
    required: true,
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
          },
          tag: {
            type: 'string',
            default: 'h2'
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
          },
          tag: {
            type: 'string',
            default: 'h1'
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
            default: 'lh-typo lh-typo__p2',
          },
          tag: {
            type: 'string',
            default: 'p'
          }
        }
      }
    }
  }
};

const response = {
  cantidad: 3,
  guardados: true,
  lista: ['teclado', 'mouse', 'celular']
};

const schema = {
  cantidad: {
    type: 'number',
    required: true
  },
  guardados: 'boolean',
  lista: 'array'
}

const card = new Schema(schema);
const isValid = card.validate(response);

console.log(card);
console.log('\n\n');
console.log('isValid: ', isValid);
console.dir('different: ', card.different);
console.log('missings required: ', card.missings.required);
console.log('missings optional: ', card.missings.optional);
console.dir('errors: ', card.errors);


console.log('\n\n\nCompilation...');
const compile = card.compile();
console.log(compile);
