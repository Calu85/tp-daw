TP final Desarrollo Aplicaciones Web
=======================

Este código se realiza como trabajo final de la materia de Desarrollo de aplicaciones web. Corresponde a la cohorte 11 de la Especialización en Internet de las Cosas (Facultad de Ingeniería, UBA).
Arrancó como un fork del [respositorio de la materia](https://github.com/mramos88/app-fullstack-base-2025-i11/), pero luego se subió como un repo independiente con los cambios necesarios para cumplir los requisitos del TP.

### Instalar las dependencias

Para correr este proyecto es necesario que instales `Docker` y `Docker Compose`. 

En [este artículo](https://www.gotoiot.com/pages/articles/docker_installation_linux/) publicado en nuestra web están los detalles para instalar Docker y Docker Compose en una máquina Linux. Si querés instalar ambas herramientas en una Raspberry Pi podés seguir [este artículo](https://www.gotoiot.com/pages/articles/rpi_docker_installation) de nuestra web que te muestra todos los pasos necesarios.

En caso que quieras instalar las herramientas en otra plataforma o tengas algún incoveniente, podes leer la documentación oficial de [Docker](https://docs.docker.com/get-docker/) y también la de [Docker Compose](https://docs.docker.com/compose/install/).

Continua con la descarga del código cuando tengas las dependencias instaladas y funcionando.

### Organización del proyecto

El proyecto se organiza como se muestra a continuación:

```sh
├── db                          # directorio de la DB
│   ├── data                    # estructura y datos de la DB
│   └── dumps                   # directorio de estructuras de la DB
│       └── smart_home.sql      # estructura con la base de datos 
└── src                         # directorio codigo fuente
│   ├── backend                 # directorio para el backend de la aplicacion
│   │   ├── index.js            # codigo principal del backend
│   │   ├── mysql-connector.js  # codigo de conexion a la base de datos
│   │   ├── package.json        # configuracion de proyecto NodeJS
│   │   └── package-lock.json   # configuracion de proyecto NodeJS
│   └── frontend                # directorio para el frontend de la aplicacion
│       ├── js                  # codigo javascript que se compila automáticamente
│       ├── static              # donde alojan archivos de estilos, imagenes, fuentes, etc.
│       ├── ts                  # donde se encuentra el codigo TypeScript a desarrollar
│       └── index.html          # archivo principal del cliente HTML
├── docker-compose.yml          # archivo donde se aloja la configuracion completa
├── README.md                   # este archivo
```

## Detalles de implementación 💻

En esta sección podés ver los detalles específicos de funcionamiento del código y que son los siguientes.

### Frontend

Al cargar la web se muestran todos los dispositivos que hay en la base de datos.
El botón agregar dispositivo permite agregar nuevos dispositivos a la base de datos. Los cambios se reflejan automáticamente en el lsitado.
Cada dispositivo puede ser editado (se puede cambir nombre, descripción y tipo), y puede ser eliminado.
Cada dispositivo se puede controlar cambiando el estado entre encendido y apagado, o bien la intensidad.
Se usó la biblioteca materialize para todo el proyecto y los diálogos modals para agregar y editar dispositivos.

### Backend

Estos son los edpoints disponibles.

1) GET, /devices
Devuelve todos los dispositivos.
```json
{
    "method": "get",
    "request_headers": "application/json",
    "request_body": "",
    "response_code": 200,
    "response_body": {
        "devices": [
            {
                "id": #,
                "name": "Nombre del dispositivo",
                "description": "Alguna descripción",
                "state": 1, //Por ahora 1 es encendido, 0 apagado
                "type": 1 
            },
        ]
    }
}
``` 
2) POST, /devices
Agrega un dispositivo en la base de datos. El estado no se envía porque por defecto se agregan apagados.
```json
{
    "method": "post",
    "request_headers": "application/json",
    "request_body": {
                "name": "Nombre del dispositivo",
                "description": "Alguna descripción",
                "type": 1 
            },,
    "response_code": 200,
    "response_body": {
        "devices": [
            {
                "id": #,
                "name": "Nombre del dispositivo",
                "description": "Alguna descripción",
                "state": 1, //Por ahora 1 es encendido, 0 apagado
                "type": 1 
            },
        ]
    }
}
``` 

3) PUT, /devices
Modifica un dispositivo en la base de datos. Los campos que se pueden modificar con este comando son el nombre, la descripción y el tipo. No se incluye el estado porque para eso hay un método específico.
```json
{
    "method": "put",
    "request_headers": "application/json",
    "request_body": {
                "name": "Nombre del dispositivo",
                "description": "Alguna descripción",
                "type": 1 
            },
    "response_code": 200,
}
``` 

4) DELETE, /devices
Borra un dispositivo de la base de datos. En el body se envía el id del dispositivo.
```json
{
    "method": "delete",
    "request_headers": "application/json",
    "request_body": {
                "id":ID
            },
    "response_code": 200,
}
``` 

5) PUT, /devices/:id
Modifica el estado del dispositivo indicado en el endpoint. No es necesario poner nada en el body.
```json
{
    "method": "put",
    "request_headers": "application/json",
    "response_code": 200,
}
``` 