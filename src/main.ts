const targetPosition: Point = {
  x: 0,
  y: 1000,
  z: 1000,
};

type Point = {
  x: number;
  y: number;
  z: number;
};

type Triangle = {
  opposite: number;
  adjacent: number;
  hypotenuse: number;
};

const gunPosition: Point = {
  x: 3500,
  y: 1000,
  z: 6000,
};

const gunBaseTarget: Point = {
  ...gunPosition,
  z: 0,
};

type RadAngleValue = number;

function getHorizontalTriangle(targetPosition: Point): Triangle {
  return {
    opposite: targetPosition.x - gunBaseTarget.x,
    adjacent: gunPosition.z - targetPosition.z,
    get hypotenuse() {
      return Math.sqrt(this.opposite ** 2 + this.adjacent ** 2);
    },
  };
}

function getVerticalTriangle(
  targetPosition: Point,
  horizontalTriangle: Triangle,
): Triangle {
  return {
    opposite: targetPosition.y - gunBaseTarget.y,
    adjacent: horizontalTriangle.hypotenuse,
    get hypotenuse() {
      return Math.sqrt(this.opposite ** 2 + this.adjacent ** 2);
    },
  };
}

function getYaw(gunPosition: Point, targetPosition: Point): RadAngleValue {
  const bottomWallTargetPosition = findBottomWallIntersection(
    gunPosition,
    targetPosition,
  );

  const horizontalTriangle = getHorizontalTriangle(bottomWallTargetPosition);

  const yaw = Math.atan(
    horizontalTriangle.opposite / horizontalTriangle.adjacent,
  );
  return yaw;
}

function getPitch(gunPosition: Point, targetPosition: Point): RadAngleValue {
  const bottomWallTargetPosition = findBottomWallIntersection(
    gunPosition,
    targetPosition,
  );

  const horizontalTriangle = getHorizontalTriangle(bottomWallTargetPosition);

  const verticalTriangle = getVerticalTriangle(
    targetPosition,
    horizontalTriangle,
  );

  const pitch = Math.atan(
    verticalTriangle.opposite / verticalTriangle.adjacent,
  );
  return pitch;
}

function findBottomWallIntersection(
  gunPosition: Point,
  targetPosition: Point,
): Point {
  if (targetPosition.z === 0) {
    return targetPosition;
  } else {
    return findSideWallIntersection(gunPosition, targetPosition);
  }
}

function findSideWallIntersection(
  gunPosition: Point,
  targetPosition: Point,
): Point {
  const { x: xg, y: yg, z: zg } = gunPosition;
  const { x: xt, y: yt, z: zt } = targetPosition;

  if (xt === xg) {
    throw new Error('Gun and target must not be aligned on x-axis.');
  }

  const t = -xg / (xt - xg);

  return {
    x: 0,
    y: yg + t * (yt - yg),
    z: zg + t * (zt - zg),
  };
}

function radToDeg(rad: number): string {
  return `${(rad * (180 / Math.PI)).toFixed(2)}°`;
}

console.log('yaw', radToDeg(getYaw(gunPosition, targetPosition)));
console.log('pitch', radToDeg(getPitch(gunPosition, targetPosition)));
