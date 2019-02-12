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
    const count = random.range(10, 40);
    const colorCount = random.rangeFloor(2, 8);
    const palette = random.shuffle(random.pick(palettes)).slice(0, colorCount);

    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);

        const size = Math.abs(random.gaussian());
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

  const points = createGrid().filter(() => Math.abs(random.value()) > 0.9);

  return ({ context, width, height }) => {
    const margin = 0;

    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
    points.forEach(({ position: [u, v], size, color, rotation }) => {
      const x = lerp(margin, width - margin, u) - 200;
      const y = lerp(margin, height - margin, v) + 100;

      context.save();
      context.fillStyle = color;
      context.font = `${size * width}px arial`;
      context.translate(x, y);
      context.rotate(rotation);
      context.fillText(random.pick(["C", "A", "R", "F", "O", "Y", "U"]), 0, 0);
      context.restore();
    });
  };
};

canvasSketch(sketch, settings);
