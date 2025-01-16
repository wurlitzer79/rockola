// Obtener parámetros de la URL
    const params = new URLSearchParams(window.location.search);
	const collectionId = params.get("id"); // Obtener el parámetro 'id'  
	const collectionName = params.get("name"); // Obtener el parámetro 'name'   
	
    const apiUrl = `https://archive.org/metadata/${collectionId}`;
    const songList = document.getElementById("songList");
    const audioPlayer = document.getElementById("audioPlayer");

    // Mostrar el valor en el título
	const huno = document.getElementById("titulo");
	if (huno) {
      huno.textContent = collectionName;
    } else {
      huno.textContent = "Rockola Virtual";
    }

    let playlist = []; // Lista de canciones
    let currentIndex = 0; // Índice de la canción actual

    // Obtener canciones de la API
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const files = data.files.filter(file => file.name.endsWith(".mp3")); // Filtrar solo archivos MP3

        if (files.length > 0) {
          songList.innerHTML = ""; // Limpiar lista

          files.forEach((file, index) => {
            const li = document.createElement("li");
            const button = document.createElement("button");
			//button.width = "100%";
            button.textContent = file.title || file.name; // Usar título o nombre del archivo
            button.onclick = () => playSong(index);
            li.appendChild(button);
            songList.appendChild(li);

            // Agregar canción a la playlist
            playlist.push({
              name: file.title || file.name,
              url: `https://archive.org/download/${collectionId}/${file.name}`
            });
          });
        } else {
          songList.innerHTML = "<li>No se encontraron canciones.</li>";
        }
      })
      .catch(error => {
        console.error("Error al cargar canciones:", error);
        songList.innerHTML = "<li>Error al cargar las canciones.</li>";
      });

    // Reproducir canción por índice
    function playSong(index) {
      currentIndex = index;
      audioPlayer.src = playlist[currentIndex].url;
	  songName.textContent = `Reproduciendo: ` + playlist[currentIndex].name;
      audioPlayer.play();
    }

    // Reproducir siguiente canción al finalizar
    audioPlayer.addEventListener("ended", () => {
      currentIndex = (currentIndex + 1) % playlist.length; // Avanzar y reiniciar al final
      playSong(currentIndex);
    });
	
	// Limpiar el nombre de la canción cuando se pausa la reproducción
	audioPlayer.addEventListener("pause", () => {
	  if (audioPlayer.currentTime !== audioPlayer.duration) {
		songName.textContent = `Reproduciendo: `; // Limpia el texto del nombre
	  }
	});