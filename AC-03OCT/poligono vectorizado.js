const PoligonoApp = {
    svg: document.getElementById('svg'),
    puntos: [],
    centroideVisible: false,

    generarPuntosAleatorios(numPuntos) {
        const puntos = [];
        const angulos = Array.from({ length: numPuntos }, () => Math.random() * (2 * Math.PI)); 
        const radios = Array.from({ length: numPuntos }, () => Math.random() * 30 + 70); 

        for (let i = 0; i < numPuntos; i++) {
            const x = Math.cos(angulos[i]) * radios[i];
            const y = Math.sin(angulos[i]) * radios[i];
            puntos.push([x, y]);
        }

        puntos.sort((a, b) => Math.atan2(a[1], a[0]) - Math.atan2(b[1], b[0]));
        return puntos;
    },

    dibujarPoligono() {
        this.svg.innerHTML = ''; // Limpiar SVG
        const poligono = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');

        let puntosString = this.puntos.map(p => `${p[0] + 250},${p[1] + 250}`).join(' ');
        poligono.setAttribute('points', puntosString);
        poligono.setAttribute('stroke', 'black');
        poligono.setAttribute('fill', 'none');

        this.svg.appendChild(poligono);

        if (this.centroideVisible) {
            this.mostrarCentroide();
        }

        document.getElementById('resultado').innerText = "Tipo de polígono: " + this.esConvexa();
    },

    mostrarCentroide() {
        const centroide = this.calcularCentroide(this.puntos);
        const centroideCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        centroideCircle.setAttribute('cx', centroide[0] + 250);
        centroideCircle.setAttribute('cy', centroide[1] + 250);
        centroideCircle.setAttribute('r', 5);
        centroideCircle.setAttribute('fill', 'red');

        this.svg.appendChild(centroideCircle);

        this.puntos.forEach(p => {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', centroide[0] + 250);
            line.setAttribute('y1', centroide[1] + 250);
            line.setAttribute('x2', p[0] + 250);
            line.setAttribute('y2', p[1] + 250);
            line.setAttribute('stroke', 'red');
            this.svg.appendChild(line);
        });
    },

    calcularCentroide(puntos) {
        let x = 0, y = 0;
        puntos.forEach(p => {
            x += p[0];
            y += p[1];
        });
        return [x / puntos.length, y / puntos.length];
    },

    toggleCentroide() {
        this.centroideVisible = !this.centroideVisible;  // Acceso correcto a la propiedad
        this.dibujarPoligono();
    },

    esConvexa() {
        const n = this.puntos.length;
        let signo = 0;
        for (let i = 0; i < n; i++) {
            const cp = this.crossProduct(this.puntos[i], this.puntos[(i + 1) % n], this.puntos[(i + 2) % n]);
            if (cp !== 0) {
                if (signo === 0) signo = cp > 0 ? 1 : -1;
                else if (signo !== (cp > 0 ? 1 : -1)) return "Cóncava";
            }
        }
        return "Convexa";
    },

    crossProduct(o, a, b) {
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    },

    iniciar(numPuntos = 6) {
        this.puntos = this.generarPuntosAleatorios(numPuntos);
        this.dibujarPoligono();
    }
};

// Inicializar la aplicación
PoligonoApp.iniciar();

// Asignar el evento al botón
document.getElementById('toggleCentroideBtn').onclick = () => PoligonoApp.toggleCentroide();
