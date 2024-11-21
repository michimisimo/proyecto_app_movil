
# App de Gestión de Eventos

Esta aplicación móvil tiene como objetivo centralizar toda la información relacionada con eventos sociales en un solo lugar, eliminando la necesidad de utilizar múltiples redes sociales para compartir fotos o detalles del evento. Con esta solución, los usuarios pueden acceder fácilmente a toda la información del evento de manera organizada y accesible para todos los invitados.

## Características Principales
* Gestión de eventos: Los usuarios pueden crear eventos, enviar invitaciones y gestionar la lista de invitados.
* Galería de fotos compartida: Los invitados pueden subir fotos desde su dispositivo o tomar fotografías directamente desde la aplicación. Todas las imágenes están disponibles en una galería centralizada.
* Visualización de fotos: Al seleccionar una imagen, se despliega una galería para explorar todas las fotos del evento.
* Gestión de roles: El creador del evento puede asignar roles de administrador a otros usuarios para permitirles editar información del evento.
* Edición de ubicación: Los administradores pueden actualizar la ubicación del evento utilizando la ubicación actual o un buscador integrado. La ubicación se mostrará en un mapa interactivo para facilitar el acceso de los invitados.
* Listados personalizados: Los usuarios pueden consultar eventos que han creado o a los que han sido invitados.

## Mejoras Futuras
* Comentarios en los eventos.
* Descarga y ampliación de imágenes desde la galería.
* Inclusión de fotos de perfil de los participantes en sus interacciones.
* Incorporación de pantallas de carga para mejorar la experiencia de usuario.

## Validación y Seguridad
La aplicación incluye validación de usuarios y roles para garantizar que las funcionalidades estén disponibles únicamente según los permisos asignados. Además, se implementó la encriptación de información sensible para proteger los datos de los usuarios y cumplir con los estándares de seguridad.


## Ejecutar Localmente

Sigue estos pasos para ejecutar la aplicación en tu entorno local:

1. Clona el repositorio 

        git clone https://github.com/michimisimo/proyecto_app_movil.git


2. Accede al directorio del proyecto

        cd proyecto_app_movil  

3. Instala las dependencias
Asegúrate de tener Node.js y Ionic CLI instalados previamente. Luego, ejecuta:

        npm install  

4. Ejecuta el proyecto
Inicia la aplicación en un entorno de desarrollo:

        ionic serve  
Esto abrirá la aplicación en tu navegador predeterminado.

5. Opcional: Prueba en un dispositivo móvil
Si deseas probar la aplicación en un dispositivo físico o emulador, asegúrate de tener Capacitor configurado correctamente:

* Agrega la plataforma deseada (Android o iOS):

        ionic capacitor add android  
        ionic capacitor add ios  

* Compila el proyecto:

        ionic build  
        ionic capacitor copy android  
        ionic capacitor copy ios  

* Abre el proyecto en el IDE correspondiente (Android Studio o Xcode):

        ionic capacitor open android  
        ionic capacitor open ios  

Siguiendo estos pasos, estás listo para explorar la aplicación en tu entorno local.


## Tecnologías

**Cliente:**
Ionic Framework, Angular, TypeScript, HTML, SCSS, Capacitor

**Servidor:**
Node.js

**Externos:**
Mapbox API
## Autores

- [María José Calderón](https://www.github.com/mariajosecq)
- [Felipe Urbina](https://www.github.com/michimisimo)

