const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");
const { lerp, radToDeg, degToRad } = require("canvas-sketch-util/math");
const makes = require("./data/makes");

random.setSeed(random.getRandomSeed());
console.log(random.getSeed());

const debug = true;
const width = 2048;
const height = 2048;
const settings = {
  dimensions: [width, height],
  suffix: random.getSeed()
  // dimensions: "A4",
  // pixesPerInch: 300
};

const padding = width / 9;
const availableWidth = width - 2 * padding; // - margin - margin;
const availableHeight = height - 2 * padding; // - margin - margin;
const lineWidth = availableHeight / 31;
const marginY = lineWidth * 0.9;
const countModifier = 0.55;
const palette = random.pick(palettes);

// const marginX = lineWidth * 0.9;

const sketch = () => {
  const createGrid = () => {
    const lines = [];
    // const count = random.range(10, 30);
    // const numLines = random.range(5, 100);
    // const lineWidth = random.range(10, availableHeight / 10);

    random.shuffle(Object.keys(makes)).forEach((make, i) => {
      const color = random.pick(palette);
      lines.push({
        make,
        color,
        count: makes[make] * countModifier,
        i,
        lineWidth
      });
    });

    return lines;
  };

  const lines = createGrid();
  const maxCount = Math.max.apply(
    Math,
    lines.map(line => {
      return line.count * countModifier;
    })
  );
  const totalCount = Object.values(makes).reduce((acc, count) => {
    return acc + count;
  }, 0);

  return ({ context, width, height }) => {
    const margin = width / 10;

    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    let fromX = 0;
    let currentY = 0;

    const radius = availableWidth / 2;
    context.beginPath();
    context.arc(
      availableWidth / 2 + padding,
      availableHeight / 2 + padding,
      radius,
      0,
      2 * Math.PI,
      false
    );
    if (debug) {
      context.fillStyle = random.pick(palette);
      context.fill();
    } else {
      context.clip();
    }

    context.translate(0, 0, width, height);

    lines.forEach(({ color, count, lineWidth }) => {
      const percentage = ((100 / maxCount) * count) / 100;
      const lineLength = lerp(0, availableWidth, percentage);

      let toX = fromX + lineLength;
      const rest = toX % availableWidth;
      if (toX > availableWidth) {
        toX = availableWidth;
      }

      const renderLine = () => {
        const y = currentY + lineWidth / 2;
        console.log({ lineWidth, marginY });
        // console.log({ totalCount, fromX, toX, currentY });
        // context.save();
        context.beginPath();
        context.moveTo(fromX + padding, y + padding);
        context.lineTo(toX + padding, y + padding);
        context.lineWidth = lineWidth;
        context.strokeStyle = color;
        context.stroke();
        context.closePath();
        // context.restore();
      };
      context.rotate((30 * Math.PI) / 180);
      // currentY = toX + (availableHeight / lines.length) * i;

      // const offsetY = height / 25;
      // const y = margin + (i * (height - margin - margin)) / lines.length;
      // const leftY = offsetY + y;

      // lerp(0, availableWidth, count)
      // const lineLength = Math.sqrt(Math.pow(count, 2) + Math.pow(offsetY, 2));

      // console.log({ fromX, toX, lineLength, currentY });
      // console.log(
      //   { width: availableWidth, length: lineLength, skew: offsetY },
      //   angle
      // );

      renderLine(context, fromX, toX, currentY, lineWidth, color);

      if (toX === availableWidth) {
        console.log("longer than available");
        // const rest = lineLength - availableWidth;
        currentY = currentY + lineWidth + marginY;
        fromX = 0;
        toX = rest;

        renderLine(context, fromX, toX, currentY, lineWidth, color);
      }

      fromX = toX;
    });
    // context.setTransform(1, 0, 0, 1, 0, 0);
  };
};

canvasSketch(sketch, settings);
