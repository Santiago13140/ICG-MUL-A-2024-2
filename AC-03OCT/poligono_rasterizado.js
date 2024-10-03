const PoligonoApp = {
    canvas: document.getElementById('canvas'),
    ctx: canvas.getContext('2d'),
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
        const CENTER_X = this.canvas.width / 2;
        const CENTER_Y = this.canvas.height / 2;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Limpiar canvas
        this.ctx.beginPath();
        this.ctx.moveTo(this.puntos[0][0] + CENTER_X, this.puntos[0][1] + CENTER_Y); // Ajustar al centro del canvas

        for (let i = 1; i < this.puntos.length; i++) {
            this.ctx.lineTo(this.puntos[i][0] + CENTER_X, this.puntos[i][1] + CENTER_Y);
        }
        this.ctx.closePath();
        this.ctx.stroke();

        if (this.centroideVisible) {
            this.mostrarCentroide(CENTER_X, CENTER_Y);
        }

        document.getElementById('resultado').innerText = "Tipo de polígono: " + this.esConvexa();
    },

    mostrarCentroide(CENTER_X, CENTER_Y) {
        const centroide = this.calcularCentroide(this.puntos);
        console.log("Centroide:", centroide); // Verificación del centroide

        this.ctx.beginPath();
        this.ctx.arc(centroide[0] + CENTER_X, centroide[1] + CENTER_Y, 5, 0, 2 * Math.PI);
        this.ctx.fillStyle = "red";
        this.ctx.fill();

        this.puntos.forEach(p => {
            this.ctx.beginPath();
            this.ctx.moveTo(centroide[0] + CENTER_X, centroide[1] + CENTER_Y);
            this.ctx.lineTo(p[0] + CENTER_X, p[1] + CENTER_Y);
            this.ctx.strokeStyle = "red";
            this.ctx.stroke();
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
        this.centroideVisible = !this.centroideVisible;
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

// Vincular el evento del botón al método toggleCentroide
document.getElementById('toggleCentroideBtn').addEventListener('click', function() {
    PoligonoApp.toggleCentroide();
});
