const Schema = require('../dist/schema');

describe('Creating Instance', () => {
  test('Short', () => {
    const shortSchema = {
      text: 'string',
      number: 4
    }
    const shortInstance = new Schema(shortSchema);
    expect(shortInstance).toEqual({
      schema: shortSchema,
      missings: {
        required: [],
        optional: []
      },
      different: {},
      errors: [],
      compiled: {},
    });
  });

  test('Large', () => {
    const largeSchema = {
      name: {
        type: 'string',
        required: true
      },
      age: 'string',
      developer: {
        type: 'boolean',
        required: true
      },
      seniority: 'string',
      skill: 'array'
    };
    const largeInstance = new Schema(largeSchema);
    expect(largeInstance).toEqual({
      schema: largeSchema,
      missings: {
        required: [],
        optional: []
      },
      different: {},
      errors: [],
      compiled: {},
    });
  });
});