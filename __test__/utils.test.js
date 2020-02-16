const uSchema = require('../dist/utils');

test('is a obj literal', () => {
  const myObj = {};
  expect(uSchema.objLiteral(myObj)).toBeTruthy();
  expect(uSchema.objLiteral('one string')).toBeFalsy();
});

describe('know type', () => {
  const myObj = {
    word: 'string',
    nums: ['string', 'number'],
    age: {
      type: 'number'
    },
    taks: {
      type: 'object',
      properties: {
        home: 'string',
        work: 'string'
      }
    }
  };

  test('simple mode', () => {
    expect(uSchema.getType.schema(myObj.word)).toBe('string');
    expect(uSchema.getType.schema(myObj.nums)).toBe('mixed');
  });

  test('obj mode', () => {
    expect(uSchema.getType.schema(myObj.age)).toBe('number');
    expect(uSchema.getType.schema(myObj.taks)).toBe('object')
  });
});

describe('rec log', () => {
  test('rec in object', () => {
    const myObj = {};
    expect(uSchema.reg(myObj, 'red', 'ball')).toBeTruthy();
    expect(uSchema.reg(myObj, 'red', 'ball')).toBeFalsy();
  });

  test('rec in array', () => {
    const colors = [];
    expect(uSchema.reg(colors, 'black')).toBeTruthy();
    expect(uSchema.reg(colors, 'black')).toBeTruthy();
    expect(colors).toEqual(['black', 'black']);
  });
});


test('merge propertie', () => {
  const instanceParent = {
    errors: ['first error'],
    missings: { required: ['third required'], optional: ['third optional'] },
    different: {},
    compiled: {}
  };
  const instanceChild = {
    errors: ['second error', 'third error'],
    missings: {
      required: ['first required', 'second required'],
      optional: ['first optional', 'second optional']
    },
    different: {
      age: {
        current: 'string',
        expected: 'number',
        value: '25'
      }
    },
    compiled: {}
  };
  
  uSchema.mergeProps(instanceParent, instanceChild, 'friend');
  const result = {
    errors: ['first error', 'second error', 'third error'],
    missings: {
      required: ['third required', 'first required', 'second required'],
      optional: ['third optional', 'first optional', 'second optional']
    },
    different: {
      friend: {
        age: {
          current: 'string',
          expected: 'number',
          value: '25'
        }
      }
    },
    compiled: {}
  };
  expect(instanceParent).toEqual(result);
});
