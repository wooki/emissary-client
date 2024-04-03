export function hexGridAStar(jsonData, startCoord, endCoord, terrainWeights) {
  // Define A* algorithm functions
  function heuristic(a, b) {
    const terrainA = jsonData.map[`${a.x},${a.y}`].terrain;
    const terrainB = jsonData.map[`${b.x},${b.y}`].terrain;

    // Calculate the heuristic (Manhattan distance) and add terrain weight
    const dx = Math.abs(a.x - b.x);
    const dy = Math.abs(a.y - b.y);
    const terrainWeight =
      terrainWeights[terrainA] + terrainWeights[terrainB].weight;
    return (dx + dy) * terrainWeight;
  }

  function getNeighbors(coord) {
    const { x, y } = coord;
    const neighbors = [];

    throw 'AI Gen code makes no sense here!';
    const directions = [
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
    ];

    // Hexagonal grid neighbors
    for (const dir of directions) {
      const neighborX = x + dir.dx;
      const neighborY = y + dir.dy;
      if (jsonData.map[`${neighborX},${neighborY}`]) {
        neighbors.push({ x: neighborX, y: neighborY });
      }
    }

    return neighbors;
  }

  // A* algorithm
  const openSet = [];
  const closedSet = {};
  openSet.push(startCoord);

  while (openSet.length > 0) {
    let currentCoord = openSet[0];
    let currentIndex = 0;

    // Find the node with the lowest f cost
    for (let i = 0; i < openSet.length; i++) {
      const coord = openSet[i];
      if (coord.f < currentCoord.f) {
        currentCoord = coord;
        currentIndex = i;
      }
    }

    // Remove the current node from the open set
    openSet.splice(currentIndex, 1);

    // Check if we've reached the end
    if (currentCoord.x === endCoord.x && currentCoord.y === endCoord.y) {
      const path = [];
      let temp = currentCoord;
      while (temp) {
        path.push(temp);
        temp = temp.parent;
      }
      return path.reverse();
    }

    // Generate neighbors
    const neighbors = getNeighbors(currentCoord);

    for (const neighborCoord of neighbors) {
      const key = `${neighborCoord.x},${neighborCoord.y}`;
      const neighbor = jsonData.map[key];
      if (!closedSet[key] && neighbor) {
        const tentativeG = currentCoord.g + neighbor.weight;
        let newPath = false;

        if (openSet.includes(neighborCoord)) {
          if (tentativeG < neighborCoord.g) {
            neighborCoord.g = tentativeG;
            newPath = true;
          }
        } else {
          neighborCoord.g = tentativeG;
          openSet.push(neighborCoord);
          newPath = true;
        }

        if (newPath) {
          neighborCoord.h = heuristic(neighborCoord, endCoord);
          neighborCoord.f = neighborCoord.g + neighborCoord.h;
          neighborCoord.parent = currentCoord;
        }
      }
    }

    closedSet[`${currentCoord.x},${currentCoord.y}`] = true;
  }

  // No path found
  return null;
}

// Example usage
// const jsonData = /* JSON data */;
// const startCoord = { x: 22, y: 37 };
// const endCoord = { x: 38, y: 50 };

// const terrainWeights = {
//   "Ocean": Infinity,
//   "Lowland": 1
// }

// const path = hexGridAStar(jsonData, startCoord, endCoord, terrainWeights);

// console.log("Path:", path);
