/* =========================================================
   SCRIPT EVALUADOR - INTEGRA-TESCO
   Funciones compartidas entre páginas del módulo
   ========================================================= */

function cargarAnimeJS(callback) {
    if (typeof anime !== 'undefined') {
        if (callback) callback();
        return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js';
    script.onload = () => { if (callback) callback(); };
    document.head.appendChild(script);
}

function initHexBackground() {
    const container = document.getElementById('bgHex');
    if (!container) return;

    const NS = 'http://www.w3.org/2000/svg';
    const SIZE = 150;
    const hexagons = [];
    
    let mouseX = -1000;
    let mouseY = -1000;
    let ticking = false;

    function hexPath(cx, cy, r) {
        const pts = [];
        for (let i = 0; i < 6; i++) {
            const a = (Math.PI / 3) * i - Math.PI / 6;
            pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
        }
        return 'M' + pts.join('L') + 'Z';
    }

    function build() {
        container.innerHTML = '';
        hexagons.length = 0;
        
        const R = SIZE / 2;
        const xSpacing = Math.sqrt(3) * R; 
        const ySpacing = 1.5 * R;

        const cols = Math.ceil(window.innerWidth / xSpacing) + 2;
        const rows = Math.ceil(window.innerHeight / ySpacing) + 2;

        for (let row = -1; row < rows; row++) {
            for (let col = -1; col < cols; col++) {
                const cx = col * xSpacing + (row % 2 !== 0 ? xSpacing / 2 : 0);
                const cy = row * ySpacing;

                const svg = document.createElementNS(NS, 'svg');
                svg.setAttribute('width', SIZE);
                svg.setAttribute('height', SIZE);
                svg.setAttribute('viewBox', `0 0 ${SIZE} ${SIZE}`);
                
                svg.style.left = (cx - R) + 'px';
                svg.style.top = (cy - R) + 'px';
                
                const baseOp = (0.06 + Math.random() * 0.1).toFixed(2);
                svg.style.opacity = baseOp;

                const path = document.createElementNS(NS, 'path');
                path.setAttribute('d', hexPath(R, R, R));
                path.setAttribute('fill', 'none');
                path.setAttribute('stroke', Math.random() > 0.5 ? '#99ff00' : '#4dff00');
                path.setAttribute('stroke-width', '1.2');

                svg.appendChild(path);
                container.appendChild(svg);
                
                hexagons.push({ svg, cx, cy, baseOpacity: baseOp, isActive: false });
            }
        }
    }

    function updateHexagons() {
        if (typeof anime === 'undefined') {
            ticking = false;
            return;
        }
        
        const radius = 220;

        hexagons.forEach(hex => {
            const dx = mouseX - hex.cx;
            const dy = mouseY - hex.cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < radius) {
                const intensity = 1 - (dist / radius);
                
                anime.remove(hex.svg);
                
                hex.svg.style.opacity = 0.95 + intensity * 0.35;
                hex.svg.style.transform = `translate(${-dx * 0.03}px, ${-dy * 0.03}px)`;

                hex.isActive = true;
            } else if (hex.isActive) {
                hex.isActive = false;
                hex.svg.style.filter = '';
                
                anime({
                    targets: hex.svg,
                    scale: 1,
                    opacity: hex.baseOpacity,
                    translateX: 0,
                    translateY: 0,
                    duration: 1600,
                    easing: 'easeOutQuad'
                });
            }
        });
        
        ticking = false;
    }

    build();
    
    window.addEventListener('resize', () => {
        clearTimeout(window.__hexResize);
        window.__hexResize = setTimeout(build, 250);
    });
    
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!ticking) {
            requestAnimationFrame(updateHexagons);
            ticking = true;
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    cargarAnimeJS(() => initHexBackground());
});