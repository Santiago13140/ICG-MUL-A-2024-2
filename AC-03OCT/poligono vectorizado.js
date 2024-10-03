const svg = document.getElementById('svg');
let puntos = [];
let centroideVisible = false;

// Generar puntos aleatorios sin cruces
function generarPuntosAleatorios(numPuntos) {
    const puntos = [];
    const angulos = Array.from({ length: numPuntos }, () => Math.random() * (2 * Math.PI)); // Ángulos aleatorios
    const radios = Array.from({ length: numPuntos }, () => Math.random() * 30 + 70); // Radios aleatorios

    // Generar puntos iniciales
    for (let i = 0; i < numPuntos; i++) {
        const x = Math.cos(angulos[i]) * radios[i];
        const y = Math.sin(angulos[i]) * radios[i];
        puntos.push([x, y]);
    }

    // Ordenar puntos en sentido antihorario
    puntos.sort((a, b) => Math.atan2(a[1], a[0]) - Math.atan2(b[1], b[0]));
    return puntos;
}

function dibujarPoligono() {
    svg.innerHTML = ''; // Limpiar SVG
    const poligono = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');

    let puntosString = puntos.map(p => `${p[0] + 250},${p[1] + 250}`).join(' ');
    poligono.setAttribute('points', puntosString);
    poligono.setAttribute('stroke', 'black');
    poligono.setAttribute('fill', 'none');

    svg.appendChild(poligono);

    if (centroideVisible) {
        mostrarCentroide();
    }

    // Mostrar tipo de polígono
    document.getElementById('resultado').innerText = "Tipo de polígono: " + esConvexa();
}

function mostrarCentroide() {
    const centroide = calcularCentroide(puntos);
    const centroideCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    centroideCircle.setAttribute('cx', centroide[0] + 250);
    centroideCircle.setAttribute('cy', centroide[1] + 250);
    centroideCircle.setAttribute('r', 5);
    centroideCircle.setAttribute('fill', 'red');

    svg.appendChild(centroideCircle);

    puntos.forEach(p => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', centroide[0] + 250);
        line.setAttribute('y1', centroide[1] + 250);
        line.setAttribute('x2', p[0] + 250);
        line.setAttribute('y2', p[1] + 250);
        line.setAttribute('stroke', 'red');
        svg.appendChild(line);
    });
}

function calcularCentroide(puntos) {
    let x = 0, y = 0;
    puntos.forEach(p => {
        x += p[0];
        y += p[1];
    });
    return [x / puntos.length, y / puntos.length];
}

function toggleCentroide() {
    centroideVisible = !centroideVisible;
    dibujarPoligono();
}

function esConvexa() {
    const n = puntos.length;
    let signo = 0;
    for (let i = 0; i < n; i++) {
        const cp = crossProduct(puntos[i], puntos[(i + 1) % n], puntos[(i + 2) % n]);
        if (cp !== 0) {
            if (signo === 0) signo = cp > 0 ? 1 : -1;
            else if (signo !== (cp > 0 ? 1 : -1)) return "Cóncava";
        }
    }
    return "Convexa";
}

function crossProduct(o, a, b) {
    return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
}

// Generar puntos aleatorios y dibujar el polígono
puntos = generarPuntosAleatorios(6);
dibujarPoligono(); // Llamar a la función al cargar
