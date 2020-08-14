const Schema = require('../dist/schema');

describe('Method compile', () => {

  test('without default props', () => {

    const myObj = {
      title: {
        type: 'string',
        required: true
      },
      description: 'string',
      authors: ['string', 'array']
    };
    
    const myResponse = {
      title: 'Título cualquiera',
      authors: 'Loki'
    };
    
    const myTitle = new Schema(myObj);
    expect(myTitle.compile(myResponse)).toEqual({
      title: 'Título cualquiera',
      authors: 'Loki'
    });

  });

  test('with default props', () => {

    const myObj = {
      title: {
        type: 'string',
        required: true
      },
      description: {
        type: 'string',
        default: 'Ejemplo de descripción'
      },
      authors: ['string', 'array']
    };
    
    const myResponse = {
      title: 'Título cualquiera',
      authors: ['Loki', 'Thor', 'Iroman']
    };
    
    const myTitle = new Schema(myObj);
    expect(myTitle.compile(myResponse)).toEqual({
      title: 'Título cualquiera',
      description: 'Ejemplo de descripción',
      authors: ['Loki', 'Thor', 'Iroman']
    });

  });

  test('2 compilations with 1 schema', () => {

    const myObj = {
      image: {
        type: 'string',
        required: true
      },
      'image-alt': 'string',
      'image-title': 'string',
      title: {
        type: 'string',
        required: true
      },
      'title-tag': {
        type: 'string',
        default: 'h4'
      },
      description: 'string'
    };
    
    const myResponse1 = {
      image: '../../assets/images/premio.png',
      title: 'Costo Cero',
      description: 'Esta es una descripción'
    };

    const myResponse2 = {
      image: '../../assets/images/premio2.png',
      title: 'Costo Cero 2',
      description: 'Esta es una descripción 2'
    };
    
    const mySchema = new Schema(myObj);

    expect(mySchema.compile(myResponse1)).toEqual({
      description: "Esta es una descripción",
      image: "../../assets/images/premio.png",
      title: "Costo Cero",
      "title-tag": "h4"
    });
    expect(mySchema.compile(myResponse2)).toEqual({
      description: "Esta es una descripción 2",
      image: "../../assets/images/premio2.png",
      title: "Costo Cero 2",
      "title-tag": "h4"
    });
  });

  test('Compilation with default falsy value', () => {

    const myObj = {
      title: {
        type: 'string',
        required: true
      },
      amount: {
        type: 'number',
        default: 0
      },
      deleted: {
        type: 'boolean',
        default: false
      },
      description: 'string'
    };
    
    const myResponse = {
      title: 'Costo Cero'
    };
    
    const mySchema = new Schema(myObj);

    expect(mySchema.compile(myResponse)).toEqual({
      title: "Costo Cero",
      amount: 0,
      deleted: false
    });

  });
});