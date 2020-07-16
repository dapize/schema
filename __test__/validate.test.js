const Schema = require('../dist/schema');

describe('Validate', () => {

  test('Short: return TRUE', () => {
    const shortSchema = { text: 'string', num: 'number' };
    const shortInstance = new Schema(shortSchema);

    const shortResponse = { text: 'Continue', num: 2 };
    const shortValidate = shortInstance.validate(shortResponse);

    expect(shortValidate).toBeTruthy();
    expect(shortInstance.missings.optional).toEqual([]);
    expect(shortInstance.missings.required).toEqual([]);
    expect(shortInstance.different).toEqual({});
    expect(shortInstance.errors).toEqual([]);
  });

  test('Short: return TRUE (different optional prop)', () => {
    const shortSchema = { text: 'string', num: 'number' };
    const shortInstance = new Schema(shortSchema);

    const shortResponse = { text: 'Continue', num: '2' };
    const shortValidate = shortInstance.validate(shortResponse);
    expect(shortValidate).toBeTruthy();
    expect(shortInstance.missings.optional).toEqual([]);
    expect(shortInstance.missings.required).toEqual([]);
    expect(shortInstance.different).toEqual({
      num: {
        current: 'string',
        expected: 'number',
        value: '2'
      }
    });
    expect(shortInstance.errors).toEqual([]);
  });

  test('Short: return FALSE (different required prop)', () => {
    const shortSchema2 = {
      text: 'string',
      num: {
        type: 'number',
        required: true
      }
    };
    const shortInstance2 = new Schema(shortSchema2);
    const shortResponse2 = { text: 'Continue', num: '2' };
    const shortValidate2 = shortInstance2.validate(shortResponse2);
    expect(shortValidate2).toBeFalsy();
    expect(shortInstance2.missings.optional).toEqual([]);
    expect(shortInstance2.missings.required).toEqual([]);
    expect(shortInstance2.different).toEqual({
      num: {
        current: 'string',
        expected: 'number',
        value: '2'
      }
    });
    expect(shortInstance2.errors).toEqual([]);
  });

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

  test('Large: return TRUE (optional prop)', () => {
    const largeInstance = new Schema(largeSchema);
    const largeResponse = {
      name: 'Mike',
      age: 32,
      developer: true
    };
    const largeValidate = largeInstance.validate(largeResponse);
    expect(largeValidate).toBeTruthy();
    expect(largeInstance.missings.optional).toEqual(['seniority', 'skill']);
    expect(largeInstance.missings.required).toEqual([]);
    expect(largeInstance.different).toEqual({
      age: {
        current: 'number',
        expected: 'string',
        value: 32
      }
    });
    expect(largeInstance.errors).toEqual([]);
  });

  test('Large: return FALSE (optional prop)', () => {
    const largeInstance = new Schema(largeSchema);
    const largeResponse = {
      age: 32,
      developer: true
    };
    const largeValidate = largeInstance.validate(largeResponse);
    expect(largeValidate).toBeFalsy();
    expect(largeInstance.missings.optional).toEqual(['seniority', 'skill']);
    expect(largeInstance.missings.required).toEqual(['name']);
    expect(largeInstance.different).toEqual({
      age: {
        current: 'number',
        expected: 'string',
        value: 32
      }
    });
    expect(largeInstance.errors).toEqual([]);
  });

  test('Large: type object', () => {
    const objSchema = {
      friends: {
        type: 'object',
        required: true,
        properties: {
          work: 'array', 
          neighborhood: {
            type: 'array',
            required: true
          }
        }
      }
    };
    const friendsSchema = new Schema(objSchema); // inicializamos el schema.
    const friendsValidated = friendsSchema.validate({
      friends: {
        neighborhood: ['Loki', 'Thor', 'Iroman']
      }
    });
    expect(friendsValidated).toBeTruthy();
    expect(friendsSchema.missings.optional).toEqual(['work']);
  });

  test('Simple mixed types', () => {
    const myObj = { tasks: ['string', 'array'] };
    const tasksSchema = new Schema(myObj);
    const validString = tasksSchema.validate({tasks: 'simple tasks'});
    const validArray = tasksSchema.validate({tasks: ['first tasks', 'second tasks']});
    expect(validString).toBeTruthy();
    expect(validArray).toBeTruthy();
  });

  test('Large mixed types', () => {
    const myObj = {
      tasks: {
        type: ['string', 'array'],
        default: 'nothing'
      }
    };
    const tasksSchema = new Schema(myObj);
    const validString = tasksSchema.validate({tasks: 'simple tasks'});
    const validArray = tasksSchema.validate({tasks: ['first tasks', 'second tasks']});
    expect(validString).toBeTruthy();
    expect(validArray).toBeTruthy();
  });
 
});
