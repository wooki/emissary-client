export function Sizes(size) {  
  let hexsizesData = {
    a: size / 2,
    b: Math.sin(60 * (Math.PI / 180)) * size,
    c: size,
  };

  hexsizesData.y = hexsizesData.a + hexsizesData.c;
  hexsizesData.x = 2 * hexsizesData.b;
  hexsizesData.xodd = - hexsizesData.b; // step back for if y is odd

  return hexsizesData;
}

export function Corners(x, y, size) {
  const hs = Sizes(size);
  return [
    { x: x, y: y - hs.c },
    { x: x + hs.b, y: y - hs.a },
    { x: x + hs.b, y: y + hs.a },
    { x: x, y: y + hs.c },
    { x: x - hs.b, y: y + hs.a },
    { x: x - hs.b, y: y - hs.a },
  ];
}

export function Center(x, y, size, xOffset, yOffset) {
  
  if (xOffset === undefined) xOffset = 0;
  if (yOffset === undefined) yOffset = 0;

  const hs = Sizes(size);
  const position = {
    x: xOffset + hs.x * x + (y - 1) * hs.xodd,
    y: yOffset + hs.y * y,
  };
  return position;
}