// Cargar Anime.js dinámicamente si no está presente en la página
function cargarAnimeJS(callback) {
  if (typeof anime !== 'undefined') {
    // Si ya está cargado por alguna razón, ejecutar de inmediato
    if (callback) callback();
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js';
  script.onload = () => {
    if (callback) callback();
  };
  document.head.appendChild(script);
}

// Ejecutar tus animaciones una vez cargada la librería
document.addEventListener('DOMContentLoaded', () => {
  cargarAnimeJS(() => {
    // AQUÍ COLOCAS TU CÓDIGO DE LAS ANIMACIONES
    anime({
      targets: '.bg-hexagon',
      translateY: () => anime.random(-35, 35),
      translateX: () => anime.random(-25, 25),
      rotate: () => anime.random(-180, 180),
      scale: () => anime.random(0.7, 1.4),
      opacity: () => anime.random(0.08, 0.25),
      duration: () => anime.random(6000, 12000),
      easing: 'easeInOutQuad',
      direction: 'alternate',
      loop: true,
      delay: anime.stagger(400)
    });
  });
});

  (function generarHexagonos() {
      var cont = document.getElementById('bgHexContainer');
      if (!cont) return;
      var cantidad = window.innerWidth < 768 ? 12 : 22;
      for (var i = 0; i < cantidad; i++) {
        var hex = document.createElement('div');
        hex.className = 'bg-hexagon';
        var size = 40 + Math.random() * 120;
        hex.style.width = size + 'px';
        hex.style.height = (size * 1.15) + 'px';
        hex.style.left = Math.random() * 100 + '%';
        hex.style.top = Math.random() * 100 + '%';
        hex.style.opacity = (0.2 + Math.random() * 0.4).toFixed(2);
        var dur = (12 + Math.random() * 18).toFixed(1);
        hex.style.animation = 'flotarHex ' + dur + 's ease-in-out infinite';
        hex.style.animationDelay = (-Math.random() * 10).toFixed(1) + 's';
        hex.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
        cont.appendChild(hex);
      }
    })();