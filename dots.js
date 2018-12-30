const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");

random.setSeed(random.getRandomSeed());
console.log(random.getSeed());

const settings = {
  dimensions: [2048, 2048],
  suffix: random.getSeed()
  // dimensions: "A4",
  // pixesPerInch: 300
};

const sketch = () => {
  const createGrid = () => {
    const points = [];
    // const count = random.range(10, 30);
    const count = 10;
    console.log(count);
    const colorCount = random.rangeFloor(2, 8);
    const palette = random.shuffle(random.pick(palettes)).slice(0, colorCount);

    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);

        // const size = Math.abs(random.noise2D(u, v)) * 0.08;
        // const size = Math.abs(random.gaussian() * 0.02);
        const size = 0.02;
        points.push({
          color: random.pick(palette),
          position: [u, v],
          size,
          rotation: random.noise2D(u, v)
        });
      }
    }

    return points;
  };

  const points = createGrid(); // .filter(() => random.value() > 0.5);

  return ({ context, width, height }) => {
    const margin = width / 5;

    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
    points.forEach(({ position: [u, v], size, color, rotation }) => {
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      context.beginPath();

      const startAngle = 0;
      const endAngle = Math.PI + (Math.PI * lerp(0, 2, random.gaussian())) / 2;
      // const endAngle = Math.PI * 2;
      context.arc(x, y, size * width, startAngle, endAngle, false);

      if (random.value() > 0) {
        context.fillStyle = color;
        context.fill();
      } else {
        context.strokeStyle = color;
        context.lineWidth = 10;
        context.stroke();
      }
    });
  };
};

canvasSketch(sketch, settings);
