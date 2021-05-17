# Registro de Empleados

Proyecto desplegado: https://codeblack-solutions.web.app

Visita mi sitio: https://maggot-code.web.app/ 

## Desarrollo
Crud desarrollado con:

* [Angular CLI](https://github.com/angular/angular-cli) de la versión 8.3.21.
* Servicio de hosting y firestore database de [Firebase](https://firebase.google.com).

## Ejecutar de manera local

* Clonar el repositorio.
* Instalar los módulos con `npm install`.
* Ejecutar con `ng serve` y navegar con la dirección `http://localhost:4200/`.

## Diseño

* [SCSS](https://sass-lang.com/) con [FlexBox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) y [Grid](https://css-tricks.com/snippets/css/complete-guide-grid/) para el diseño responsive con @media screen.
* [Google Fonts](https://fonts.google.com/) para el diseño de letras.
* [Font Awesome](https://fontawesome.com/) para los iconos.
* [Angular Material](https://material.angular.io/) para los componentes diseñados como tabla, radio group, paginador, etc.
* [Bootstrap](https://getbootstrap.com/) para el input del buscador y navbar.
* Paquete [Sweetalert2](https://sweetalert2.github.io/) para lanzar modales después de realizar acciones como eliminar, actualizar y modifcar.
* Paquete [Toast](https://www.npmjs.com/package/ngx-toastr) para las notificaciones de error.

## Funcionalidades

### Acción de Listado

* Buscador por cualquier campo de la tabla.
* Ordena de manera ascendente y descendete por cada columna.
* Paginador.
* Redireccionar mediante rutas, sea estos como crear, editar y ver.
* En la columna de edad se hace el cambio de una fecha (01-01-2000) a 21.

### Acciones de Crear, Editar, Ver y Eliminar

Se aplica un loading hasta que el servicio responda.

#### Un componente reutilizable para crear, editar y ver.
Crear:

* Usar la [Api que lista todo los países](https://restcountries.eu/rest/v2/all).
* Dependiendo del área que el usuario seleccione se visualicen los cargos.
  * Administración: Fundador y CEO, Recursos Humanos.
  * Tecnología: Programador, Diseñador.
* La comisión solo está disponible para el cargo Fundador y CEO, para los otros casos el campo no debe estar visible.
* Cuando se crea el empleado se redirecciona al listado principal.
* Validaciones:
  * Todos los campos son obligatorios.
  * La edad mínima debe ser de 18 años.
  * El nombre de usuario no debe tener caracteres especiales.
  * Deshabilitar el botón de guardar mientras el formulario no sea váido.

Editar:
* Todos los campos son editables.
* Aplica la lógica de la opción de crear.

Ver: 
* Todos los campos están deshabilitados.

Eliminar:
* Modal opcional de eliminar.
