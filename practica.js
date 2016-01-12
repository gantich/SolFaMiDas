/*Determinamos el color (random) que van a tener los layouts,etc. Cada vez que se recargue la página,
que al ser una SPA solo se recarga la primera vez que entramos,cogerá un color de fondo distinto. De esta manera,
en cada ejecución, la página de SolFaMiDas tendrá un color de fondo distinto (aleatorio entre unos cuantos escogidos
para que luego puedan leerse las letras, etc.
Para conseguir esto lo que hacemos es crearnos una variable rand, que nos devuelve el índice que utilizaremos en el array
de colores. Esto será accesible desde cualquier lugar del código.
*/
var colores = ["#FF0000", "#FF4000", "#FF8000","#FFBF00",
 "#0080FF","#0040FF","#0000FF","#4000FF","#8000FF","#BF00FF","#FF00FF","#FF00BF",
 "#FF0080","#FF0040"];
var rand = Math.floor((Math.random() * colores.length));


/***********************************************************************************
**********************MUSICRECOMMENDER**********************************************
***********************************************************************************/
/*Creamos el objeto musicRecommender. Este objeto nos servirá para obtener canciones desde la búsqueda así
como el top de las canciones más escuchadas de spotify y los recomendados según las canciones que ha escuchado el usuario.
*/
var musicRecommender = new Object();

/*Esta es la función del objeto musicRecommender que se encarga de la interacción directa con la API de Spotify.
Lo que hace es realizar una búsqueda que siempre devuelve hasta 40 resultados, según un valor concreto y un tipo que
se pasan por parámetro.
*/
musicRecommender.search = function(type,query){
  var url_busquedaArtista = "https://api.spotify.com/v1/search?q="+query+"&type="+type+"&limit=40";
  var xhr = new XMLHttpRequest();
  var pr = xhr.open("GET", url_busquedaArtista, false);
  xhr.send();
  var response = JSON.parse(xhr.responseText);
  return response;
}

/*Esta función de dentro del objeto musicRecommender, nos sirve para realizar búsquedas de artistas,
de manera que llama a search para buscar los artistas y parsea la información que consideramos de interés
para poder acceder a dicha información de manera más cómoda cuando tengamos que buscar artistas dentro del
layout.
*/
musicRecommender.searchArtist = function(artist){
  var arrayArtistsJSON = musicRecommender.search("artist",artist);
  var arrayArtists = [];
  for (var i=0 ; i < arrayArtistsJSON.artists.items.length ; i++) {
    var artist = Object();
    artist.id = arrayArtistsJSON.artists.items[i].id;
    if(arrayArtistsJSON.artists.items[i].images.length ==0){
      //Default image in case it doesn't exist
      artist.image = "https://pbs.twimg.com/media/BQR9Vm3CEAA6wNx.png";
    }else{
      artist.image = arrayArtistsJSON.artists.items[i].images[1].url;
    }
    artist.name = arrayArtistsJSON.artists.items[i].name;
    arrayArtists.push(artist);
  }
  return arrayArtists;
}

/*Esta función se encarga de llamar a la función search para buscar albumes y luego
clasifica la información que consideramos de interés en un array para poder acceder cómodamente
a esta información más adelante.
*/
musicRecommender.searchAlbum = function(album){
  var arrayAlbumsJSON = musicRecommender.search("album",album);
  var arrayAlbums = [];
  for (var i=0; i<arrayAlbumsJSON.albums.items.length;i++) {
      var album = Object();
      album.id = arrayAlbumsJSON.albums.items[i].id;
      album.imagen = arrayAlbumsJSON.albums.items[i].images[0].url;
      album.name = arrayAlbumsJSON.albums.items[i].name;
      arrayAlbums.push(album);
  }
  return arrayAlbums;
}
/*Esta función se encarga de llamar a la función search y buscar canciones, una vez las tiene
clasifica la información y la inserta en un array de manera que luego será más facil acceder a ella.
*/
musicRecommender.searchTrack = function(track){
  var arrayTracksJSON = musicRecommender.search("track",track);
  var arrayTracks = [];
  for (var i=0; i<arrayTracksJSON.tracks.items.length;i++) {
      var track = Object();
      track.idAlbum = arrayTracksJSON.tracks.items[i].album.id;
      track.imagesAlbum = arrayTracksJSON.tracks.items[i].album.images[0].url;
      track.nameAlbum = arrayTracksJSON.tracks.items[i].album.name;

      track.idArtista = arrayTracksJSON.tracks.items[i].artists[0].id;
      track.nameArtista = arrayTracksJSON.tracks.items[i].artists[0].name;

      track.duracionms = arrayTracksJSON.tracks.items[i].duration_ms;

      track.id = arrayTracksJSON.tracks.items[i].id;
      track.name = arrayTracksJSON.tracks.items[i].name;
      track.preview_url = arrayTracksJSON.tracks.items[i].preview_url;

      arrayTracks.push(track);
  }
  return arrayTracks;
}
/*Esta función nos permite conocer las canciones más de un album*/
musicRecommender.albumSongs = function(id_album){
  var url_busquedaAlbumSongs = "https://api.spotify.com/v1/albums/"+id_album+"/tracks";
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url_busquedaAlbumSongs, false);
  xhr.send();
  var response = JSON.parse(xhr.responseText);
  var arrayAlbumSongs = [];
  for (var i=0 ; i < response.items.length ; i++) {
    var track = Object();
    track.idArtista = response.items[i].artists[0].id;
    track.nameArtista = response.items[i].artists[0].name;

    track.id = response.items[i].id;
    track.name = response.items[i].name;
    track.preview_url = response.items[i].preview_url;

    arrayAlbumSongs.push(track);
  }
  return arrayAlbumSongs;
}
/*Esta función nos permite conocer las canciones más importantes de un artista mediante el
id de dicho artista.
*/
musicRecommender.artistTopSongs = function(id_artist){
  var url_busquedaCancionesArtista = "https://api.spotify.com/v1/artists/"+id_artist+"/top-tracks?country=ES";
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url_busquedaCancionesArtista, false);
  xhr.send();
  var response = JSON.parse(xhr.responseText);
  var arrayArtistTopSongs = [];
  for (var i=0 ; i < response.tracks.length ; i++) {
    var track = Object();
    track.imagesAlbum = response.tracks[i].album.images[0].url;
    track.nameAlbum = response.tracks[i].album.name;
    track.idAlbum = response.tracks[i].album.id;

    track.idArtista = response.tracks[i].artists[0].id;
    track.nameArtista = response.tracks[i].artists[0].name;

    track.id = response.tracks[i].id;
    track.name = response.tracks[i].name;
    track.preview_url = response.tracks[i].preview_url;

    arrayArtistTopSongs.push(track);
  }
  return arrayArtistTopSongs;
}

/*Accedemos a la API de Echo Nest para consultar las canciones hotttessst o top más buscadas.
*/
musicRecommender.top100 = function(){
  var url_busqueda = "http://developer.echonest.com/api/v4/song/search?api_key=D397SDZ4EWQ7OUVGF&sort=song_hotttnesss-desc&bucket=song_hotttnesss&results=30";
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url_busqueda, false);
  xhr.send();
  var response = JSON.parse(xhr.responseText);
  return response;
}
/*Una vez recogidos as canciones top procedemos a buscar sus datos en la API de Spotify, buscando primero
el id del artista por medio de su nombre obtenido en la búsqueda de Echo Nest para luego buscar la canción
a partir del nombre de la canción obtenida en la búsqueda de Echo Nest y finalmente recogiendo únicamente
aquella canción que coincida con el artista obtenido en primera instancia
*/
musicRecommender.top100toSpotify = function(){
  var top = musicRecommender.top100();
  top = top.response.songs;
  var ids = "";
  var toptracks = [];
  for(var i = 0; i<top.length;i++){
    var url_busquedaArtista = "https://api.spotify.com/v1/search?q="+top[i].artist_name+"&type=artist&limit=1";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url_busquedaArtista, false);
    xhr.send();
    var artist = JSON.parse(xhr.responseText);
    var id_artist = artist.artists.items[0].id;
    var url_busquedaTrack = "https://api.spotify.com/v1/search?q="+top[i].title+"&type=track";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url_busquedaTrack, false);
    xhr.send();
    var tracks = JSON.parse(xhr.responseText).tracks.items;
    outerloop:
    for(var j = 0;j<tracks.length;j++){
      for(var k = 0;k<tracks[j].artists.length;k++){
        if(tracks[j].artists[k].id == id_artist){
          toptracks.push(tracks[j]);
          break outerloop;
        }
      }
    }
  }
  return toptracks;
}
/*Adecuamos los datos obtenidos de Spotify (formato JSON) a variables mas amigables.
*/
musicRecommender.top100Spotify = function(){
  var arrayTracksJSON = musicRecommender.top100toSpotify();
  var arrayTracks = [];
  for (var i=0; i<arrayTracksJSON.length;i++) {
      var track = Object();
      track.imagesAlbum = arrayTracksJSON[i].album.images[0].url;
      track.nameAlbum = arrayTracksJSON[i].album.name;
      track.idAlbum = arrayTracksJSON[i].album.id;
      track.idArtist = arrayTracksJSON[i].artists[0].id;
      track.nameArtist = arrayTracksJSON[i].artists[0].name;

      track.id = arrayTracksJSON[i].id;
      track.name = arrayTracksJSON[i].name;
      track.preview_url = arrayTracksJSON[i].preview_url;

      arrayTracks.push(track);
  }
  return arrayTracks;
}

/*Esta función nos permite encontrar las recomendaciones que podemos ofrecer al usuario
mediante un array de 10 canciones, de manera que es capaz de devolver hasta 40 canciones de
artistas ya escuchados. Esta es la música que se va recomendando al usuario una vez se tiene
información suya.
*/
musicRecommender.recommended = function(artists){
  var recommendedTracks = [];
  //Limitamos a 20 resultados, 10 si solo hay un artista (limitación API)
  if(artists.length == 1){
    var maxresults = 10;
  }else if(artists.length == 2){
      var maxresults = 20;
  }else if(artists.length == 3){
    var maxresults = 30;
  }else{
    var maxresults = 40;
  }
  //Realizamos una petición por cada uno de los hasta 10 artistas que recibimos
  for(var i = 0; i<artists.length;i++){
    var url = "https://api.spotify.com/v1/artists/"+artists[i]+"/top-tracks?country=ES";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();
    var response = JSON.parse(xhr.responseText);
    //Creamos un array para almacenar las top tracks de cada artista
    for (var j=0; j<maxresults/artists.length;j++) {
        var track = Object();
        track.idAlbum = response.tracks[j].album.id;
        track.imagesAlbum = response.tracks[j].album.images[0].url;
        track.nameAlbum = response.tracks[j].album.name;

        track.idArtista = response.tracks[j].artists[0].id;
        track.nameArtista = response.tracks[j].artists[0].name;

        track.duracionms = response.tracks[j].duration_ms;

        track.id = response.tracks[j].id;
        track.name = response.tracks[j].name;
        track.popularity = response.tracks[j].popularity;
        track.preview_url = response.tracks[j].preview_url;

        recommendedTracks.push(track);
    }
  }
  while(recommendedTracks.length >40)recommendedTracks.pop();
  return recommendedTracks;
}
/***********************************************************************************
**********************DATA**********************************************************
***********************************************************************************/
/*
El objeto data nos permitirá guardar información que el usuario va generando (playlists y canciones escuchadas)
en el navegador y nos permitirá también coger esta información del navegador. Para ello se ha utilizado localStorage.
Esto provoca que la página de SolFaMiDas únicamente funcione en los navegadores "nuevos" ya que algunos navegadores
anteriores no son capaces de tratar con localStorage.
*/
var Data = new Object();
Data.Playlists = [];
Data.cancionesEscuchadas = [];
/*
Esta función del objeto Data nos permite almacenar en el navegador la información que
se encuentra guardada en los dos arrays definidos en las líneas anteriores.
Para guardar esta información (que ha de ser en formato string), se ha decidido hacerlo
con un formato concreto, de manera que, en canciones seguiremos el formato: cancion1---atributo1---atributo2...@@@cancion2---atributo1---atributo2....
y con playlists: playlist1***idcancion1***idcancion2@@@playlist2***cancion1***cancion2....
De manera que en las playlists únicamente nos guardamos la información de qué idcanciones contiene,
y al buscar cualquier información sobre estas canciones nos dirigimos a canciones escuchadas, ya que no se puede
añadir una cancion a una playlist sin escucharla.
*/
Data.save = function(){
  var aux = Data.Playlists[0];
  for(var i = 1; i<Data.Playlists.length; i++){
    aux+= "@@@"+Data.Playlists[i];
  }
  if(aux==undefined){
    localStorage.setItem("playlists","Nope");
  }else{
    localStorage.setItem("playlists",aux);
  }

  aux=Data.cancionesEscuchadas[0];
  for(var i = 1; i<Data.cancionesEscuchadas.length; i++){
    aux+="@@@"+Data.cancionesEscuchadas[i];
  }
  if(aux==undefined){
    localStorage.setItem("cancionesEscuchadas","Nope");
  }else{
    localStorage.setItem("cancionesEscuchadas",aux);
  }
}
/*Esta funcion nos permite recuperar la información guardada en el navegador. Para ello únicamente
separa las playlists y canciones dejando dentro de cada una de ellas toda la información, es decir, que
cada elemento del array de playlist tendrá idplaylist***cancion1***cancion2...
y cada elemento del array de canciones escuchadas tendrá idcancion---atributo1---atributo2...
*/
Data.get = function(){
  if(localStorage.getItem("playlists")!="Nope"){
    var total = localStorage.getItem("playlists");
    if(total!=null){
      var pr = total.split("@@@");
      for(var i=0; i<pr.length;i++){
        Data.Playlists.push(pr[i]);
      }
    }
  }
  if(localStorage.getItem("cancionesEscuchadas")!="Nope"){
    var total = localStorage.getItem("cancionesEscuchadas");
    if(total!=null){
      var pr = total.split("@@@");
      for(var i=0; i<pr.length;i++){
        Data.cancionesEscuchadas.push(pr[i]);
      }
    }
  }
}
/*
Lo primero que hacemos es recuperar la información del navegador, que luego usaremos,
si es que tenia, para mostrar recomendados en lugar del top 100, cargar las playlists que
el usuario ya tenia creadas, etc.
*/
Data.get();
/***********************************************************************************
**********************PLAYER********************************************************
***********************************************************************************/
/*En el objeto Player, nos creamos un objeto que nos guarda la información de la canción que está
sonando en este momento.
También creamos un elemento "audio", de manera que nos permitirá reproducir/parar las canciones.
También nos creamos unos booleans para saber directamente si está en modo aleatorio, en modo bucle, etc.
*/
var Player = new Object();
Player.info = new Object();
Player.info.cancion;
Player.info.cancionimg;
Player.info.artista;
Player.info.idartista;
Player.info.album;
Player.info.url;
Player.info.idcancion;
Player.audio = document.createElement('audio');
Player.playlist = new Object();
Player.isPlaylist = false;
Player.isPlaying = false;
Player.isLoop = false;
Player.isRand = false;
/*La función setType se tiene que llamar siempre que se llama a playSong desde el layout y sirve
para decir si se reproducirá una playlist o una única canción. En el caso de ser una playlist, habrá
que pasarle un array con las canciones a reproducir y el índice de la canción que se reproducirá primero.
*/
Player.setType= function(songList,index){
  this.playlist.array = songList;
  this.playlist.index = index;
  if(songList=='null'){
    this.isPlaylist=false;
  }else{
    this.isPlaylist=true;
  }
}
/*Esta función nos servirá para reproducir una canción. Para reproducir cualquier canción, le pasamos
todos los datos de la canción para poder guardarlos en el objeto info que tenemos almacenado dentro del
objeto Player.
*/
Player.playSong = function(imagepath,title,artist,idartist,album,url,idsong,idalbum){
  if(typeof this.audio == 'object'){
    this.audio.pause();
    this.audio.setAttribute("src",url);
  }else{
    this.audio.setAttribute('src',url);
    this.audio.setAttribute('id','audio');
    this.audio.setAttribute('autoplay','autoplay');

  }
  this.isPlaying=true;
  this.info.cancionimg = imagepath;
  this.info.cancion= title;
  this.info.artista=artist;
  this.info.idartista=idartist;
  this.info.album=album;
  this.info.idalbum = idalbum;
  this.info.url=url;
  this.info.idcancion=idsong;
  this.audio.play();
}
/*Esta función nos permite pausar el sonido.
*/
Player.pauseSong=function(){
  this.audio.pause();
}
/*Esta función nos permite volver a reproducir la canción desde donde se había quedado.
*/
Player.resumeSong=function(){
  this.audio.play();
}
/*Creamos un eventListener para cada vez que se pone a reproducir una canción. De esta manera,
cada vez que se pone a reproducir una canción y no estamos en el reproductor, añade el footer para
que se vea la información del reproductor básico, y si estamos en el reproductor, volvemos a realizar el cambio
a reproductor para que se actualice la información.
*/
Player.audio.addEventListener('playing', function(e){
  if(document.getElementById("detalle_id_con") == null && document.getElementById("detalle_id_sin")==null){
    Paginas.añadeFooter(Player.info.cancionimg,Player.info.artista,Player.info.album, Player.info.cancion);
  }else{
    Paginas.cambiaAReproductor();
  }
  Paginas.comienzaAGirar();
}, false);
/*Creamos un eventListener para cuando se pause la canción. Hay que tener en cuenta que al finalizar una
canción, ésta también cuenta como pausa.
Lo que haremos al pausar una canción será hacer que las imágenes tanto del reproductor como del footer
dejen de dar vueltas, que es lo que conseguimos al llamar a la función paraDeGirar del objeto Paginas.
También ponemos el isPlaying a false.
*/
Player.audio.addEventListener('pause', function(e){
  Player.isPlaying = false;
  Paginas.paraDeGirar();
}, false);
/*Creamos un eventListener para cuando acaba una canción, lo que haremos será hacer que paren de girar
las imágenes tanto del footer como del reproductor y guardamos isPlaying como false.
*/
Player.audio.addEventListener('ended', function(e){
  Paginas.paraDeGirar();
  Player.isPlaying = false;
if(Player.isPlaylist){
  Player.nextSong();
}
}, false);
/*Esta función nos permite reproducir la siguiente canción. Esto sólo tiene sentido al tratarse
de una playlist, motivo por el que es tan necesario guardar el isPlaylist que se ha guardado en el setType.
Aqui se controla también cuál ha de ser la siguiente canción en el caso de tratarse de reproduccion en bucle o
en aleatorio.
*/
Player.nextSong = function(){
  if(this.isPlaylist&&!this.isRand){
    if(parseInt(this.playlist.index)+1 > this.playlist.array.length-1&& this.isLoop){
      this.playlist.index = 0;
      Player.playSong(this.playlist.array[this.playlist.index].imgurl,this.playlist.array[this.playlist.index].name,this.playlist.array[this.playlist.index].artist,this.playlist.array[this.playlist.index].idartist,this.playlist.array[this.playlist.index].album,this.playlist.array[this.playlist.index].url,this.playlist.array[this.playlist.index].id,this.playlist.array[this.playlist.index].idalbum);

    }else{
      if(!(parseInt(this.playlist.index)+1 > this.playlist.array.length-1)){
        this.playlist.index++;
        Player.playSong(this.playlist.array[this.playlist.index].imgurl,this.playlist.array[this.playlist.index].name,this.playlist.array[this.playlist.index].artist,this.playlist.array[this.playlist.index].idartist,this.playlist.array[this.playlist.index].album,this.playlist.array[this.playlist.index].url,this.playlist.array[this.playlist.index].id,this.playlist.array[this.playlist.index].idalbum);
      }
    }
  }else if(this.isRand && this.isPlaylist){
    do{
      var rand = Math.floor((Math.random() * this.playlist.array.length));
    }while(this.playlist.index == rand);
      this.playlist.index = rand;
    Player.playSong(this.playlist.array[this.playlist.index].imgurl,this.playlist.array[this.playlist.index].name,this.playlist.array[this.playlist.index].artist,this.playlist.array[this.playlist.index].idartist,this.playlist.array[this.playlist.index].album,this.playlist.array[this.playlist.index].url,this.playlist.array[this.playlist.index].id,this.playlist.array[this.playlist.index].idalbum);
  }
}
/*Esta función nos permite ir a la canción anterior. Esto únicamente tiene sentido al tratarse de la reproducción
de una playlist. El aleatorio no se tiene en cuenta y simplemente salta al anterior y el bucle tampoco se tiene en
cuenta, de manera que si te encuentras en la primera canción y vas a la anterior, se va a la última canción.
*/
Player.previousSong = function(){
  if(this.isPlaylist){
    //Atrasamos el indice de reproduccion actual
    if(parseInt(this.playlist.index)-1 < 0){
      this.playlist.index = this.playlist.array.length-1;
    }else{
      this.playlist.index--;
    }
    Player.playSong(this.playlist.array[this.playlist.index].imgurl,this.playlist.array[this.playlist.index].name,this.playlist.array[this.playlist.index].artist,this.playlist.array[this.playlist.index].idartist,this.playlist.array[this.playlist.index].album,this.playlist.array[this.playlist.index].url,this.playlist.array[this.playlist.index].id,this.playlist.array[this.playlist.index].idalbum);
  }
}
/***********************************************************************************
**********************LAYOUT********************************************************
***********************************************************************************/
/*Escribimos el título de la página en la que nos encontramos, en un principio
esta página será la de recomendados, por lo tanto lo definimos cómo recomendados,
ya sea por el top de canciones de Spotify o por recomendados a partir de la información
del usuario que tengamos almacenada.*/
var TituloPagina = document.createElement('span');
TituloPagina.setAttribute("id","TituloMenu");
TituloPagina.setAttribute("class","mdl-layout-title");
TituloPagina.innerHTML = "recomendados";

/*Añadimos el título que acababamos de definir en un div, de manera que este permitirá
que se vea correctamente.*/
var divTitulo = document.createElement('div');
divTitulo.setAttribute("class","mdl-layout__header-row");
divTitulo.appendChild(TituloPagina);

/*Creamos dentro de la página las posibilidades que nos ofrece ésta. Inicialmente no
se verán estas posibilidades ya que únicamente aparecerán en búsqueda y nos permitirán escoger
entre canciones, albumes y artistas.*/
var NombreTab1 = document.createElement('a');
NombreTab1.setAttribute("href","#fixed-tab-1");
NombreTab1.setAttribute("class","mdl-layout__tab is-active");
NombreTab1.innerHTML = "Canciones";
/*Guardamos un array con los artistas escuchados y un array para los índices de los artistas. Esto será
muy útil para poder pasarselo a recomendaciones y encontrar las recomendaciones, que se hacen por artista.
Aqui únicamente se declara.*/
var num =[];
var arts = [];
/*Declaramos el segundo "tab" y le ponemos el nombre que toca.*/
var NombreTab2 = document.createElement('a');
NombreTab2.setAttribute("href","#fixed-tab-2");
NombreTab2.setAttribute("class","mdl-layout__tab");
NombreTab2.innerHTML = "Álbumes";
/*Hacemos lo mismo con el tercer "tab"*/
var NombreTab3 = document.createElement('a');
NombreTab3.setAttribute("href","#fixed-tab-3");
NombreTab3.setAttribute("class","mdl-layout__tab");
NombreTab3.innerHTML = "Artistas";

/*Juntamos estas tres posibilidades dentro de un div general para estos "Tabs".*/
var divTabs = document.createElement('div');
divTabs.setAttribute("id","divTabs");
divTabs.setAttribute("class","mdl-layout__tab-bar mdl-js-ripple-effect");
divTabs.appendChild(NombreTab1);
divTabs.appendChild(NombreTab2);
divTabs.appendChild(NombreTab3);

/*Creamos la barra para búsquedas, accesible desde el icono de búsqueda*/
var busquedaI = document.createElement('i');
busquedaI.setAttribute("class","fa fa-search");

/*Metemos este icono dentro de un label para que pueda tener un feedback de botón.*/
var busquedaLabel = document.createElement('label');
busquedaLabel.setAttribute("class","mdl-button mdl-js-button mdl-button--icon");
busquedaLabel.setAttribute("for","fixed-header-drawer-exp");
busquedaLabel.appendChild(busquedaI);

/*Creamos el input donde el usuario escribirá lo que desea buscar.*/
var inputBusqueda = document.createElement('input');
inputBusqueda.setAttribute("class","mdl-textfield__input");
inputBusqueda.setAttribute("type","text");
inputBusqueda.setAttribute("name","sample");
inputBusqueda.setAttribute("id","fixed-header-drawer-exp");

/*Metemos ese input en un div para hacer que pueda expanderse o no.*/
var divInputBusqueda = document.createElement('div');
divInputBusqueda.setAttribute("class","mdl-textfield__expandable-holder");
divInputBusqueda.appendChild(inputBusqueda);

/*Hacemos otro div que contiene tanto el icono como el input.*/
var busquedaDiv = document.createElement('div');
busquedaDiv.setAttribute("class","mdl-textfield mdl-js-textfield mdl-textfield--expandable mdl-textfield--floating-label mdl-textfield--align-right");
busquedaDiv.appendChild(busquedaLabel);
busquedaDiv.appendChild(divInputBusqueda);

/*Este div únicamente nos permite guardar un cierto espacio entre distintos elementos.*/
var divEspaciador = document.createElement('div');
divEspaciador.setAttribute("class","mdl-layout-spacer");

/*Creamos el div Busqueda que nos permitirá guardar todo lo relacionado con la búsqueda.*/
var Busqueda = document.createElement('div');
Busqueda.setAttribute("class","mdl-layout__header-row");

//Añadimos a titulo el espacio y la busqueda, ya que este título es la cabecera superior.
divTitulo.appendChild(divEspaciador);
divTitulo.appendChild(busquedaDiv);

/* Creamos un header con el Título de la página y los "Tabs", de manera que a este
título le aplicaremos CSS y le podremos modificar color de fondo, etc. motivo por
el cual le definimos una id concreta.*/
var header = document.createElement('header');
header.setAttribute("id","cabecera");
header.setAttribute("class","mdl-layout__header");
header.appendChild(divTitulo);
header.appendChild(divTabs);

/*Creamos el menú lateral desde el que podremos escoger las distintas pantallas según
lo que le interese al usuario en cada instante.*/
var MenuLateralTitulo = document.createElement('span');
MenuLateralTitulo.setAttribute("class","mdl-layout-title_menu");
MenuLateralTitulo.innerHTML="SolFaMiDas";

/*Creamos las distintas pestañas en el menú lateral. La primera será la de recomendados.*/
var nav1 = document.createElement('div');
nav1.setAttribute("class","mdl-navigation__link");
nav1.innerHTML = "Recomendados";
/*La segunda pestaña que mostrará será la búsqueda*/
var nav2 = document.createElement('div');
nav2.setAttribute("class","mdl-navigation__link");
nav2.innerHTML = "Búsqueda";
/*La tercera pestaña que mostrará será la de playlists*/
var nav3 = document.createElement('div');
nav3.setAttribute("class","mdl-navigation__link");
nav3.innerHTML = "Playlists";
/*La cuarta pestaña que mostrará será el reproductor*/
var nav4 = document.createElement('div');
nav4.setAttribute("class","mdl-navigation__link");
nav4.innerHTML = "Reproductor";

/*Guardamos todas estas pestañas en un nav que nos permitirá navegar entre todas las navs.*/
var navigation = document.createElement('nav');
navigation.setAttribute("class","mdl-navigation");
navigation.appendChild(nav1);
navigation.appendChild(nav2);
navigation.appendChild(nav3);
navigation.appendChild(nav4);

/*Menú lateral con todo su contenido.*/
var MenuLateral = document.createElement('div');
MenuLateral.setAttribute("id","drawer");
MenuLateral.setAttribute("class","mdl-layout__drawer");
MenuLateral.appendChild(MenuLateralTitulo);
MenuLateral.appendChild(navigation);

/*Contenido del primer Tab de los de la barra superior*/
var contentTab1 = document.createElement('div');
contentTab1.setAttribute("class","page-content");

/*Añadimos a la seccion el contenido del primer Tab de los de la barra superior*/
var sectionTab1 = document.createElement('section');
sectionTab1.setAttribute("class","mdl-layout__tab-panel is-active");
sectionTab1.setAttribute("id","fixed-tab-1");
sectionTab1.appendChild(contentTab1);
/*Contenido del segundo Tab de los de la barra superior*/
var contentTab2 = document.createElement('div');
contentTab2.setAttribute("class","page-content");
contentTab2.innerHTML="<p>CONTENIDO RECOMENDADOS</p>";

/*Añadimos a la seccion el contenido del segundo Tab de los de la barra superior*/
var sectionTab2 = document.createElement('section');
sectionTab2.setAttribute("class","mdl-layout__tab-panel");
sectionTab2.setAttribute("id","fixed-tab-2");
sectionTab2.appendChild(contentTab2);

/*Contenido del tercer Tab de la barra superior.*/
var contentTab3 = document.createElement('div');
contentTab3.setAttribute("class","page-content");
contentTab3.innerHTML="<p>CONTENIDO PLAYLISTS</p>";

/*Añadimos a la seccion el contenido del tercer Tab de los de la barra superior*/
var sectionTab3 = document.createElement('section');
sectionTab3.setAttribute("class","mdl-layout__tab-panel");
sectionTab3.setAttribute("id","fixed-tab-3");
sectionTab3.appendChild(contentTab3);

/*Contenido de la ventana principal*/
var ventanaPrincipal = document.createElement('main');
ventanaPrincipal.setAttribute("class","mdl-layout__content");
ventanaPrincipal.appendChild(sectionTab1);
ventanaPrincipal.appendChild(sectionTab2);
ventanaPrincipal.appendChild(sectionTab3);

/*Imagen que se muestra en el footer, de manera que si no se cambia, mostrará
la imágen de finn y jake. Solo no va a cambiar en el caso de que no exista la imagen
de la cancion.*/
var footerCancion = document.createElement('img');
footerCancion.setAttribute("src","img/default.jpg");
footerCancion.setAttribute("height","80");
footerCancion.setAttribute("width","80");
footerCancion.setAttribute("float","left");

/*Añadimos la imagen a un div y le damos movimiento a éste. En algunos momentos se le podrá quitar
el movimiento como ya se ha comentado (al pausar la música).*/
var footerCancionDiv = document.createElement('div');
footerCancionDiv.setAttribute("id","imagenConMovimiento");
footerCancionDiv.appendChild(footerCancion);

/*Aqui añadimos el div con movimiento.*/
var footerCancionContenedor = document.createElement('div');
footerCancionContenedor.setAttribute("id","footerCancionContenedor");
footerCancionContenedor.appendChild(footerCancionDiv);

/*Guardamos la cancion, que tiene un valor inicial de cancion desconocida, a pesar de que luego este
valor se irá modicando.*/
var footerSong = document.createElement('span');
footerSong.setAttribute("class","mdl-layout-footer");
footerSong.setAttribute("id","Cancion");
footerSong.innerHTML = "Cancion desconocida";
footerSong.setAttribute("float","left");

/*Guardamos el artista, que tiene un valor inicial de Artista desconocido, a pesar de que luego este
valor se irá modicando.*/
var footerArtist = document.createElement('span');
footerArtist.setAttribute("class","mdl-layout-footer");
footerArtist.setAttribute("id","Artista");
footerArtist.innerHTML = "Artista desconocido";
footerArtist.setAttribute("float","left");

/*Guardamos el album con un valor inicial de Album desconocido, luego este valor se modificará
para cada canción.*/
var footerAlbum = document.createElement('span');
footerAlbum.setAttribute("class","mdl-layout-footer");
footerAlbum.setAttribute("id","Album");
footerAlbum.innerHTML = "Album desconodido";
footerAlbum.setAttribute("float","left");

/*Creamos el footer y le ponemos el layout de footer.*/
var footerDiv = document.createElement('div');
footerDiv.setAttribute("class","mdl-layout__footer");

/*Añadimos el icono de reproducción anterior para el footer.*/
var footerAnt = document.createElement('i');
footerAnt.setAttribute("class","fa fa-backward");

/*Añadimos el icono de reproducción anterior para el reproductor.*/
var Ant = document.createElement('i');
Ant.setAttribute("class","fa fa-backward");

/*Añadimos el icono de anterior del footer a un label para darle el feedback de botón.
*/
var footerAntLabel = document.createElement('label')
footerAntLabel.setAttribute("id","anteriorCancion");
footerAntLabel.setAttribute("class","mdl-button mdl-js-button mdl-button--icon");
footerAntLabel.appendChild(footerAnt);

/*Añadimos el icono de anterior del reproductor a un label para darle el feedback de botón.
*/
var AntLabel = document.createElement('label');
AntLabel.setAttribute("id","AntLabel");
AntLabel.setAttribute("class","mdl-button mdl-js-button mdl-button--icon");
AntLabel.appendChild(Ant);

/*Creamos el icono de random que únicamente está en el reproductor.*/
var Rand = document.createElement('i');
Rand.setAttribute("class","fa fa-random");

/*Añadimos el icono de random a un label para darle el feedback de botón.*/
var RandLabel = document.createElement('label')
RandLabel.setAttribute("id","RandLabel");
RandLabel.setAttribute("class","mdl-button mdl-js-button mdl-button--icon");
RandLabel.appendChild(Rand);

/*Creamos el icono de siguiente en el footer*/
var footerSig = document.createElement('i');
footerSig.setAttribute("class","fa fa-forward");

/*Creamos el icono de siguiente en el reproductor*/
var Sig = document.createElement('i');
Sig.setAttribute("class","fa fa-forward");

/*Añadimos el icono de siguiente del footer para darle feedback de botón*/
var footerSigLabel = document.createElement('label');
footerSigLabel.setAttribute("id","siguienteCancion");
footerSigLabel.setAttribute("class","mdl-button mdl-js-button mdl-button--icon");
footerSigLabel.appendChild(footerSig);

/*Añadimos el icono de siguiente del reproductor para darle feedback de botón*/
var SigLabel = document.createElement('label');
SigLabel.setAttribute("id","SigLabel");
SigLabel.setAttribute("class","mdl-button mdl-js-button mdl-button--icon");
SigLabel.appendChild(Sig);
SigLabel.style.marginLeft = "50px";

/*Creamos el icono de bucle que únicamente se encontrará en el reproductor.*/
var Bucle = document.createElement('i');
Bucle.setAttribute("class","fa fa-refresh");

/*Añadimos el icono de bucle a un label para darle feedback de botón*/
var BucleLabel = document.createElement('label');
BucleLabel.setAttribute("id","RandLabel");
BucleLabel.setAttribute("class","mdl-button mdl-js-button mdl-button--icon");
BucleLabel.appendChild(Bucle);
BucleLabel.style.marginLeft = "50px";

/*Cabecera, superior, únicamente se le da un cierto aspecto y se añaden elementos.*/
var cabecera = document.createElement('div');
cabecera.setAttribute("class","mdl-layout mdl-js-layout mdl-layout--fixed-header mdl-layout--fixed-drawer mdl-layout--fixed-tabs");
cabecera.appendChild(header);
cabecera.appendChild(MenuLateral);
cabecera.appendChild(ventanaPrincipal);
cabecera.appendChild(footerDiv);
cabecera.appendChild(Player.audio);
//En el reproductor, muestra el nombre del album
var DetalleAlbum = document.createElement('p');
DetalleAlbum.setAttribute("id","letraDetalle");
//En el reproductor, muestra el nombre de la canción
var DetalleCancion = document.createElement('p');
DetalleCancion.setAttribute("id","letraDetalle");
//En el reproductor, muestra el nombre del artista
var DetalleArtista = document.createElement('p');
DetalleArtista.setAttribute("id","letraDetalle");

/*Crea el icono de favoritos, al que únicamente se puede acceder desde el reproductor.*/
var favoritosI = document.createElement('i');
favoritosI.setAttribute("id","favoritos")
favoritosI.setAttribute("class","fa fa-heart");

/*Añade el icono de favoritos a un label para darle el feedback de botón.*/
var favoritosLabel = document.createElement('label');
favoritosLabel.setAttribute("id","favLabel");
favoritosLabel.setAttribute("class","mdl-button mdl-js-button mdl-button--icon");
favoritosLabel.appendChild(favoritosI);

/*Crea el icono de crear playlist, que únicamente se encuentra dentro de las playlists.*/
var añadirPlaylist = document.createElement('i');
añadirPlaylist.setAttribute("class","fa fa-plus");

/*Añade el icono de playlists a un div para darle feedback de botón.*/
var addPlaylistLabel = document.createElement('div');
addPlaylistLabel.appendChild(añadirPlaylist);
addPlaylistLabel.setAttribute("class","mdl-button mdl-js-button mdl-button--icon");
addPlaylistLabel.setAttribute("id","addPlaylistLabel");

/*Creamos un header para la playlist en el que irá el nombre de la playlist.*/
var PlaylistH3 = document.createElement('th');
PlaylistH3.setAttribute("class","mdl-data-table__cell--non-numeric");
PlaylistH3.innerHTML="Nombre de la Playlist";

/*Creamos un header para la playlist en el que irá el número de canciones de la playlist.*/
var PlaylistH4 = document.createElement('th');
PlaylistH4.innerHTML="Número de canciones";

/*Creamos un header para la playlist en el que irá la opción de eliminar la playlist*/
var PlaylistH1 = document.createElement('th');
PlaylistH1.innerHTML="Eliminar playlist";

/*Creamos un header para la playlist en el que irá la imágen de la primera canción de la playlist. Si no tiene
canciones se le asigna la imagen de jake el perro y finn el humano.*/
var PlaylistH2 = document.createElement('th');
PlaylistH2.innerHTML="Imagenes";

/*Creamos un head para el table que contiene los th anteriormente explicados.*/
var PlaylistHead = document.createElement('thead');
PlaylistHead.appendChild(PlaylistH1);
PlaylistHead.appendChild(PlaylistH2);
PlaylistHead.appendChild(PlaylistH3);
PlaylistHead.appendChild(PlaylistH4);

/*Creamos el body de la tabla, que se irá modificando desde las funciones abajo definidas.*/
var playlistbody = document.createElement('tbody');

/*Creamos el playlist, donde irá el body de la tabla y el head de la misma.*/
var playlist = document.createElement('table');
playlist.setAttribute("class","mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp");
playlist.appendChild(PlaylistHead);
playlist.appendChild(playlistbody);

/*Creamos un header para el detalle de la playlist en el que incluimos cancion.*/
var DetallePlaylistH1 = document.createElement('th');
DetallePlaylistH1.setAttribute("class","mdl-data-table__cell--non-numeric");
DetallePlaylistH1.innerHTML="Cancion";

/*Creamos un th para el detalle de la playlist en el que incluimos Artista.*/
var DetallePlaylistH3 = document.createElement('th');
DetallePlaylistH3.innerHTML="Artista";

/*Creamos un th para el detalle de la playlist en el que incluimos Album.*/
var DetallePlaylistH2 = document.createElement('th');
DetallePlaylistH2.innerHTML="Album";

/*Creamos un thead en el que le incluimos los títulos de la tabla del detalle de playlist.*/
var DetallePlaylistHead = document.createElement('thead');
DetallePlaylistHead.appendChild(DetallePlaylistH1);
DetallePlaylistHead.appendChild(DetallePlaylistH2);
DetallePlaylistHead.appendChild(DetallePlaylistH3);

/*Creamos el body para la tabla de detalle de playlist, que es donde irán listadas las canciones
que pertenecen a una playlist.*/
var DetallePlaylistBody = document.createElement('tbody');

/*Creamos la tabla para mostrar el detalle de la playlist.*/
var DetallePlaylist = document.createElement('table');
DetallePlaylist.setAttribute("class","mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp");
DetallePlaylist.appendChild(DetallePlaylistHead);
DetallePlaylist.appendChild(DetallePlaylistBody);

/*Creamos el header, que sólo tendrá uno, para la tabla que listará las playlists.*/
var listadoPlaylistH1 = document.createElement('th');
listadoPlaylistH1.setAttribute("align","left");
listadoPlaylistH1.innerHTML="¿A qué playlist deseas añadir la canción?";

/*Le ponemos un thead*/
var listadoPlaylistHead = document.createElement('thead');
listadoPlaylistHead.appendChild(listadoPlaylistH1);

/*Creamos el body para más adelante poder añadir y eliminar filas.*/
var listadoPlaylistBody = document.createElement('tbody');

/*Creamos la tabla de listado de playlists como tal.*/
var listadoPlaylist = document.createElement('table');
listadoPlaylist.setAttribute("class","mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp");
listadoPlaylist.appendChild(listadoPlaylistHead);
listadoPlaylist.appendChild(listadoPlaylistBody);

/*Paginas será el objeto que nos permite trabajar con el Layout, ya sea para cambiar de una página a otra como los eventos de clic, etc.
Será desde este objeto desde donde se llamará también a Player y a Data.save().*/
var Paginas = new Object();
Paginas.PaginaPrincipal = cabecera;
Paginas.getPaginaPrincipal = function() {
  return this.PaginaPrincipal;
}

/*Esta función sirve para añadir cualquier tipo de imagen, es decir, que puede añadir tanto una imagen de un listado de imágen,
a saber la búsqueda, recomendados, etc, así como una imagen de detalle, como puede ser del reproductor, aunque no se añade la imagen de
las tablas ni la del footer.
Para poder añadir una imagen necesitamos disponer de toda la información de ésta, ya que al añadir la imagen creamos un evento que escucha
cuándo se hace clic sobre dicha imagen y al hacer clic (si la imagen hace referencia a una canción) reproducirá dicha canción y
para ello necesitamos tener toda la información de la canción.
*/
Paginas.añadeImagen = function(path,TituloCancion,Artista,idArtista,Album,tab,tipoImagen,id_name,url_cancion,idalbum){
  var titulo = document.createElement('div');
  titulo.setAttribute("class","mdl-card__title mdl-card--expand");

  var spanimage = document.createElement('span');
  spanimage.setAttribute("class","demo-card-image__filename");
  spanimage.innerHTML=TituloCancion;
  if(spanimage.innerHTML==" "){
    spanimage.innerHTML=Artista;
  }
  if(spanimage.innerHTML==" "){
    spanimage.innerHTML=Album;
  }
  var divimage = document.createElement('div');
  divimage.setAttribute("class","mdl-card__actions");
  divimage.appendChild(spanimage);

  var imagen = document.createElement('div');

  if(tipoImagen=="normal"){
    imagen.setAttribute("id",id_name);
    imagen.appendChild(titulo);
    imagen.appendChild(divimage);
    imagen.setAttribute("class","demo-card-image mdl-card mdl-shadow--2dp");
    imagen.style.background = "url("+path+") center / cover";
  }else{
    var a = document.createElement('img');
    a.setAttribute("src",path);
    a.style.width = "100%";
    a.style.position="relative";
    a.style.border= "2px solid grey";
    a.style.borderRadius = "800px";
    a.style.overflow = "hidden";
    a.style.minWidth = "100px";
    a.style.maxWidth = "300px";
      a.setAttribute("id",id_name);
    imagen.appendChild(a);
  }
  imagen.onclick = function(){
    if(TituloCancion != " "){
      if(tipoImagen=="normal"){
        Player.setType("null",0);
        Player.playSong(path,TituloCancion,Artista,idArtista,Album,url_cancion,id_name,idalbum);
        Paginas.añadeFooter(path,Artista,Album,TituloCancion);
      }
      var insert = imagen.id+"***"+TituloCancion+"***"+Artista+"***"+idArtista+"***"+Album+"***"+path+"***"+url_cancion+"***"+idalbum;
      var encontrado = 0;
      var donde=0;
      var num;
      for(var i =0; i<Data.cancionesEscuchadas.length; i++){
        var aux = Data.cancionesEscuchadas[i].split("***");
        if(aux[0] == imagen.id && encontrado!=1){
          num = parseInt(aux[5])+1;
          encontrado = 1;
          donde=i;
        }
      }
      if(encontrado == 0){
        insert+="***0";
        Data.cancionesEscuchadas.push(insert);
      }else{
        insert+="***"+num;
        Data.cancionesEscuchadas.splice(donde,1);
        Data.cancionesEscuchadas.push(insert);
      }
      Data.save();
    }else{
      if(Album!= " "){
        Paginas.cambiaADetalleAlbum(Album,idalbum,path);
      }else{
        Paginas.cambiaADetalleArtista(Artista,idArtista);
      }
    }
  }
  if(tipoImagen=="normal"){

    if(tab == 1){
      contentTab1.appendChild(imagen);
    }
    if(tab == 2){
      contentTab2.appendChild(imagen);
    }
    if(tab == 3){
      contentTab3.appendChild(imagen);
    }
  }else{
     contentTab1.appendChild(imagen);
  }
}

/*Esta función nos permite cambiar de la parte de la página en la que nos encontremos al detalle de la playlist.
*/
Paginas.cambiaADetallePlaylist = function(id_DetallePlaylist){
  document.getElementById('TituloMenu').innerHTML = "playlist "+id_DetallePlaylist;
  var split = id_DetallePlaylist.split("---");
  if(split.length>1){
    document.getElementById('TituloMenu').innerHTML = "playlist "+split[0];
    id_DetallePlaylist = split[0];
  }
  var numiteraciones = DetallePlaylistBody.childNodes.length;
  for(var i = 0; i<numiteraciones; i++){
    DetallePlaylistBody.removeChild(DetallePlaylistBody.childNodes[0]);
  }
  for(var i =0; i<Data.Playlists.length; i++){
    var todo = Data.Playlists[i].split("---");
    if(todo[0]==id_DetallePlaylist){
      if(todo.length>1){
        for(var j = 1; j<todo.length; j++){
          for(var z=0; z<Data.cancionesEscuchadas.length; z++){
            var split = Data.cancionesEscuchadas[z].split("***");
            if(todo[j]==split[0]){
              var cancionnombre = document.createElement('td');
              cancionnombre.setAttribute("class","mdl-data-table__cell--non-numeric");
              cancionnombre.innerHTML=split[1];

              var album = document.createElement('td');
              album.innerHTML=split[4];

              var artista = document.createElement('td');
              artista.innerHTML=split[2];

              var cancion = document.createElement('tr');
              cancion.appendChild(cancionnombre);
              cancion.appendChild(album);
              cancion.appendChild(artista);
              cancion.setAttribute("id",j-1);
              cancion.onclick = function(){
                var arrayplaylist = [];
                for(var i =0; i<Data.Playlists.length; i++){
                  var todo = Data.Playlists[i].split("---");
                  if(todo[0] == id_DetallePlaylist){
                    for(var j = 1; j<todo.length; j++){
                      for(var z=0; z<Data.cancionesEscuchadas.length; z++){
                        var split = Data.cancionesEscuchadas[z].split("***");
                        if(todo[j]==split[0]){
                          var song = new Object();
                          //Añadimos los datos a song
                          song.id = split[0];
                          song.name = split[1];
                          song.artist = split[2];
                          song.idartist = split[3];
                          song.album = split[4];
                          song.imgurl = split[5];
                          song.url = split[6];
                          song.idalbum = split[7];
                          arrayplaylist.push(song);
                        }
                      }
                    }
                  }
                }
                Player.setType(arrayplaylist,this.id);
                Player.playSong(arrayplaylist[this.id].imgurl,arrayplaylist[this.id].name,arrayplaylist[this.id].artist,arrayplaylist[this.id].idartist,arrayplaylist[this.id].album,arrayplaylist[this.id].url,arrayplaylist[this.id].id,arrayplaylist[this.id].idalbum);
                Paginas.añadeFooter(arrayplaylist[this.id].imgurl,arrayplaylist[this.id].artist,arrayplaylist[this.id].album,arrayplaylist[this.id].name);
              }
              DetallePlaylistBody.appendChild(cancion);
            }
          }
        }
      }else{
        var a = document.createElement('p');
        a.innerHTML="Esta playlist no tiene canciones";
        contentTab1.appendChild(a);
      }
    }
  }
  var numiteraciones = contentTab1.childNodes.length;
  for(var i = 0; i<numiteraciones; i++){
    contentTab1.removeChild(contentTab1.childNodes[0]);
  }
  sectionTab1.setAttribute("class","mdl-layout__tab-panel is-active");
  contentTab1.appendChild(DetallePlaylist);
  if(Player.isPlaying){
    Paginas.añadeFooter(Player.info.cancionimg, Player.info.artista, Player.info.album,Player.info.cancion);
  }
}

/*Esta función nos permite eliminar las playlists que se muestran y a su vez eliminar una playlist en concreto.
*/
Paginas.eliminarPlaylist = function(id_Playlist){
  for(var it=0; it<Data.Playlists.length; it++){
    if(Data.Playlists[it] == id_Playlist){
      Data.Playlists.splice(it,1);
      Data.save();
    }
  }
  for(var it=0; it<playlistbody.childNodes.length; it++){
    if(playlistbody.childNodes[it].id == id_Playlist){
      playlistbody.removeChild(playlistbody.childNodes[it]);
    }
  }
  Paginas.cambiaAPlaylist();
}

/*Esta función nos permite añadir una playlist en el listado de playlists
*/
Paginas.añadelistadoPlaylist = function(){
  numiteraciones = listadoPlaylistBody.childNodes.length;
  for(var i = 0; i<numiteraciones; i++){
    listadoPlaylistBody.removeChild(listadoPlaylistBody.childNodes[0]);
  }
  for(var it = 0; it<Data.Playlists.length; it++){
    var playlistnombre = document.createElement('td');
    playlistnombre.setAttribute("class","mdl-data-table__cell--non-numeric");
    var sp = Data.Playlists[it].split("---");
    playlistnombre.innerHTML=sp[0];
    playlistnombre.onclick = function(){
      //Comprobamos que en la playlist, no tengamos ya esta canción.
        //Buscamos la playlist dentro de Data.
        var troba = 0;
        var hacambiado = 0;
        for(var i = 0; i<Data.Playlists.length; i++){
          troba=0;
          var sp = Data.Playlists[i].split("---");
          if(sp[0]==this.innerHTML){
            var pl = Data.Playlists[i].split("---");
            for(var j = 0; j<pl.length; j++){
              if(pl[j]==Player.info.cancion){
                troba=1;
              }
            }
            if(troba==0&&hacambiado ==0){
              var insert = Data.Playlists[i]+"---"+Player.info.idcancion;
              Data.Playlists.splice(i,1);
              Data.Playlists.push(insert);
              Data.save();
              hacambiado = 1;
            }
          }
        }
        Paginas.cambiaAReproductor();
    }
    var playlist = document.createElement('tr');
    playlist.appendChild(playlistnombre);
    playlist.setAttribute("id",Data.Playlists[it]);
    listadoPlaylistBody.appendChild(playlist);
  }
}

/*Esta función nos permite añadir una Playlist.
*/
Paginas.añadePlaylist = function(id_Playlist){
  var split = id_Playlist.split("---");
  var inneridplaylist;
  var innernumcanciones;
    if(split.length>1){
      inneridplaylist = split[0];
      innernumcanciones = parseInt(parseInt(split.length)-1);
    }else{
      inneridplaylist = id_Playlist;
      innernumcanciones = 0;
    }
    var playlistnombre = document.createElement('td');
    playlistnombre.setAttribute("class","mdl-data-table__cell--non-numeric");
    playlistnombre.innerHTML=inneridplaylist;
    playlistnombre.onclick = function(){
        Paginas.cambiaADetallePlaylist(id_Playlist);
    }
    var playlistnum = document.createElement('td');
    playlistnum.innerHTML=innernumcanciones;
    playlistnum.onclick = function(){
        Paginas.cambiaADetallePlaylist(id_Playlist);
    }
    var playlistimagen = document.createElement('td');
    var img = document.createElement('img');
    if(split.length>1){
      for(var t =0; t<Data.cancionesEscuchadas.length; t++){
        var sp2 = Data.cancionesEscuchadas[t].split("***");
        if(sp2[0]==split[1]){
          img.setAttribute("src",sp2[5]);
          img.style.maxWidth ="40px";
          img.style.marginTop= "-10px";
          img.style.border= "1px solid grey";
          img.style.borderRadius = "800px";
          img.style.overflow = "hidden";
          playlistimagen.appendChild(img);
        }
      }
    }else{
      img.setAttribute("src","img/default.jpg");
      img.style.maxWidth ="40px";
      img.style.marginTop= "-10px";
      img.style.border= "1px solid grey";
      img.style.borderRadius = "800px";
      img.style.overflow = "hidden";
      playlistimagen.appendChild(img);
    }
    playlistimagen.onclick = function() {
      Paginas.cambiaADetallePlaylist(id_Playlist);
    }

    var playlistimageneliminar = document.createElement('td');
    var imageneliminar = document.createElement('i');
    imageneliminar.setAttribute("class","fa fa-bomb");
    playlistimageneliminar.appendChild(imageneliminar);
    playlistimageneliminar.onclick = function(){
      Paginas.eliminarPlaylist(id_Playlist);
    }
    var playlist = document.createElement('tr');
    playlist.appendChild(playlistimageneliminar);
    playlist.appendChild(playlistimagen);
    playlist.appendChild(playlistnombre);
    playlist.appendChild(playlistnum);

    playlist.setAttribute("id",id_Playlist);
    playlistbody.appendChild(playlist);
}

/*Esta función nos permite eliminar el footer y todos sus componentes
*/
Paginas.eliminaFooter = function(){
  var it = cabecera.childNodes.length;
  var encontrado = 0;
  for(var j= 0; j<it; j++){
    if(encontrado==0){
      if(cabecera.childNodes[j].className == "mdl-layout__footer"){
        encontrado=1;
      }
    }
  }
  if(encontrado==1)  cabecera.removeChild(footerDiv);
  var n = footerDiv.childNodes.length;
  for(var i =0; i<n; i++){
    footerDiv.removeChild(footerDiv.childNodes[0]);
  }
}

/*Esta función hace que tanto la imagen del footer como la del reproductor paren de girar en el caso de que estuvieran girando.*/
Paginas.paraDeGirar= function(){
  if(document.getElementById("detalle_id_con")!=null){
    document.getElementById("detalle_id_con").setAttribute("id","detalle_id_sin");
  }
  if(document.getElementById("imagenConMovimiento")!=null){
    document.getElementById("imagenConMovimiento").setAttribute("id","imagenSinMovimiento");
  }
}

/*Esta función hace que tanto la imagen del reproductor como la imagen del footer comiencen a girar en el caso de que estuvieran paradas.*/
Paginas.comienzaAGirar = function(){
  if(document.getElementById("detalle_id_sin")!=null){
    document.getElementById("detalle_id_sin").setAttribute("id","detalle_id_con");
  }
  if(document.getElementById("imagenSinMovimiento")!=null){
    document.getElementById("imagenSinMovimiento").setAttribute("id","imagenConMovimiento");
  }
}

/*Esta función permite añadir el footer al layout y mostrarlo. Se mostrará un footer distinto dependiendo
de si se está reproduciendo una canción o una playlist.*/
Paginas.añadeFooter = function(path,Artista,Album,cancion){
  Paginas.eliminaFooter();
  if(Player.isPlaylist) footerDiv.appendChild(footerAntLabel);
  footerCancion.setAttribute("src",path);
  footerDiv.appendChild(footerCancionContenedor);
  if(Player.isPlaylist)  footerDiv.appendChild(footerSigLabel);
  footerDiv.appendChild(footerSong);
  footerDiv.appendChild(footerArtist);
  footerDiv.appendChild(footerAlbum);

  footerSong.innerHTML = cancion.substring(0,30);
  if(cancion.length>30){
    footerSong.innerHTML += "...";
  }
  footerArtist.innerHTML=Artista.substring(0,30);
  if(Artista.length>30){
    footerArtist.innerHTML += "...";
  }
  footerAlbum.innerHTML=Album.substring(0,30);
  if(Album.length>30){
    footerAlbum.innerHTML += "...";
  }
  cabecera.appendChild(footerDiv);
}

/*Esta función nos permite cambiar a la página de los más escuchados en el caso de no tener información del
usuario o a la de recomendaciones si ya tenemos información de éste.*/
Paginas.cambiaAPrincipal = function(){
  document.getElementById('TituloMenu').innerHTML = "recomendados";
  drawer.setAttribute("class","mdl-layout__drawer");
  if(document.body.querySelector('.mdl-layout__obfuscator.is-visible')!= null){
    document.body.querySelector('.mdl-layout__obfuscator.is-visible').setAttribute("class","mdl-layout__obfuscator");
  }
  if(document.body.querySelector('.mdl-layout__tab-bar-container')!= null){
      document.body.querySelector('.mdl-layout__tab-bar-container').setAttribute("class","mdl-layout__tab-bar-container-nope");
  }
  var numiteraciones = contentTab1.childNodes.length;
  for(var i = 0; i<numiteraciones; i++){
    contentTab1.removeChild(contentTab1.childNodes[0]);
  }
  numiteraciones = contentTab2.childNodes.length;
  for(var i = 0; i<numiteraciones; i++){
    contentTab2.removeChild(contentTab2.childNodes[0]);
  }
  numiteraciones = contentTab3.childNodes.length;
  for(var i = 0; i<numiteraciones; i++){
    contentTab3.removeChild(contentTab3.childNodes[0]);
  }
  if(Data.cancionesEscuchadas.length==0){
    var recomendados = musicRecommender.top100Spotify();
    for(var i =0; i<recomendados.length;i++){
      Paginas.añadeImagen(recomendados[i].imagesAlbum, recomendados[i].name, recomendados[i].nameArtist,recomendados[i].idArtist, recomendados[i].nameAlbum, 1, "normal",recomendados[i].id, recomendados[i].preview_url,recomendados[i].idAlbum);
    }
  }else{
    var encuentra =0;
    for(var i=0; i<Data.cancionesEscuchadas.length;i++){
      encuentra=0;
      var aux = Data.cancionesEscuchadas[i].split("***");
      for(var j=0; j<arts.length; j++){
        if(arts[j]==aux[3]){
          encuentra=1;
          arts.splice(j,1);
          var n = parseInt(aux[5]);
          n += num[j];
          n+=1;
          num.splice(j,1);
          arts.push(aux[3]);
          num.push(n);
        }
      }
      if(encuentra==0){
        arts.push(aux[3]);
        var n = parseInt(aux[5]);
        n=n+1;
        num.push(n);
      }
    }
    var fin = [];
    if(arts.length>10){
        for(var i =0; i<10; i++){
          fin[i]=arts[i];
        }
    }else{
      fin = arts;
    }
    var recomended = musicRecommender.recommended(fin);
    for(var i = 0; i<recomended.length; i++){
      Paginas.añadeImagen(recomended[i].imagesAlbum,recomended[i].name,recomended[i].nameArtista,recomended[i].idArtista,recomended[i].nameAlbum,1,"normal",recomended[i].id, recomended[i].preview_url,recomended[i].idAlbum);
    }
  }
  if(Player.isPlaying){
    Paginas.añadeFooter(Player.info.cancionimg, Player.info.artista, Player.info.album, Player.info.cancion);
  }
}

/*Esta función nos permite cambiar a la pestaña de búsqueda, mostrando que no se ha realizado ninguna búsqueda en el
caso de que se llegue aqui desde el navegador lateral o el resultado de la búsqueda en el caso de llegar desde la realización de
una búsqueda.
*/
Paginas.cambiaABusqueda = function(notfound){
  //Cambiamos de titulo la página
  document.getElementById('TituloMenu').innerHTML = "búsqueda";
  //Ocultamos el menú desplegable lateral
  drawer.setAttribute("class","mdl-layout__drawer");
  if(document.body.querySelector('.mdl-layout__obfuscator.is-visible')!= null){
    document.body.querySelector('.mdl-layout__obfuscator.is-visible').setAttribute("class","mdl-layout__obfuscator");
  }
  if(document.body.querySelector('.mdl-layout__tab-bar-container-nope')!= null){
      document.body.querySelector('.mdl-layout__tab-bar-container-nope').setAttribute("class","mdl-layout__tab-bar-container");
  }
  //Borramos los contenidos de los tabs
  var numiteraciones = contentTab1.childNodes.length;
  for(var i = 0; i<numiteraciones; i++){
    contentTab1.removeChild(contentTab1.childNodes[0]);
  }
  numiteraciones = contentTab2.childNodes.length;
  for(var i = 0; i<numiteraciones; i++){
    contentTab2.removeChild(contentTab2.childNodes[0]);
  }
  numiteraciones = contentTab3.childNodes.length;
  for(var i = 0; i<numiteraciones; i++){
    contentTab3.removeChild(contentTab3.childNodes[0]);
  }
  //artista
  var busqueda = musicRecommender.searchArtist(notfound);
  for(i=0;i<busqueda.length;i++){
    Paginas.añadeImagen(busqueda[i].image," ",busqueda[i].name,busqueda[i].id," ",3,"normal"," ", " "," ");
  }
  if(busqueda.length==0 && notfound!= " "){
    contentTab3.innerHTML = "No se han encontrado artistas para "+notfound;
  }
  //album
  busqueda = musicRecommender.searchAlbum(notfound);
  for(i=0;i<busqueda.length;i++){
    Paginas.añadeImagen(busqueda[i].imagen," "," "," ",busqueda[i].name,2,"normal"," ", " ",busqueda[i].id);
  }
  if(busqueda.length==0 && notfound!= " "){
    contentTab2.innerHTML = "No se han encontrado álbumes para "+notfound;
  }
  //cancion
  busqueda = musicRecommender.searchTrack(notfound);
  for(i=0;i<busqueda.length;i++){
    Paginas.añadeImagen(busqueda[i].imagesAlbum,busqueda[i].name,busqueda[i].nameArtista,busqueda[i].idArtista,busqueda[i].nameAlbum,1,"normal",busqueda[i].id, busqueda[i].preview_url,busqueda[i].idAlbum);
  }
  if(busqueda.length==0 && notfound!= " "){
    contentTab1.innerHTML = "No se han encontrado canciones para "+notfound;
  }
  if(notfound==" "){
    sectionTab1.setAttribute("class","mdl-layout__tab-panel is-active");
    sectionTab2.setAttribute("class","mdl-layout__tab-panel");
    sectionTab3.setAttribute("class","mdl-layout__tab-panel");
    var no1= document.createElement('p');
    no1.innerHTML="Todavía no se ha realizado ninguna consulta";
    contentTab1.appendChild(no1);
    var no2= document.createElement('p');
    no2.innerHTML="Todavía no se ha realizado ninguna consulta";
    contentTab2.appendChild(no2);
    var no3= document.createElement('p');
    no3.innerHTML="Todavía no se ha realizado ninguna consulta";
    contentTab3.appendChild(no3);
  }
  if(Player.isPlaying){
    Paginas.añadeFooter(Player.info.cancionimg, Player.info.artista, Player.info.album, Player.info.cancion);
  }
}

/*Esta función nos permite cambiar a la "página" en la que se escoge una playlist al añadir una canción a la playlist.
*/
Paginas.cambiaAEscogePlaylist = function(){
  var numiteraciones = contentTab1.childNodes.length;
  for(var i = 0; i<numiteraciones; i++){
    contentTab1.removeChild(contentTab1.childNodes[0]);
  }
  numiteraciones = contentTab2.childNodes.length;
  for(var i = 0; i<numiteraciones; i++){
    contentTab2.removeChild(contentTab2.childNodes[0]);
  }
  numiteraciones = contentTab3.childNodes.length;
  for(var i = 0; i<numiteraciones; i++){
    contentTab3.removeChild(contentTab3.childNodes[0]);
  }
  sectionTab1.setAttribute("class","mdl-layout__tab-panel is-active");
  var prueba = document.createElement('div');
  if(Data.Playlists.length>0){
      Paginas.añadelistadoPlaylist();
      contentTab1.appendChild(listadoPlaylist);
  }else{
    var nada = document.createElement('p');
    nada.innerHTML = "No existen playlists";
    contentTab1.appendChild(nada);
  }
  prueba.onclick=function(){
    Paginas.cambiaAReproductor();
  }
  if(Player.isPlaying){
    Paginas.añadeFooter(Player.info.cancionimg, Player.info.artista, Player.info.album, Player.info.cancion);
  }
}

/*Esta función pasa a mostrarnos las playlists del usuario.*/
Paginas.cambiaAPlaylist = function(){
  //Cambiamos de titulo la página
  document.getElementById('TituloMenu').innerHTML = "playlists";
  //Ocultamos el menú desplegable lateral
  drawer.setAttribute("class","mdl-layout__drawer");
  if(document.body.querySelector('.mdl-layout__obfuscator.is-visible')!= null){
    document.body.querySelector('.mdl-layout__obfuscator.is-visible').setAttribute("class","mdl-layout__obfuscator");
  }
  if(document.body.querySelector('.mdl-layout__tab-bar-container')!= null){
      document.body.querySelector('.mdl-layout__tab-bar-container').setAttribute("class","mdl-layout__tab-bar-container-nope");
  }
  //Borramos los contenidos de los tabs
  var numiteraciones = contentTab1.childNodes.length;
  for(var i = 0; i<numiteraciones; i++){
    contentTab1.removeChild(contentTab1.childNodes[0]);
  }
  numiteraciones = contentTab2.childNodes.length;
  for(var i = 0; i<numiteraciones; i++){
    contentTab2.removeChild(contentTab2.childNodes[0]);
  }
  numiteraciones = contentTab3.childNodes.length;
  for(var i = 0; i<numiteraciones; i++){
    contentTab3.removeChild(contentTab3.childNodes[0]);
  }
  sectionTab1.setAttribute("class","mdl-layout__tab-panel is-active");
  if(Data.Playlists.length==0){
    var aux = document.createElement('p');
    aux.innerHTML = "No existen playlists!";
    contentTab1.appendChild(aux);
    contentTab1.appendChild(addPlaylistLabel);
  }else{
    var num = playlistbody.childNodes.length;
    for(var i = 0; i<num; i++){
      playlistbody.removeChild(playlistbody.childNodes[0]);
    }
    for(var i =0; i<Data.Playlists.length; i++){
      Paginas.añadePlaylist(Data.Playlists[i]);
    }
    contentTab1.appendChild(playlist);
    contentTab1.appendChild(addPlaylistLabel);
  }
  if(Player.isPlaying){
    Paginas.añadeFooter(Player.info.cancionimg, Player.info.artista, Player.info.album, Player.info.cancion);
  }
}

/*Esta función permite crear una playlist.
*/
Paginas.cambiaACreaPlaylist = function(){
  document.getElementById('TituloMenu').innerHTML = "Creando Playlist...";
  var numiteraciones = contentTab1.childNodes.length;
  for(var i = 0; i<numiteraciones; i++){
    contentTab1.removeChild(contentTab1.childNodes[0]);
  }
  sectionTab1.setAttribute("class","mdl-layout__tab-panel is-active");
  var temporal = document.createElement('div');
  temporal.innerHTML="AQUI CREAREMOS UNA PLAYLIST";
  contentTab1.appendChild(temporal);
  if(Player.isPlaying){
    Paginas.añadeFooter(Player.info.cancionimg, Player.info.artista, Player.info.album, Player.info.cancion);
  }
}

/*Esta función permite mostrar el reproductor de la canción, desde el que se puede acceder a
los detalles de artista, album y cancion.
*/
Paginas.cambiaAReproductor = function(){
  var a = document.getElementById("audio");
  if(!Player.audio.paused){
    document.getElementById('TituloMenu').innerHTML = "Reproductor";
    drawer.setAttribute("class","mdl-layout__drawer");
    if(document.body.querySelector('.mdl-layout__obfuscator.is-visible')!= null){
      document.body.querySelector('.mdl-layout__obfuscator.is-visible').setAttribute("class","mdl-layout__obfuscator");
    }
    if(document.body.querySelector('.mdl-layout__tab-bar-container')!= null){
        document.body.querySelector('.mdl-layout__tab-bar-container').setAttribute("class","mdl-layout__tab-bar-container-nope");
    }
    Paginas.eliminaFooter();
    //Eliminamos el contenido de los tabs
    var numiteraciones = contentTab1.childNodes.length;
    for(var i = 0; i<numiteraciones; i++){
      contentTab1.removeChild(contentTab1.childNodes[0]);
    }
    numiteraciones = contentTab2.childNodes.length;
    for(var i = 0; i<numiteraciones; i++){
      contentTab2.removeChild(contentTab2.childNodes[0]);
    }
    numiteraciones = contentTab3.childNodes.length;
    for(var i = 0; i<numiteraciones; i++){
      contentTab3.removeChild(contentTab3.childNodes[0]);
    }
    //Una vez eliminado todo el contenido de los Tabs,
    //ponemos el primer Tab activo y le cargamos la info del detalle
    sectionTab1.setAttribute("class","mdl-layout__tab-panel is-active");
    DetalleAlbum.innerHTML="Album: "+Player.info.album;
    //Al clicar en el nombre del álbum, cambia a detalle del album.
    DetalleAlbum.onclick = function(){
      Paginas.cambiaADetalleAlbum(Player.info.album,Player.info.idalbum,Player.info.cancionimg);
    }
    DetalleCancion.innerHTML="Canción: "+Player.info.cancion;
    //Al clicar al nombre de la cancion, cambia a detalle de la canción.
    DetalleCancion.onclick = function(){
      Paginas.cambiaADetalleCancion(Player.info.cancion,Player.info.idcancion,Player.info.album, Player.info.artista);
    }
    DetalleArtista.innerHTML = "Artista: "+Player.info.artista;
    //Al clicar en el nombre del artista, cambia a detalle del artista.
    DetalleArtista.onclick = function(){
      Paginas.cambiaADetalleArtista(Player.info.artista, Player.info.idartista);
    }
    contentTab1.appendChild(DetalleArtista);
    contentTab1.appendChild(DetalleAlbum);
    contentTab1.appendChild(DetalleCancion);
    Paginas.añadeImagen(Player.info.cancionimg,Player.info.cancion,Player.info.artista,Player.info.idartista,Player.info.album,1,"detalle","detalle_id_con",Player.info.url,Player.info.idalbum);
    var labelContenedor = document.createElement('div');
    if(Player.isPlaylist){
      labelContenedor.appendChild(RandLabel);
      labelContenedor.appendChild(AntLabel);
    }
    labelContenedor.style.textAlign = "center";
    RandLabel.onclick = function(){
      if(Player.isRand){
        Rand.style.color = "black";
        Player.isRand = false;
      }
      else{
        Rand.style.color= "green";
        Player.isRand = true;
      }
    }
    AntLabel.onclick = function(){
      Player.previousSong();
    }
    labelContenedor.style.marginTop = "20px";
    labelContenedor.style.textAlign = "center";
    if(!Player.isPlaylist){
      favoritosLabel.style.marginLeft = "-8px";
    }else{
      favoritosLabel.style.marginLeft = "50px";
    }
    labelContenedor.appendChild(favoritosLabel);
    favoritosLabel.onclick = function(){
      Paginas.cambiaAEscogePlaylist();
    }
    if(Player.isPlaylist){
      labelContenedor.appendChild(SigLabel);
      labelContenedor.appendChild(BucleLabel);
    }
    SigLabel.onclick = function(){
      Player.nextSong();
    }
    BucleLabel.onclick = function(){
      if(Player.isLoop){
        Bucle.style.color = "black";
        Player.isLoop = false;
      }
      else{
        Bucle.style.color= "green";
        Player.isLoop = true;
      }
    }
    contentTab1.appendChild(labelContenedor);
    document.getElementById("detalle_id_con").onclick = function(){
      if(document.getElementById("detalle_id_sin")==null){
        var st = window.getComputedStyle(document.getElementById("detalle_id_con"), null);
        var tr = st.getPropertyValue("-webkit-transform") ||
                 st.getPropertyValue("-moz-transform") ||
                 st.getPropertyValue("-ms-transform") ||
                 st.getPropertyValue("-o-transform") ||
                 st.getPropertyValue("transform") ||
                 "FAIL";
        var values = tr.split('(')[1].split(')')[0].split(',');
        var angle = Math.round(Math.atan2(values[1], values[0]) * (180/Math.PI));
        document.getElementById("detalle_id_con").setAttribute("id","detalle_id_sin");
        document.getElementById("detalle_id_sin").style.transform = "rotate("+angle+"deg)";
        Player.pauseSong();

      }else{
        Player.resumeSong();
        document.getElementById("detalle_id_sin").setAttribute("id","detalle_id_con");
      }
    }
  }else{
    var numiteraciones = contentTab1.childNodes.length;
    for(var i = 0; i<numiteraciones; i++){
      contentTab1.removeChild(contentTab1.childNodes[0]);
    }
    numiteraciones = contentTab2.childNodes.length;
    for(var i = 0; i<numiteraciones; i++){
      contentTab2.removeChild(contentTab2.childNodes[0]);
    }
    numiteraciones = contentTab3.childNodes.length;
    for(var i = 0; i<numiteraciones; i++){
      contentTab3.removeChild(contentTab3.childNodes[0]);
    }
    sectionTab1.setAttribute("class","mdl-layout__tab-panel is-active");
    var a = document.createElement('p');
    a.innerHTML="No se está reproduciendo ninguna canción.";
    contentTab1.appendChild(a);
  }
}

/*Esta función nos permite mostrar el detalle de la canción.
*/
Paginas.cambiaADetalleCancion = function(cancion,idcancion,album, artista){
  document.getElementById('TituloMenu').innerHTML = "Detalle de la canción "+ cancion;
  if(document.body.querySelector('.mdl-layout__tab-bar-container')!= null){
      document.body.querySelector('.mdl-layout__tab-bar-container').setAttribute("class","mdl-layout__tab-bar-container-nope");
  }
  var numiteraciones = contentTab1.childNodes.length;
  for(var i = 0; i<numiteraciones; i++){
    contentTab1.removeChild(contentTab1.childNodes[0]);
  }
  numiteraciones = contentTab2.childNodes.length;
  for(var i = 0; i<numiteraciones; i++){
    contentTab2.removeChild(contentTab2.childNodes[0]);
  }
  numiteraciones = contentTab3.childNodes.length;
  for(var i = 0; i<numiteraciones; i++){
    contentTab3.removeChild(contentTab3.childNodes[0]);
  }
  sectionTab1.setAttribute("class","mdl-layout__tab-panel is-active");
  var temporal = document.createElement('p');
  temporal.innerHTML="La canción "+cancion + " pertenece al álbum "+album+ " del artista "+artista+".";
  contentTab1.appendChild(temporal);
  if(Player.isPlaying){
    Paginas.añadeFooter(Player.info.cancionimg, Player.info.artista, Player.info.album, Player.info.cancion);
  }
}

/*Esta función nos permite mostrar el detalle del artista.
*/
Paginas.cambiaADetalleArtista = function(artista,idartista){
  document.getElementById('TituloMenu').innerHTML = "Detalle del artista "+ artista;
  if(document.body.querySelector('.mdl-layout__tab-bar-container')!= null){
      document.body.querySelector('.mdl-layout__tab-bar-container').setAttribute("class","mdl-layout__tab-bar-container-nope");
  }
  var numiteraciones = contentTab1.childNodes.length;
  for(var i = 0; i<numiteraciones; i++){
    contentTab1.removeChild(contentTab1.childNodes[0]);
  }
  numiteraciones = contentTab2.childNodes.length;
  for(var i = 0; i<numiteraciones; i++){
    contentTab2.removeChild(contentTab2.childNodes[0]);
  }
  numiteraciones = contentTab3.childNodes.length;
  for(var i = 0; i<numiteraciones; i++){
    contentTab3.removeChild(contentTab3.childNodes[0]);
  }
  sectionTab1.setAttribute("class","mdl-layout__tab-panel is-active");
  var temporal = document.createElement('div');
  contentTab1.appendChild(temporal);
  var sea = musicRecommender.artistTopSongs(idartista);
  for(var i =0; i<sea.length; i++){
    Paginas.añadeImagen(sea[i].imagesAlbum,sea[i].name,sea[i].nameArtista,sea[i].idArtista,sea[i].nameAlbum, 1, "normal",sea[i].id, sea[i].preview_url,sea[i].idAlbum);
  }

  if(Player.isPlaying){
    Paginas.añadeFooter(Player.info.cancionimg, Player.info.artista, Player.info.album, Player.info.cancion);
  }
}

/*Esta función nos permite mostrar el detalle del álbum.
*/
Paginas.cambiaADetalleAlbum = function(album,idalbum,imagenAlbum){
  document.getElementById('TituloMenu').innerHTML = "Detalle del álbum "+ album;
  if(document.body.querySelector('.mdl-layout__tab-bar-container')!= null){
      document.body.querySelector('.mdl-layout__tab-bar-container').setAttribute("class","mdl-layout__tab-bar-container-nope");
  }
  var numiteraciones = contentTab1.childNodes.length;
  for(var i = 0; i<numiteraciones; i++){
    contentTab1.removeChild(contentTab1.childNodes[0]);
  }
  numiteraciones = contentTab2.childNodes.length;
  for(var i = 0; i<numiteraciones; i++){
    contentTab2.removeChild(contentTab2.childNodes[0]);
  }
  numiteraciones = contentTab3.childNodes.length;
  for(var i = 0; i<numiteraciones; i++){
    contentTab3.removeChild(contentTab3.childNodes[0]);
  }
  sectionTab1.setAttribute("class","mdl-layout__tab-panel is-active");
  if(Player.isPlaying){
    Paginas.añadeFooter(Player.info.cancionimg, Player.info.artista, Player.info.album, Player.info.cancion);
  }
  var canciones = musicRecommender.albumSongs(idalbum);
  for(var i =0; i<canciones.length; i++){
    Paginas.añadeImagen(imagenAlbum, canciones[i].name, canciones[i].nameArtista,canciones[i].idArtista, album,1,"normal",canciones[i].id,canciones[i].preview_url,idalbum);
  }
}
if(Data.cancionesEscuchadas.length==0){
  var recomendados = musicRecommender.top100Spotify();
  for(var i =0; i<recomendados.length;i++){
    Paginas.añadeImagen(recomendados[i].imagesAlbum, recomendados[i].name, recomendados[i].nameArtist,recomendados[i].idArtist, recomendados[i].nameAlbum, 1, "normal",recomendados[i].id, recomendados[i].preview_url,recomendados[i].idAlbum);
  }
}else{
  var encuentra =0;
  for(var i=0; i<Data.cancionesEscuchadas.length;i++){
    encuentra=0;
    var aux = Data.cancionesEscuchadas[i].split("***");
    for(var j=0; j<arts.length; j++){
      if(arts[j]==aux[3]){
        encuentra=1;
        arts.splice(j,1);
        var n = parseInt(aux[5]);
        n += num[j];
        n+=1;
        num.splice(j,1);
        arts.push(aux[3]);
        num.push(n);
      }
    }
    if(encuentra==0){
      arts.push(aux[3]);
      var n = parseInt(aux[5]);
      n=n+1;
      num.push(n);
    }
  }
  var fin = [];
  if(arts.length>10){
      for(var i =0; i<10; i++){
        fin[i]=arts[i];
      }
  }else{
    fin = arts;
  }
  var recomended = musicRecommender.recommended(fin);
  for(var i = 0; i<recomended.length; i++){
    Paginas.añadeImagen(recomended[i].imagesAlbum,recomended[i].name,recomended[i].nameArtista,recomended[i].idArtista,recomended[i].nameAlbum,1,"normal",recomended[i].id, recomended[i].preview_url,recomended[i].idAlbum);
  }
}

//Añadimos a body la primera página(recomendados.).
document.body.appendChild(Paginas.getPaginaPrincipal());

/*Cuando clican en recomendados en el menú lateral, cambia a recomendados*/
nav1.onclick = function(){
  Paginas.cambiaAPrincipal();
}

/*Cuando clican en búsqueda en el menú lateral, cambia a búsqueda*/
nav2.onclick = function(){
  Paginas.cambiaABusqueda(" ");
}

/*Cuando clican en playlist en el menú lateral, cambia a playlist*/
nav3.onclick = function(){
  Paginas.cambiaAPlaylist();
}

/*Cuando clican en reproductor en el menú lateral, cambia a reproductor*/
nav4.onclick = function(){
  Paginas.cambiaAReproductor();
}

/*Cuando clica en búsqueda, se hace visible el input de la búsqueda.*/
busquedaDiv.onclick = function(){
  document.body.querySelector('.mdl-textfield__input').style.width="100%";
}
/*Al pulsar enter mientras hace una búsqueda, esconde el input de búsqueda y te lleva a la página de búsqueda.*/
inputBusqueda.onkeypress = function(e){
  if(e.keyCode==13){
    Paginas.cambiaABusqueda(inputBusqueda.value);
    inputBusqueda.value="";
    document.body.querySelector('.mdl-textfield__input').style.width="0px";
  }
}

/*Al clicar en el icono de anterior te lleva a la canción anterior.*/
footerAntLabel.onclick = function(){
  Player.previousSong();
}

/*Al clicar en el icono de siguiente, te lleva a la siguiente canción.*/
footerSigLabel.onclick = function(){
  Player.nextSong();
}

/*Al clicar en la imagen que rota, si está sonando, se para y si no se estaba reproduciendo, sigue.*/
footerCancionDiv.onclick = function(){
  if(document.getElementById("imagenSinMovimiento")==null){
    var st = window.getComputedStyle(footerCancionDiv, null);
    var tr = st.getPropertyValue("-webkit-transform") ||
             st.getPropertyValue("-moz-transform") ||
             st.getPropertyValue("-ms-transform") ||
             st.getPropertyValue("-o-transform") ||
             st.getPropertyValue("transform") ||
             "FAIL";
    var values = tr.split('(')[1].split(')')[0].split(',');
    var angle = Math.round(Math.atan2(values[1], values[0]) * (180/Math.PI));
    footerCancionDiv.setAttribute("id","imagenSinMovimiento");
    footerCancionDiv.style.transform = "rotate("+angle+"deg)";
    Player.pauseSong();
  }else{
    footerCancionDiv.setAttribute("id","imagenConMovimiento");
    Player.resumeSong();
  }
}

/*Al clicar a añadir playlist, muestra un input donde escribir el nombre de la nueva playlist.*/
añadirPlaylist.onclick = function(){
  var titulo = document.createElement('p');
  titulo.innerHTML="Inserta el nombre de la nueva playlist:";
  titulo.style.marginLeft="35%";
  titulo.style.marginTop="10px";
  var nuevaplaylist=  document.createElement('input');
  nuevaplaylist.setAttribute('autofocus',"true");
  nuevaplaylist.setAttribute("type","text");
  nuevaplaylist.style.marginLeft="40%";
  nuevaplaylist.style.marginBottom="10px";
  nuevaplaylist.onkeypress= function(e){
      if(e.keyCode==13){
        var id = nuevaplaylist.value;
        Data.Playlists.push(id);
        Data.save();
        Paginas.añadePlaylist(nuevaplaylist.value);
        Paginas.cambiaAPlaylist();
    }
  }
  var nueva = document.createElement('div');
  nueva.setAttribute("id","creandoPlaylist");
  nueva.style.borderStyle= "solid";
  nueva.style.borderColor = colores[rand];
  nueva.appendChild(titulo);
  nueva.appendChild(nuevaplaylist);
  if(document.getElementById("creandoPlaylist")==undefined){
    contentTab1.appendChild(nueva);
  }else{
    nuevaplaylist.value = "";
  }
}

/*En el inicio, carga en playlists, todas las playlists guardadas en el navegador.*/
for(var i =0; i<Data.Playlists.length; i++){
  Paginas.añadePlaylist(Data.Playlists[i]);
}

/*Cambiamos los colores de los fondos para que sean random como se ha explicado anteriormente.*/
document.getElementById('cabecera').style.background= colores[rand];
document.getElementById('divTabs').style.background = colores[rand];
document.getElementById("drawer").style.background = "#2E2E2E";
document.getElementById("TituloMenu").style.color="white";
MenuLateralTitulo.style.color = "white";
MenuLateral.style.border = "0px";
footerDiv.style.background = colores[rand];
addPlaylistLabel.style.background=colores[rand];
favoritosLabel.style.background=colores[rand];
RandLabel.style.background=colores[rand];
SigLabel.style.background=colores[rand];
AntLabel.style.background=colores[rand];
BucleLabel.style.background=colores[rand];
