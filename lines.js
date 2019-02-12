const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");
const { lerp, radToDeg, degToRad } = require("canvas-sketch-util/math");

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
    const numLines = random.range(5, 100);
    const color = random.shuffle(random.pick(palettes))[0];

    for (let i = 0; i < numLines; i++) {
      lines.push({
        color,
        i
      });
    }

    return lines;
  };

  const lines = createGrid();

  return ({ context, width, height }) => {
    const margin = width / 8;

    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
    lines.forEach(({ i, color }) => {
      const x = margin;
      const offsetY = height / 25;
      const y = margin + (i * (height - margin - margin)) / lines.length;
      const leftY = offsetY + y;
      const lineWidth = 10;
      const radius = 0.01 * width;

      const availableWidth = width - margin - margin;
      const lineLength = Math.sqrt(
        Math.pow(availableWidth, 2) + Math.pow(offsetY, 2)
      );

      const dotDistance = 500;
      // const angle = Math.cos(offsetY / availableWidth);
      const angle =
        180 -
        90 -
        radToDeg(
          Math.acos(
            (Math.pow(lineLength, 2) +
              Math.pow(offsetY, 2) -
              Math.pow(availableWidth, 2)) /
              (2 * lineLength * offsetY)
          )
        );

      // const offsetDistanceX = (c = Math.sqrt(
      //   Math.pow(offsetY, 2) + Math.pow(dotDistance, 2)
      // ));
      // const offsetYDistanceY = (a = Math.sqrt(
      //   Math.pow(offsetDistanceX, 2) - Math.pow(dotDistance, 2)
      // ));

      console.log(offsetDistanceX, offsetYDistanceY);

      // const offsetDistanceX = degToRad(
      //   Math.sqrt(Math.pow(availableWidth, 2) - Math.pow(offsetY, 2))
      // );
      // const offsetYDistanceY = dotDistance * degToRad(Math.tan(angle));

      // const a = lineLength · Math.sin(degToRad(angle))/Math.sin(beta)
      // const c = Math.sqrt( + b² - 2·a·b·cos(gamma))
      console.log(
        { width: availableWidth, length: lineLength, skew: offsetY },
        angle
        // offsetYDistanceY,
        // offsetDistanceX
      );

      context.save();
      context.beginPath();
      context.moveTo(x, leftY);
      context.lineTo(x + availableWidth, y);
      context.lineWidth = lineWidth;
      context.strokeStyle = color;
      context.stroke();
      context.closePath();
      context.restore();

      context.arc(
        x + dotDistance,
        leftY - offsetYDistanceY,
        radius,
        0,
        Math.PI * 2,
        false
      );
      context.fillStyle = color;
      context.fill();
      // context.beginPath();
      // context.moveTo(x, leftY);
      // context.lineTo(x, leftY + 20);
      // context.lineTo(x + 10, leftY + 10);
      // context.closePath();
      // context.fillStyle = color;
      // context.fill();
    });
  };
};

canvasSketch(sketch, settings);
