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

});