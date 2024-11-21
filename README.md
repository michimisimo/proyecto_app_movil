
# App de Gestión de Eventos

Esta aplicación móvil tiene como objetivo centralizar toda la información relacionada con eventos sociales en un solo lugar, eliminando la necesidad de utilizar múltiples redes sociales para compartir fotos o detalles del evento. Con esta solución, los usuarios pueden acceder fácilmente a toda la información del evento de manera organizada y accesible para todos los invitados.

**Características Principales**
* Gestión de eventos: Crear eventos, enviar invitaciones y gestionar lista de invitados.
* Carga de imágenes: Subir fotos desde su dispositivo o tomar fotografías directamente desde la aplicación.
* Gestión de roles: Asignar roles de administrador a otros usuarios.
* Edición de ubicación: Actualizar la ubicación del evento utilizando la ubicación actual o un buscador integrado.

**Mejoras Futuras**
* Comentarios en los eventos.
* Descarga y ampliación de imágenes desde la galería.
* Inclusión de fotos de perfil de los participantes en sus interacciones.
* Incorporación de pantallas de carga para mejorar la experiencia de usuario.

**Validación y Seguridad**
* Validación de usuarios y roles. 
* Encriptación de información sensible.


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

## Versión instalable (Beta)

**Requisitos**
* Android 5.1 (Lollipop) o posterior
* Aproximadamente 8 MB de espacio disponible en el dispositivo.

**Permisos requeridos:**
* Acceso a la cámara (para tomar fotos)
* Acceso a la ubicación (para mapear eventos)
* Acceso al almacenamiento (para guardar fotos del evento)

**Instrucciones de instalación:**
1. Descarga el archivo [app-release.apk](https://github.com/michimisimo/proyecto_app_movil/releases/tag/beta).
2. Habilita la opción "Instalar desde fuentes desconocidas" en la configuración de tu dispositivo:
   - Ve a **Configuración > Seguridad**.
   - Activa **Instalar aplicaciones de fuentes desconocidas**.
3. Abre el archivo APK descargado y sigue las instrucciones para instalar la aplicación.

## Tecnologías

**Cliente:**
Ionic Framework, Angular, TypeScript, HTML, SCSS, Capacitor

**Servidor:**
Node.js

**Externos:**
Mapbox API

## Imágenes de Referencia

<div style="display: flex; flex-wrap: wrap; justify-content: space-between;">
    <img src="https://i.imgur.com/DikWUtl.jpeg" alt="Proyecto 1" width="150"/>
    <img src="https://i.imgur.com/lKrR1xJ.jpeg" alt="Proyecto 2" width="150"/>
    <img src="https://i.imgur.com/t7FhjnP.jpeg" alt="Proyecto 3" width="150"/>
    <img src="https://i.imgur.com/ZDC4k92.jpeg" alt="Proyecto 4" width="150"/>
    <img src="https://i.imgur.com/rJh3NSa.jpeg" alt="Proyecto 6" width="150"/>
</div>


## Autores

- [María José Calderón](https://www.github.com/mariajosecq)
- [Felipe Urbina](https://www.github.com/michimisimo)

