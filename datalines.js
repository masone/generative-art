const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");
const { lerp, radToDeg, degToRad } = require("canvas-sketch-util/math");
const makes = require("./data/makes");

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
    const lines = [];
    // const count = random.range(10, 30);
    // const numLines = random.range(5, 100);
    const palette = random.pick(palettes);
    random.shuffle(Object.keys(makes)).forEach((make, i) => {
      const color = random.pick(palette);
      lines.push({
        make,
        color,
        count: makes[make],
        i
      });
    });

    return lines;
  };

  const lines = createGrid();
  const maxCount = Math.max.apply(
    Math,
    lines.map(line => {
      return line.count;
    })
  );

  return ({ context, width, height }) => {
    const margin = width / 10;

    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
    lines.forEach(({ color, count, i }) => {
      const availableWidth = width - margin - margin;
      const availableHeight = height - margin - margin;
      const x = margin;
      const y = margin + (availableHeight / lines.length) * i;
      const percentage = ((100 / maxCount) * count) / 100;
      const lineLength = lerp(0, availableWidth, percentage);
      const lineWidth = random.range(2, (availableHeight / lines.length) * 10);

      // const offsetY = height / 25;
      // const y = margin + (i * (height - margin - margin)) / lines.length;
      // const leftY = offsetY + y;

      // lerp(0, availableWidth, count)
      // const lineLength = Math.sqrt(Math.pow(count, 2) + Math.pow(offsetY, 2));

      console.log({ lineWidth });
      // console.log(
      //   { width: availableWidth, length: lineLength, skew: offsetY },
      //   angle
      // );

      context.save();
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x + lineLength, y);
      context.lineWidth = lineWidth;
      context.strokeStyle = color;
      context.stroke();
      context.closePath();
      context.restore();
    });
  };
};

canvasSketch(sketch, settings);
