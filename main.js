const response = {
  "image": "images/icons/icon-fraude.png 1x",
  "title": "Fraudes electrónicos"
};

const schema = {
  image: 'boolean',
  title: 'number'
};


const response2 = {
  "image": {
    "srcset": "images/icons/icon-fraude.png 1x, images/icons/icon-fraude@2x.png 2x"
  },
  "preTitle": {
    "text": "más rápida y cómoda",
    "classes": "lh-color-light-blue"
  },
  "title": {
    "text": "Descubre tu nueva herramienta de trabajo",
    "classes": "lh-typo__sectitle lh-typo__sectitle--2"
  },
  "description": {
    "text": "Nosotros nunca te pediremos tus contraseñas, fecha de cumpleaños, lugar de nacimiento, nombre de familiares ni demás datos personales."
  }
};

const schema2 = {

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
        default: 'div'
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
        default: 'div'
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
      },
      tag: {
        type: 'string',
        default: 'div'
      }
    }
  }

};


const headerSchema = new Schema(schema);
const isValid = headerSchema.validate(response);

console.log('\n\n');
console.log('isValid: ', isValid);
console.dir('different: ', headerSchema.different);
console.dir('missings: ', headerSchema.missings);
/*
const modHeader = {
  "badge": "string"
};

const headerExtended = headerSchema.extend(modHeader);

console.log(headerExtended);
*/