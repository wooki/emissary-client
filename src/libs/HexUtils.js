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

export function AdjacentCoords(coord) {
  const coords = [
    { x: coord.x, y: coord.y - 1 },
    { x: coord.x + 1, y: coord.y },
    { x: coord.x + 1, y: coord.y + 1 },
    { x: coord.x, y: coord.y + 1 },    
    { x: coord.x - 1, y: coord.y },
    { x: coord.x - 1, y: coord.y - 1 }
  ];
  return coords;
}


// starting with an array of each side that borders another region
// split into one or more complete lines
export function ExtractPaths(lines) {

  // Make a copy of the input array
  let sourceLines = [...lines];

  // Initialize an array to store the paths
  const paths = [];

  while (sourceLines.length > 0) {
      // Start a path
      const currentPath = [];

      // Keep a queue of lines that need to be checked
      const checkNext = [];

      // Start with the first line and remove it
      const sourceLine = sourceLines.pop();
      currentPath.push(sourceLine);
      checkNext.push(sourceLine);

      // Look for any other lines that share a coordinate with this one,
      // if they do, add them and also add to checkNext
      while (checkNext.length > 0) {
          // Always remove an item and check it
          const checkLine = checkNext.pop();

          // Iterate sourceLines and when we find a match, it should be added
          sourceLines = sourceLines.filter((line) => {

              if (
                SameCoord(line[0], checkLine[0]) ||
                SameCoord(line[0], checkLine[1]) ||
                SameCoord(line[1], checkLine[0]) ||
                SameCoord(line[1], checkLine[1])
              ) {
                  // Position of the current item can change within this loop, so always recheck
                  // the position of the existing item in the currentPath
                  const pathIndex = currentPath.findIndex((x) => SameLine(x, checkLine));                  

                  // Matched, add to the start or end of the path and remember to check later
                  // Also, remove from sourceLines
                  checkNext.push(line);
                  if (pathIndex === 0) {
                      currentPath.unshift(line);
                  } else {
                      currentPath.push(line);
                  }

                  return false; // Remove it
              } else {
                  return true; // Keep it
              }
          });          
      }      
      paths.push(currentPath);
  }

  return paths;
}

export function SameCoord(coord1, coord2, precision) {
  if (precision === undefined) precision = 2;
  return (coord1 && coord2 && Math.round(coord1.x, precision) == Math.round(coord2.x, precision) && Math.round(coord1.y, precision) == Math.round(coord2.y, precision));
}

export function SameLine(line1, line2) {
  return (SameCoord(line1[0], line2[0]) && SameCoord(line1[1], line2[1])) ||
         (SameCoord(line1[0], line2[1]) && SameCoord(line1[1], line2[0]));
}
