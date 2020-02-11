# Schema
Es un sistema simple de verificación y compilación de objetos a travez de un esquema.

## Ejemplos de modos de uso

```javascript
/* Crearemos un esquema con una sola propiedad 'title' de tipo 'string' obligatoria */
const myObj = {
  title: {
    type: 'string',
    required: true
  }
};
const myTitle = new Schema(myObj);
```

## Navegadores compatibles

IE11+, Chrome, Firefox, Safari, Opera


### Métodos disponibles
- validate(Object) : Sirve para validar el esquema con un objeto pasado.

```javascript
/* Verificamos si es válido el schema con un objeto (un 'response' por ejemplo) */
const myResponse = {
  title: 'Título cualquiera'
};
myTitle.validate(myResponse); // => true
```

- compile() : Obtiene el objeto fusionado con el esquema iniciado.

```javascript
const myObj = {
  title: {
    type: 'string',
    required: true
  },
  description: {
    type: 'string',
    default: 'Ejemplo de descripción'
  }
};

const myResponse = {
  title: 'Título cualquiera'
};

const myTitle = new Schema(myObj);
myTitle.validate(myResponse); // OJO: se tiene que validar antes de compilar.
myTitle.compile(); // => { title: 'Título cualquiera', description: 'Ejemplo de descripción' }
```

### Getters
- different : Devuelve los valores diferentes entre el esquema y el objeto pasado.
- missings.required : Devuelve una lista de las propiedades requeridas inexistentes.
- missings.optional : Devuelve una lista de las propiedades opcionales inexistentes.
- errors : Devuelve una lista de los errores encontrados en la compilación.

```javascript
console.log(myTitle.different);
console.log(myTitle.missings.required);
console.log(myTitle.missings.optional);
console.log(myTitle.errors);
```

---

Por el momento es todo lo que trae, más adelante agregaré más caracteristicas, como más métodos y eventos.

Licencia
----

MIT