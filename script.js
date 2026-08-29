const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let WIDTH;
let HEIGHT;

function resizeCanvas() {

    WIDTH = canvas.width = window.innerWidth;
    HEIGHT = canvas.height = window.innerHeight;

}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);


// ===============================
// PENGATURAN
// ===============================

const WORDS = [
    "i love you",
    "I LOVE YOU",
    "love you"
];

const COLORS = [
    [255, 70, 35],
    [255, 130, 45],
    [255, 45, 45],
    [255, 190, 90],
    [255, 95, 60]
];


// ===============================
// PARTICLE
// ===============================

class Particle {

    constructor(x, y, delay, type) {

        this.x = x;
        this.y = y;

        this.delay = delay;

        this.type = type;

        this.word =
            WORDS[Math.floor(Math.random() * WORDS.length)];

        this.color =
            COLORS[Math.floor(Math.random() * COLORS.length)];

        this.alpha = 0;

        this.size =
            type === "outline"
                ? 14 + Math.random() * 7
                : 11 + Math.random() * 5;

        this.flicker =
            Math.random() * Math.PI * 2;

    }


    draw(time) {

        if (time < this.delay) {
            return;
        }


        // Muncul perlahan

        if (this.alpha < 1) {

            this.alpha += 0.025;

        }


        let flicker = 1;


        if (this.alpha >= 1) {

            flicker =
                0.75 +
                0.25 *
                Math.sin(
                    time * 0.05 +
                    this.flicker
                );

        }


        const alpha =
            this.alpha * flicker;


        const [r, g, b] =
            this.color;


        ctx.save();


        ctx.globalAlpha = alpha;


        ctx.font =
            `bold ${this.size}px Arial`;

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";


        // Glow

        ctx.shadowBlur = 18;

        ctx.shadowColor =
            `rgb(${r}, ${g}, ${b})`;


        ctx.fillStyle =
            `rgb(${r}, ${g}, ${b})`;


        ctx.fillText(
            this.word,
            this.x,
            this.y
        );


        ctx.restore();

    }

}


// ===============================
// RUMUS HATI
// ===============================

function heartXY(t) {

    const x =
        16 *
        Math.pow(Math.sin(t), 3);


    const y =
        13 * Math.cos(t)
        - 5 * Math.cos(2 * t)
        - 2 * Math.cos(3 * t)
        - Math.cos(4 * t);


    return {
        x: x,
        y: -y
    };

}


// ===============================
// KONVERSI KE LAYAR
// ===============================

function toScreen(x, y) {

    const scale =
        Math.min(WIDTH, HEIGHT) / 40;


    return {

        x:
            x * scale +
            WIDTH / 2,

        y:
            y * scale +
            HEIGHT / 2

    };

}


// ===============================
// BUAT PARTICLE HATI
// ===============================

let particles = [];


function createParticles() {

    particles = [];


    // ===========================
    // OUTLINE HATI
    // ===========================

    const outlineCount = 160;


    for (
        let i = 0;
        i < outlineCount;
        i++
    ) {

        const t =
            (i / outlineCount) *
            Math.PI * 2;


        const heart =
            heartXY(t);


        const pos =
            toScreen(
                heart.x,
                heart.y
            );


        particles.push(

            new Particle(
                pos.x,
                pos.y,

                i * 1.6,

                "outline"
            )

        );

    }


    // ===========================
    // ISI HATI
    // ===========================

    const fillCount = 130;


    for (
        let i = 0;
        i < fillCount;
        i++
    ) {

        const t =
            Math.random() *
            Math.PI * 2;


        const r =
            Math.random() *
            0.86;


        const heart =
            heartXY(t);


        const pos =
            toScreen(
                heart.x * r,
                heart.y * r
            );


        particles.push(

            new Particle(

                pos.x,
                pos.y,

                290 + Math.random() * 500,

                "fill"

            )

        );

    }

}


// Buat particle

createParticles();


// ===============================
// ANIMASI
// ===============================

let startTime =
    performance.now();


function animate(currentTime) {

    const time =
        (currentTime - startTime) / 16.67;


    // Background

    ctx.clearRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );


    ctx.fillStyle =
        "rgb(10, 5, 8)";


    ctx.fillRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );


    // Gambar semua particle

    for (const particle of particles) {

        particle.draw(time);

    }


    requestAnimationFrame(
        animate
    );

}


// Jalankan

requestAnimationFrame(
    animate
);