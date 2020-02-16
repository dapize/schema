# Schema
Es un sistema simple de verificación y compilación de objetos a travez de un esquema.

## Definiciones

Existen dos formas de declarar el tipo de valor que tendrá una propiedad:

- La simple: Se define como valor el nombre del tipo que tendrá la propiedad.

```javascript
// Ejemplo
const objSchema = {
  title: 'string',
  position: 'number'
};
```

Crearemos un esquema con una sola propiedad 'title' de tipo 'string'. 

```javascript
const myObj = {
  title: 'string'
};
const titleSchema = new Schema(myObj);
```

- La compuesta: Como valor de la propiedad a verificar se crea un objeto con la siguiente sintaxis:

```javascript
// Ejemplo sintaxis:
{
  type: 'string', // Nombre del tipo
  required: true, // Si es obligatoria esta propiedad
  default: 'Titulo cualquiera' // El valor por defecto de la propiedad
}
```

```javascript
// Ejemplo de definición compuesta, tomando como base el ejemplo de más arriba:
const objSchema = {
  title: {
    type: 'string',
    required: true
  },
  position: {
    type: 'number',
    default: 10
  }
};
const titleSchema = new Schema(objSchema); // inicializamos el schema.
```

> - Los tipos disponibles para verificar son: string, number, object, boolean y array , y se declaran escritos como string.

Cuando el tipo de valor es objeto, es posible definir una propiedad adicional llamada 'properties' en donde cada llave de este objeto usa la misma sintaxis de la definición simple o compuesta.
```javascript
const objSchema = {
  friends: {
    type: 'object',
    required: true,
    properties: {
      work: 'array', // definición simple.
      neighborhood: { // definición compuesta.
        type: 'array',
        required: true
      }
    }
  }
};
const friendsSchema = new Schema(objSchema); // inicializamos el schema.
```

Cuando se espera que el valor de una propiedad en un objeto a validar sea de más de un tipo, digamos, de tipo 'string' o de tipo 'array', se debe declarar los tipos entre de un array

```javascript
const objSchema = {
  tasks: ['string', 'array'] // digamos que tienes solo una tarea (string) o varias (array).
};
const tasksSchema = new Schema(objSchema); // inicializamos el schema.
```

> ### OJO:
> - La propiedad 'required' y 'default', son opcionales.
> - Todos las propiedades de un esquema definido son opcionales a menos que se declaren requeridas (con la propiedad 'required' en true obviamente. No hace falta poner 'required' en false obviamente, simplemente se obvia.)


### Métodos disponibles
- validate(Object) : Sirve para validar el esquema con un objeto. Comunmente el objeto es un response de una llamada ajax.

```javascript
// Verificamos si es válido un objeto con el esquema creado más arriba
const myResponse = {
  title: 'Título cualquiera'
};
titleSchema.validate(myResponse); // => true
// Si cumple con el esquema definido, porque la propiedad 'title', es un 'string'
// y existe en el objeto pasado para ser validado.
```

- compile(obj) : Obtiene el objeto fusionado con el esquema iniciado.
Esto se usa normalmente para obtener un objeto más grande que contendrá las propiedades 'por defecto' que se declararón en el esquema.

> Si yá se validó no es necesario pasar como argumento el objeto a compilar.

```javascript
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
  authors: 'Loki' // authors: ['Loki', 'Thor', 'Iroman']
};

const myTitle = new Schema(myObj);
myTitle.validate(myResponse); // => TRUE
myTitle.compile();

/*
 =>

  {
    title: 'Título cualquiera',
    description: 'Ejemplo de descripción',
    authors: 'Loki'
  }
*/
```

### Getters
- different : Devuelve los valores diferentes entre el esquema y el objeto pasado.
- missings.required : Devuelve una lista de las propiedades requeridas inexistentes.
- missings.optional : Devuelve una lista de las propiedades opcionales inexistentes.
- errors : Devuelve una lista de los errores encontrados en la compilación.

```javascript
// Tomando en cuenta el ejemplo de más arriba:
console.log(myTitle.different);
console.log(myTitle.missings.required);
console.log(myTitle.missings.optional);
console.log(myTitle.errors);
```

## Navegadores compatibles

IE11+, Chrome, Firefox, Safari, Opera

## Extras
Más información técnica en la carpeta 'docs'

### Por agregar:
- Método 'extend' : Servirá para extender un schema previamente definido.
- Propiedad 'pattern': Servirá para verificar específicamente si el valor cumple con un patrón definido, muy aparte de la existencia de la misma propiedad en el objeto pasado.

---

Por el momento es todo lo que trae, más adelante agregaré más caracteristicas, como más métodos y eventos.

Licencia
----

MIT
