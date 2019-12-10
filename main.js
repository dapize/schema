const schema = {
  image: {
    type: Object,
    properties: {
      srcset: String
    }
  },
  preTitle: {
    type: Object,
    properties: {
      text: String,
      classes: {
        type: String,
        default: 'lh-color-light-blue'
      }
    }
  },
  title: {
    type: Object,
    properties: {
      text: {
        type: String,
        required: true
      },
      classes: {
        type: String,
        default: 'lh-typo__sectitle lh-typo__sectitle--2'
      }
    }
  },
  description: {
    type: Object,
    properties: {
      text: String,
      classes: {
        type: String,
        default: 'lh-typo__p2'
      }
    }
  },
  list: {
    type: Array,
    items: []
  },
  order: {
    type: Number,
    required: true
  },
  cualquiera: [Number, String]
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
  },
  "order": 4
}

const validResponse = Smart.schema(schema, response);

console.log('equal: ', validResponse.equal());
console.log('missing: ', validResponse.missing)
console.log('different: ', validResponse.different)
