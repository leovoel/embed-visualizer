function extractRGB(i) {
  return {
    r: (i >> 16) & 0xFF,
    g: (i >> 8) & 0xFF,
    b: i & 0xFF,
  };
}

function combineRGB(r, g, b) {
  return (r << 16) | (g << 8) | b;
}

export { extractRGB, combineRGB };