const schema = {

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
  },

  cualquiera: {
    type: ['number', 'string'],
    required: true
  },

  cancion: {
    type: 'string',
    required: true
  }
};

const response = {
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
    "text": ["Nosotros nunca te pediremos tus contraseñas, fecha de cumpleaños, lugar de nacimiento, nombre de familiares ni demás datos personales."]
  }
}

const headerSchema = new Schema(schema);
const isValid = headerSchema.validate(response);

if (isValid) {
  console.log('si es válido: ', isValid);
} else {
  console.log('no es válido: ', isValid);
}

const modHeader = {
  "badge": "string"
};

const headerExtended = headerSchema.extend(modHeader);

console.log(headerExtended);