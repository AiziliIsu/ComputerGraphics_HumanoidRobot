// ==========================================
// CUSTOM GEOMETRY UTILITIES WITH PER-VERTEX NORMALS
// ==========================================

/**
 * Creates a cylinder geometry with per-vertex normals
 * @param {number} radiusTop - Radius at the top
 * @param {number} radiusBottom - Radius at the bottom
 * @param {number} height - Height of the cylinder
 * @param {number} radialSegments - Number of segments around the circumference
 * @param {number} heightSegments - Number of segments along the height
 * @returns {THREE.BufferGeometry}
 */
function createCylinder(radiusTop = 0.5, radiusBottom = 0.5, height = 1, radialSegments = 16, heightSegments = 1) {
    const geometry = new THREE.BufferGeometry();

    const vertices = [];
    const normals = [];
    const indices = [];

    // Generate vertices and normals
    for (let y = 0; y <= heightSegments; y++) {
        const v = y / heightSegments;
        const yPos = v * height - height / 2;
        const radius = radiusBottom + (radiusTop - radiusBottom) * v;

        for (let x = 0; x <= radialSegments; x++) {
            const u = x / radialSegments;
            const theta = u * Math.PI * 2;

            const cosTheta = Math.cos(theta);
            const sinTheta = Math.sin(theta);

            // Vertex position
            vertices.push(radius * cosTheta, yPos, radius * sinTheta);

            // Normal (for cylinder sides)
            const normalRadius = (radiusTop + radiusBottom) / 2;
            normals.push(cosTheta, 0, sinTheta);
        }
    }

    // Generate indices
    for (let y = 0; y < heightSegments; y++) {
        for (let x = 0; x < radialSegments; x++) {
            const a = y * (radialSegments + 1) + x;
            const b = a + 1;
            const c = a + radialSegments + 1;
            const d = c + 1;

            indices.push(a, b, d);
            indices.push(a, d, c);
        }
    }

    // Add top and bottom caps
    const topCenterIndex = vertices.length / 3;
    vertices.push(0, height / 2, 0);
    normals.push(0, 1, 0);

    for (let x = 0; x <= radialSegments; x++) {
        const u = x / radialSegments;
        const theta = u * Math.PI * 2;
        vertices.push(radiusTop * Math.cos(theta), height / 2, radiusTop * Math.sin(theta));
        normals.push(0, 1, 0);
    }

    for (let x = 0; x < radialSegments; x++) {
        indices.push(topCenterIndex, topCenterIndex + x + 1, topCenterIndex + x + 2);
    }

    const bottomCenterIndex = vertices.length / 3;
    vertices.push(0, -height / 2, 0);
    normals.push(0, -1, 0);

    for (let x = 0; x <= radialSegments; x++) {
        const u = x / radialSegments;
        const theta = u * Math.PI * 2;
        vertices.push(radiusBottom * Math.cos(theta), -height / 2, radiusBottom * Math.sin(theta));
        normals.push(0, -1, 0);
    }

    for (let x = 0; x < radialSegments; x++) {
        indices.push(bottomCenterIndex, bottomCenterIndex + x + 2, bottomCenterIndex + x + 1);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geometry.setIndex(indices);

    return geometry;
}

/**
 * Creates an elliptical cylinder with per-vertex normals
 * @param {number} radiusX - Radius along X axis
 * @param {number} radiusZ - Radius along Z axis
 * @param {number} height - Height of the cylinder
 * @param {number} radialSegments - Number of segments around the circumference
 * @param {number} heightSegments - Number of segments along the height
 * @returns {THREE.BufferGeometry}
 */
function createEllipticalCylinder(radiusX = 0.5, radiusZ = 0.3, height = 1, radialSegments = 16, heightSegments = 1) {
    const geometry = new THREE.BufferGeometry();

    const vertices = [];
    const normals = [];
    const indices = [];

    // Generate vertices and normals for the side
    for (let y = 0; y <= heightSegments; y++) {
        const v = y / heightSegments;
        const yPos = v * height - height / 2;

        for (let x = 0; x <= radialSegments; x++) {
            const u = x / radialSegments;
            const theta = u * Math.PI * 2;

            const cosTheta = Math.cos(theta);
            const sinTheta = Math.sin(theta);

            // Vertex position
            vertices.push(radiusX * cosTheta, yPos, radiusZ * sinTheta);

            // Normal for elliptical cylinder
            const nx = cosTheta / radiusX;
            const nz = sinTheta / radiusZ;
            const len = Math.sqrt(nx * nx + nz * nz);
            normals.push(nx / len, 0, nz / len);
        }
    }

    // Generate indices for sides
    for (let y = 0; y < heightSegments; y++) {
        for (let x = 0; x < radialSegments; x++) {
            const a = y * (radialSegments + 1) + x;
            const b = a + 1;
            const c = a + radialSegments + 1;
            const d = c + 1;

            indices.push(a, b, d);
            indices.push(a, d, c);
        }
    }

    // Add top cap
    const topCenterIndex = vertices.length / 3;
    vertices.push(0, height / 2, 0);
    normals.push(0, 1, 0);

    for (let x = 0; x <= radialSegments; x++) {
        const u = x / radialSegments;
        const theta = u * Math.PI * 2;
        vertices.push(radiusX * Math.cos(theta), height / 2, radiusZ * Math.sin(theta));
        normals.push(0, 1, 0);
    }

    for (let x = 0; x < radialSegments; x++) {
        indices.push(topCenterIndex, topCenterIndex + x + 1, topCenterIndex + x + 2);
    }

    // Add bottom cap
    const bottomCenterIndex = vertices.length / 3;
    vertices.push(0, -height / 2, 0);
    normals.push(0, -1, 0);

    for (let x = 0; x <= radialSegments; x++) {
        const u = x / radialSegments;
        const theta = u * Math.PI * 2;
        vertices.push(radiusX * Math.cos(theta), -height / 2, radiusZ * Math.sin(theta));
        normals.push(0, -1, 0);
    }

    for (let x = 0; x < radialSegments; x++) {
        indices.push(bottomCenterIndex, bottomCenterIndex + x + 2, bottomCenterIndex + x + 1);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geometry.setIndex(indices);

    return geometry;
}

/**
 * Creates a sphere/ellipsoid with per-vertex normals
 * @param {number} radiusX - Radius along X axis
 * @param {number} radiusY - Radius along Y axis
 * @param {number} radiusZ - Radius along Z axis
 * @param {number} widthSegments - Number of horizontal segments
 * @param {number} heightSegments - Number of vertical segments
 * @returns {THREE.BufferGeometry}
 */
function createEllipsoid(radiusX = 0.5, radiusY = 0.5, radiusZ = 0.5, widthSegments = 16, heightSegments = 12) {
    const geometry = new THREE.BufferGeometry();

    const vertices = [];
    const normals = [];
    const indices = [];

    // Generate vertices and normals
    for (let lat = 0; lat <= heightSegments; lat++) {
        const theta = lat * Math.PI / heightSegments;
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);

        for (let lon = 0; lon <= widthSegments; lon++) {
            const phi = lon * 2 * Math.PI / widthSegments;
            const sinPhi = Math.sin(phi);
            const cosPhi = Math.cos(phi);

            // Vertex position
            const x = radiusX * sinTheta * cosPhi;
            const y = radiusY * cosTheta;
            const z = radiusZ * sinTheta * sinPhi;
            vertices.push(x, y, z);

            // Normal for ellipsoid
            const nx = sinTheta * cosPhi / radiusX;
            const ny = cosTheta / radiusY;
            const nz = sinTheta * sinPhi / radiusZ;
            const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
            normals.push(nx / len, ny / len, nz / len);
        }
    }

    // Generate indices
    for (let lat = 0; lat < heightSegments; lat++) {
        for (let lon = 0; lon < widthSegments; lon++) {
            const first = lat * (widthSegments + 1) + lon;
            const second = first + widthSegments + 1;

            indices.push(first, second, first + 1);
            indices.push(second, second + 1, first + 1);
        }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geometry.setIndex(indices);

    return geometry;
}

/**
 * Creates a sphere with per-vertex normals (convenience function)
 */
function createSphere(radius = 0.5, widthSegments = 16, heightSegments = 12) {
    return createEllipsoid(radius, radius, radius, widthSegments, heightSegments);
}
