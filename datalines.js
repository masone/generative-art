const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");
const { lerp } = require("canvas-sketch-util/math");
const makes = require("./data/makes");

random.setSeed(random.getRandomSeed());
console.log(random.getSeed());

const debug = false;
const a3 = [210, 297];
const [width, height] = a3;
const settings = {
  dimensions: [width, height],
  suffix: random.getSeed(),
  pixelsPerInch: 300,
  units: "mm"
};

const objects = makes;
const paddingY = height / 10;
const paddingX = width / 6;
const availableWidth = width - 2 * paddingX; // - margin - margin;
const availableHeight = height - 2 * paddingY; // - margin - margin;
const lineWidth = availableWidth / 31;
const marginY = lineWidth * 0.9;
const countModifier = 0.5;
// const palette = random.pick(palettes);
const customPalettes = [
  [
    "#7babd3",
    "#e5b788",
    "#ac6337",
    "#d5ba49",
    "#193d39",
    "#6a5864",
    "#d7dbdf",
    "#6a5864",
    "#7d7d2a"
  ],
  ["#d4ddd5", "#3c2124", "#e9ad77", "#af7c54", "#aea097"]
];
const palette = random.pick(customPalettes);

const sketch = () => {
  const createGrid = () => {
    const lines = [];
    // const count = random.range(10, 30);
    // const numLines = random.range(5, 100);
    // const lineWidth = random.range(10, availableHeight / 10);

    random.shuffle(Object.keys(objects)).forEach((object, i) => {
      const color = random.pick(palette);
      lines.push({
        color,
        count: objects[object] * countModifier,
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
    let fromX = 0;
    let currentY = 0;

    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    context.fillStyle = "#232a36";
    context.textAlign = "center";
    context.font = `${height / 200}mm Arial`;
    context.fillText("carforyou.ch · makes", width / 2, height - paddingY / 2);

    const radius = availableWidth / 2;
    context.beginPath();
    context.arc(
      availableWidth / 2 + paddingX,
      height * 0.34,
      radius,
      0,
      2 * Math.PI,
      false
    );

    if (debug) {
      context.fillStyle = "#11c";
      context.fill();
    } else {
      context.clip();
    }

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
        context.beginPath();
        context.moveTo(fromX + paddingX, y + paddingY);
        context.lineTo(toX + paddingX, y + paddingY);
        context.lineWidth = lineWidth;
        context.strokeStyle = color;
        context.stroke();
        context.closePath();
      };

      renderLine(context, fromX, toX, currentY, lineWidth, color);

      if (toX === availableWidth) {
        // const rest = lineLength - availableWidth;
        currentY = currentY + lineWidth + marginY;
        fromX = 0;
        toX = rest;

        renderLine(context, fromX, toX, currentY, lineWidth, color);
      }

      fromX = toX;
    });
  };
};

canvasSketch(sketch, settings);
