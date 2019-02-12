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
    const count = 20;
    console.log(count);
    const colorCount = random.rangeFloor(2, 8);
    const palette = random.shuffle(random.pick(palettes)).slice(0, colorCount);

    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);

        const value = random.noise2D(u, v);
        const size = Math.round(Math.abs(value * 100));
        console.log({ value, size });
        // const size = Math.abs(random.gaussian() * 0.02);
        points.push({
          color: random.pick(palette),
          position: [u, v],
          x,
          y,
          size,
          rotation: random.noise2D(u, v)
        });
      }
    }

    return points;
  };

  const points = createGrid(); // .filter(() => random.value() > 0.5);

  return ({ context, width, height, x, y }) => {
    const margin = width / 5;

    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
    points.forEach(({ position: [u, v], x, y, size, color, rotation }) => {
      const imgSize = Math.round((size * width) / 1000);
      const x1 = lerp(margin, width - margin, x);
      const y1 = lerp(margin, height - margin, y);

      console.log({ x1, y1, imgSize, margin, width, u });

      var img = new Image();
      img.onload = function() {
        context.drawImage(img, x1, y1, imgSize * 10, imgSize * 10);
      };
      img.src = "https://www.carforyou.ch/favicon.ico";
    });
  };
};

canvasSketch(sketch, settings);
