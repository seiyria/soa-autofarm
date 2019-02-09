
const { OPTIONS } = require('./env');

const componentToHexString = (num) => num.toString(16).padStart(2, '0');

const rgbToHex = ({ r, g, b }) => {
  return (componentToHexString(r) + componentToHexString(g) + componentToHexString(b)).toUpperCase();
};

const hexToRgb = (hex) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
  } : null;
};

const areColorsWithinTolerance = (hex1, hex2) => {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  const r = rgb1.r - rgb2.r;
  const g = rgb1.g - rgb2.g;
  const b = rgb1.b - rgb2.b;
  
  return ((r * r) + (g * g) + (b * b)) < (OPTIONS.SAFETY_THRESHOLD * OPTIONS.SAFETY_THRESHOLD);
};

module.exports = {
  rgbToHex,
  hexToRgb,
  areColorsWithinTolerance
}