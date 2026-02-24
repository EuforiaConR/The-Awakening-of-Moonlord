export const Vec3 = {
  up: { x: 0, y: -1, z: 0 },
  down: { x: 0, y: 1, z: 0 },
  forward: { x: 0, y: 0, z: -1 },
  back: { x: 0, y: 0, z: 1 },
  left: { x: -1, y: 0, z: 0 },
  right: { x: 1, y: 0, z: 0 },

  distance(v1, v2) {
    const dx = v2.x - v1.x;
    const dy = v2.y - v1.y;
    const dz = v2.z - v1.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  },
  /**
   * Interpolates linearly between two 3D vectors.
   * @param {Vector3} start - Starting position.
   * @param {Vector3} end - Ending position.
   * @param {number} steps - Number of points to generate.
   * @returns {Array<Vector3>} Array of interpolated positions.
   */
  interpolateVectors(start, end, steps) {
    const points = [];
    if (steps <= 1) return [start, end];

    const dx = (end.x - start.x) / (steps - 1);
    const dy = (end.y - start.y) / (steps - 1);
    const dz = (end.z - start.z) / (steps - 1);

    for (let i = 0; i < steps; i++) {
      points.push({
        x: start.x + dx * i,
        y: start.y + dy * i,
        z: start.z + dz * i
      });
    }

    return points;
  },

  getLocalCoordinates(entity, offset = { x: 0, y: 0, z: 0 }) {
    const pos = entity.location;

    // forward desde la API
    const f = entity.getViewDirection(); // eje Z local
    const forward = { x: f.x, y: f.y, z: f.z };

    // eje Y local (constante en MC)
    const up = { x: 0, y: 1, z: 0 };

    // right = forward x up
    const right = {
      x: forward.z,
      y: 0,
      z: -forward.x
    };

    // COMBINAR OFFSETS
    const worldX = pos.x + right.x * offset.x + up.x * offset.y + forward.x * offset.z;
    const worldY = pos.y + right.y * offset.x + up.y * offset.y + forward.y * offset.z;
    const worldZ = pos.z + right.z * offset.x + up.z * offset.y + forward.z * offset.z;

    return { x: worldX, y: worldY, z: worldZ };
  },
  add(v1, v2) {
    return { x: v1.x + (v2.x ?? 0), y: v1.y + (v2.y ?? 0), z: v1.z + (v2.z ?? 0) };
  },
  subtract(v1, v2) {
    return { x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z };
  },

  scale(v, scalar) {
    return { x: v.x * scalar, y: v.y * scalar, z: v.z * scalar };
  },
  dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  },
  cross(v1, v2) {
    return {
      x: v1.y * v2.z - v1.z * v2.y,
      y: v1.z * v2.x - v1.x * v2.z,
      z: v1.x * v2.y - v1.y * v2.x,
    };
  },
  normalize(v) {
    const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    return { x: v.x / len, y: v.y / len, z: v.z / len };
  },
  rotateAroundYAxis(v, angle) {
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    return {
      x: v.x * cosA - v.z * sinA,
      y: v.y,
      z: v.x * sinA + v.z * cosA,
    };
  },
  addScalar(v, scalar) {
    return { x: v.x + scalar, y: v.y + scalar, z: v.z + scalar };
  },
  equals(v1, v2) {
    return v1.x == v2.x && v1.y == v2.y && v1.z == v2.z;
  },
  angleBetween(v1, v2) {
    const dotProduct = dot(v1, v2);
    const magnitudeV1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
    const magnitudeV2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y + v2.z * v2.z);
    const cosAngle = dotProduct / (magnitudeV1 * magnitudeV2);
    return Math.acos(cosAngle);
  },
  reflect(v, normal) {
    const dotProd = dot(v, normal);
    return {
      x: v.x - 2 * dotProd * normal.x,
      y: v.y - 2 * dotProd * normal.y,
      z: v.z - 2 * dotProd * normal.z,
    };
  },

  degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
  },

  /**
   * Rotates a 3D vector around the Y-axis (horizontal rotation) by a specified angle in degrees.
   *
   * @param {Vector3} v
   * @param {number} angleDegrees
   * @returns {Vector3}
   */
  rotateVectorY(v, angleDegrees) {
    const angleRadians = degreesToRadians(angleDegrees);
    const cos = Math.cos(angleRadians);
    const sin = Math.sin(angleRadians);

    return {
      x: v.x * cos - v.z * sin,
      y: v.y,
      z: v.x * sin + v.z * cos,
    };
  },
};
