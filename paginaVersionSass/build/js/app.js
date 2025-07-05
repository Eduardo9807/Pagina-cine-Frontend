let todasLasPeliculas = [];
document.addEventListener('DOMContentLoaded', function(){
    obtenrJson()
    mostrarRecomendadas();
    iniciarCarrusel();
    mostrarTop10();
    // Eventos para botones de filtro
    document.querySelectorAll('.filtroPeliculas').forEach(boton => {
        boton.addEventListener('click', () => {
            document.querySelectorAll('.filtroPeliculas').forEach(b => b.classList.remove('active'));
            boton.classList.add('active');

            const genero = boton.dataset.genero;
            filtrarPeliculas(genero);
        });
    });
});

function obtenrJson(){
    //const contenedor = document.getElementById();

    console.log("probando")
    //Ruta de mi archivo json
    fetch('data/peliculas/cartelera.json')
    //creando nuestras promesas
    .then(responde => responde.json())
    .then(peliculas=>{
        todasLasPeliculas=peliculas;
        mostrarPeliculas(peliculas, 'cartelera');
    })
    .catch(error => console.error('Error cargando JSON de películas:', error));
}

function mostrarPeliculas(peliculas, contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    contenedor.innerHTML = ''; // Limpiar antes de mostrar
    peliculas.forEach(pelicula => {
        const tarjeta = crearTarjeta(pelicula);
        contenedor.appendChild(tarjeta);
    });
}

function mostrarRecomendadas() {
    fetch('data/peliculas/cartelera.json')
        .then(res => res.json())
        .then(peliculas => {
            // Mezclamos aleatoriamente
            const mezcladas = peliculas.sort(() => 0.5 - Math.random());
            const seleccionadas = mezcladas.slice(0,10); 
            mostrarPeliculas(seleccionadas, 'recomendadas');
    })
    .catch(error => console.error('Error cargando recomendaciones:', error));
}


function iniciarCarrusel() {
    const contenedor = document.querySelector('.peliculas');
    const btnIzq = document.querySelector('.carrusel-flecha.izquierda');
    const btnDer = document.querySelector('.carrusel-flecha.derecha');

    let scrollAmount = 0;
    const scrollStep = 1000; // Puedes ajustar este valor según el ancho de tus tarjetas

    btnIzq.addEventListener('click', () => {
        contenedor.scrollBy({ left: -scrollStep, behavior: 'smooth' });
    });

    btnDer.addEventListener('click', () => {
        contenedor.scrollBy({ left: scrollStep, behavior: 'smooth' });
    });
}


function mostrarTop10() {
    const contenedor = document.getElementById('top-peliculas');

    fetch('data/peliculas/cartelera.json')
    .then(res => res.json())
    .then(peliculas => {
        const top10 = peliculas
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 10);

        top10.forEach((pelicula, i) => {

        const card = document.createElement('div');
        card.dataset.rating = pelicula.rating;
        card.classList.add('rank-card');

        const numero = document.createElement('span');
        numero.classList.add('rank-number');
        numero.textContent = i + 1;

        const img = document.createElement('img');
        img.src = pelicula.img;
        img.alt = pelicula.alt;

        card.appendChild(numero);
        card.appendChild(img);
        contenedor.appendChild(card);
        });
    })
    .catch(err => console.error("Error cargando Top 10:", err));
}

function crearTarjeta(pelicula) {
    const tarjeta = document.createElement('div');
    tarjeta.classList.add('tarjeta');
    tarjeta.dataset.genero = pelicula.genero;
    tarjeta.dataset.rating = pelicula.rating;

    tarjeta.innerHTML = `
        <img src="${pelicula.img}" alt="${pelicula.alt}" />
        <h3>${pelicula.nombre}</h3>
    `;
    tarjeta.addEventListener('click', ()=>{
        mostrarModal(pelicula);
    })
    return tarjeta;
}
function mostrarModal(pelicula){
    document.getElementById('imgModal').src=pelicula.img;
    document.getElementById('imgModal').alt=pelicula.alt;
    document.getElementById('tituloModal').textContent=pelicula.nombre;
    document.getElementById('generoModal').textContent="Genero: "+ pelicula.genero;
    document.getElementById('actoresModal').textContent="Actores: "+pelicula.actores;
    document.getElementById('duracionModal').textContent="Duración: "+pelicula.duracion;
    
    
    document.getElementById('descripcionModal').textContent=pelicula.descripcion || "sin descripción";
    const enlace = document.getElementById('enlaceModal');
    if (enlace && pelicula.trailer) {
        enlace.href = pelicula.trailer;
        enlace.style.display = "inline-block";
    } else if (enlace) {
        enlace.style.display = "none";
    }
    document.getElementById('modal').style.display = "block";
}

function filtrarPeliculas(genero) {
    let filtradas = [];

    if (genero === 'todas') {
        filtradas = todasLasPeliculas;
    } else {
        filtradas = todasLasPeliculas.filter(p => p.genero === genero);
    }

    mostrarPeliculas(filtradas, 'cartelera');
}
document.querySelector('.cerrarModal').addEventListener('click', () => {
    document.getElementById('modal').style.display = "none";
});

window.addEventListener('click', (e) => {
    if (e.target.id === "modal") {
        document.getElementById('modal').style.display = "none";
    }
});