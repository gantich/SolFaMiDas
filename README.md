# SolFaMiDas
==================

## Introducción
Esta es una aplicación de tipo Single Page Application (SPA) multiplataforma creando un reproductor de música basado en la información obtenida de [Spotify Web API](https://developer.spotify.com/web-api/) y [Echo Nest API](http://developer.echonest.com/docs/v4).

Con SolFaMiDas podemos realizar búsquedas de **canciones**, **albumes** o **artistas**, **reproducir** las canciones así como la posibilidad de crear **listas de reproducción** a gusto del usuario.

También se le da al usuario un listado de las **canciones más influyentes** del panorama actual así como **recomendaciones de canciones** basadas en sus gustos musicales.

#### Navegación
- Recomendaciones (top mundial o según gustos)
- Búsqueda
- Playlists
- Reproductor

#### Recomendaciones
- Top Canciones Mundial (al iniciar la aplicación)
- Recomendaciones (según reproducciones del usuario)

#### Búsqueda
- Canciones (con posibilidad de reproducirlas)
- Álbums
- Artistas

### Búsqueda -> Álbums
- Listado de las Canciones del Álbum (con posibilidad de reproducirlas)

### Búsqueda -> Artistas
- Listado del Top Canciones del Artista (con posibilidad de reproducirlas)

#### Playlist
- Creación y eliminado de Playlists
- Visualización contenido playlists (con posibilidad de reproducirlas)

#### Reproductor
- Titulo de la canción (enlaza a información de la canción)
- Nombre del album (enlaza a búsqueda de álbum)
- Nombre del artista (enlaza a búsqueda de artista)
- Carátula del album a modo de control play/pause
- Botones de reproducción (si se escucha una playlist)
- Botón de favoritos (para agregar a una playlist existente)

## GUI

Para el apartado gráfico de la SPA hemos recurrido a [Material Design Lite](http://www.getmdl.io/) para la mayoría de elementos así como [Font Awesome](https://fortawesome.github.io/Font-Awesome/) para los iconos.
