// ==========================================
// HUMANOID ROBOT CLASS - IMPROVED DESIGN
// ==========================================

class HumanoidRobot {
    constructor() {
        this.root = new THREE.Group();

        // Body parts
        this.head = null;
        this.neck = null;
        this.torso = null;

        // Left leg components
        this.leftHip = null;
        this.leftHipJoint = null;
        this.leftUpperLeg = null;
        this.leftKnee = null;
        this.leftKneeJoint = null;
        this.leftLowerLeg = null;
        this.leftAnkle = null;
        this.leftAnkleJoint = null;
        this.leftFoot = null;

        // Right leg components
        this.rightHip = null;
        this.rightHipJoint = null;
        this.rightUpperLeg = null;
        this.rightKnee = null;
        this.rightKneeJoint = null;
        this.rightLowerLeg = null;
        this.rightAnkle = null;
        this.rightAnkleJoint = null;
        this.rightFoot = null;

        // Arm placeholders (for future expansion)
        this.leftShoulder = null;
        this.leftUpperArm = null;
        this.leftLowerArm = null;
        this.leftHand = null;

        this.rightShoulder = null;
        this.rightUpperArm = null;
        this.rightLowerArm = null;
        this.rightHand = null;

        // Joint constraints
        this.jointConstraints = {
            hipX: { min: -1.0, max: 1.0 },      // Forward/backward swing
            hipY: { min: -0.3, max: 0.3 },      // Left/right rotation
            hipZ: { min: -0.3, max: 0.3 },      // Tilt
            kneeX: { min: 0, max: 2.5 },        // Bend (only forward)
            ankleX: { min: -0.5, max: 0.8 },    // Toe up/down
            ankleZ: { min: -0.3, max: 0.3 },    // Ankle tilt
            shoulderX: { min: -2.8, max: 2.8 }, // Arm forward/back
            shoulderY: { min: -1.0, max: 1.0 }, // Arm rotation
            shoulderZ: { min: -1.5, max: 1.5 }, // Arm up/down
            elbowX: { min: 0, max: 2.8 },       // Bend (only forward)
            neckX: { min: -0.5, max: 0.5 },     // Head up/down
            neckY: { min: -1.2, max: 1.2 }      // Head left/right
        };

        this.buildRobot();
    }

    // ==========================================
    // UTILITY: CREATE MESH FROM GEOMETRY
    // ==========================================
    createMesh(geometry, color) {
        const material = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.5,
            metalness: 0.5,
            flatShading: false
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    }

    // ==========================================
    // APPLY JOINT CONSTRAINTS
    // ==========================================
    constrainJoint(joint, axis, minMax) {
        if (joint && minMax) {
            if (axis === 'x') {
                joint.rotation.x = Math.max(minMax.min, Math.min(minMax.max, joint.rotation.x));
            } else if (axis === 'y') {
                joint.rotation.y = Math.max(minMax.min, Math.min(minMax.max, joint.rotation.y));
            } else if (axis === 'z') {
                joint.rotation.z = Math.max(minMax.min, Math.min(minMax.max, joint.rotation.z));
            }
        }
    }

    // ==========================================
    // BUILD HEAD & NECK
    // ==========================================
    buildHead() {
        // Neck - small elliptical cylinder
        this.neck = new THREE.Group();
        this.neck.position.y = 2.1;

        const neckGeometry = createEllipticalCylinder(0.08, 0.07, 0.15, 16, 2);
        const neckMesh = this.createMesh(neckGeometry, 0x4a90e2);
        neckMesh.position.y = 0.075;
        this.neck.add(neckMesh);

        // Head - ellipsoid
        const headGeometry = createEllipsoid(0.18, 0.22, 0.16, 24, 20);
        this.head = this.createMesh(headGeometry, 0x5da3f5);
        this.head.position.y = 0.32;
        this.neck.add(this.head);

        // Eyes - small spheres
        const eyeGeometry = createSphere(0.03, 12, 10);

        const leftEye = this.createMesh(eyeGeometry, 0xffffff);
        leftEye.position.set(-0.08, 0.35, 0.14);
        this.neck.add(leftEye);

        const rightEye = this.createMesh(eyeGeometry, 0xffffff);
        rightEye.position.set(0.08, 0.35, 0.14);
        this.neck.add(rightEye);

        // Pupils
        const pupilGeometry = createSphere(0.015, 8, 6);
        const leftPupil = this.createMesh(pupilGeometry, 0x000000);
        leftPupil.position.set(-0.08, 0.35, 0.17);
        this.neck.add(leftPupil);

        const rightPupil = this.createMesh(pupilGeometry, 0x000000);
        rightPupil.position.set(0.08, 0.35, 0.17);
        this.neck.add(rightPupil);

        return this.neck;
    }

    // ==========================================
    // BUILD TORSO
    // ==========================================
    buildTorso() {
        const torsoGroup = new THREE.Group();

        // Main torso - ellipsoid
        const torsoGeometry = createEllipsoid(0.28, 0.45, 0.2, 24, 20);
        this.torso = this.createMesh(torsoGeometry, 0x4a8cd9);
        this.torso.position.y = 1.6;
        torsoGroup.add(this.torso);

        return torsoGroup;
    }

    // ==========================================
    // BUILD LEFT LEG
    // ==========================================
    buildLeftLeg() {
        // Hip joint group
        this.leftHip = new THREE.Group();
        this.leftHip.position.set(-0.14, 1.15, 0);

        // Hip joint sphere
        const hipJointGeometry = createSphere(0.09, 16, 12);
        this.leftHipJoint = this.createMesh(hipJointGeometry, 0x3d7ac7);
        this.leftHip.add(this.leftHipJoint);

        // Upper leg group (rotation point at hip)
        this.leftUpperLeg = new THREE.Group();

        // Upper leg - elliptical cylinder (slightly tapered)
        const upperLegGeometry = createEllipticalCylinder(0.09, 0.07, 0.5, 20, 4);
        const upperLegMesh = this.createMesh(upperLegGeometry, 0x5da3f5);
        upperLegMesh.position.y = -0.25;
        this.leftUpperLeg.add(upperLegMesh);

        // Knee group
        this.leftKnee = new THREE.Group();
        this.leftKnee.position.y = -0.5;

        // Knee joint - ellipsoid
        const kneeJointGeometry = createEllipsoid(0.08, 0.08, 0.09, 16, 12);
        this.leftKneeJoint = this.createMesh(kneeJointGeometry, 0x3d7ac7);
        this.leftKnee.add(this.leftKneeJoint);

        // Lower leg - elliptical cylinder (tapered)
        this.leftLowerLeg = new THREE.Group();
        const lowerLegGeometry = createEllipticalCylinder(0.07, 0.06, 0.5, 20, 4);
        const lowerLegMesh = this.createMesh(lowerLegGeometry, 0x6ba8f2);
        lowerLegMesh.position.y = -0.25;
        this.leftLowerLeg.add(lowerLegMesh);

        // Ankle group
        this.leftAnkle = new THREE.Group();
        this.leftAnkle.position.y = -0.5;

        // Ankle joint - small sphere
        const ankleJointGeometry = createSphere(0.06, 12, 10);
        this.leftAnkleJoint = this.createMesh(ankleJointGeometry, 0x3d7ac7);
        this.leftAnkle.add(this.leftAnkleJoint);

        // Foot - elliptical cylinder (horizontal)
        this.leftFoot = new THREE.Group();
        const footGeometry = createEllipticalCylinder(0.08, 0.06, 0.22, 16, 2);
        const footMesh = this.createMesh(footGeometry, 0x2a5a8f);
        footMesh.rotation.x = Math.PI / 2;
        footMesh.position.z = 0.06;
        footMesh.position.y = -0.04;
        this.leftFoot.add(footMesh);

        // Build hierarchy
        this.leftAnkle.add(this.leftFoot);
        this.leftLowerLeg.add(this.leftAnkle);
        this.leftKnee.add(this.leftLowerLeg);
        this.leftUpperLeg.add(this.leftKnee);
        this.leftHip.add(this.leftUpperLeg);

        return this.leftHip;
    }

    // ==========================================
    // BUILD RIGHT LEG (mirror of left)
    // ==========================================
    buildRightLeg() {
        // Hip joint group
        this.rightHip = new THREE.Group();
        this.rightHip.position.set(0.14, 1.15, 0);

        // Hip joint sphere
        const hipJointGeometry = createSphere(0.09, 16, 12);
        this.rightHipJoint = this.createMesh(hipJointGeometry, 0x3d7ac7);
        this.rightHip.add(this.rightHipJoint);

        // Upper leg group
        this.rightUpperLeg = new THREE.Group();

        // Upper leg - elliptical cylinder
        const upperLegGeometry = createEllipticalCylinder(0.09, 0.07, 0.5, 20, 4);
        const upperLegMesh = this.createMesh(upperLegGeometry, 0x5da3f5);
        upperLegMesh.position.y = -0.25;
        this.rightUpperLeg.add(upperLegMesh);

        // Knee group
        this.rightKnee = new THREE.Group();
        this.rightKnee.position.y = -0.5;

        // Knee joint - ellipsoid
        const kneeJointGeometry = createEllipsoid(0.08, 0.08, 0.09, 16, 12);
        this.rightKneeJoint = this.createMesh(kneeJointGeometry, 0x3d7ac7);
        this.rightKnee.add(this.rightKneeJoint);

        // Lower leg - elliptical cylinder
        this.rightLowerLeg = new THREE.Group();
        const lowerLegGeometry = createEllipticalCylinder(0.07, 0.06, 0.5, 20, 4);
        const lowerLegMesh = this.createMesh(lowerLegGeometry, 0x6ba8f2);
        lowerLegMesh.position.y = -0.25;
        this.rightLowerLeg.add(lowerLegMesh);

        // Ankle group
        this.rightAnkle = new THREE.Group();
        this.rightAnkle.position.y = -0.5;

        // Ankle joint - small sphere
        const ankleJointGeometry = createSphere(0.06, 12, 10);
        this.rightAnkleJoint = this.createMesh(ankleJointGeometry, 0x3d7ac7);
        this.rightAnkle.add(this.rightAnkleJoint);

        // Foot - elliptical cylinder (horizontal)
        this.rightFoot = new THREE.Group();
        const footGeometry = createEllipticalCylinder(0.08, 0.06, 0.22, 16, 2);
        const footMesh = this.createMesh(footGeometry, 0x2a5a8f);
        footMesh.rotation.x = Math.PI / 2;
        footMesh.position.z = 0.06;
        footMesh.position.y = -0.04;
        this.rightFoot.add(footMesh);

        // Build hierarchy
        this.rightAnkle.add(this.rightFoot);
        this.rightLowerLeg.add(this.rightAnkle);
        this.rightKnee.add(this.rightLowerLeg);
        this.rightUpperLeg.add(this.rightKnee);
        this.rightHip.add(this.rightUpperLeg);

        return this.rightHip;
    }

    // ==========================================
    // BUILD ARM PLACEHOLDERS (Simple versions)
    // ==========================================
    buildLeftArm() {
        this.leftShoulder = new THREE.Group();
        this.leftShoulder.position.set(-0.32, 1.8, 0);

        this.leftUpperArm = new THREE.Group();

        // Shoulder joint
        const shoulderJointGeom = createSphere(0.07, 12, 10);
        const shoulderJoint = this.createMesh(shoulderJointGeom, 0x3d7ac7);
        this.leftShoulder.add(shoulderJoint);

        // Upper arm - cylinder
        const upperArmGeom = createCylinder(0.06, 0.05, 0.4, 16, 2);
        const upperArmMesh = this.createMesh(upperArmGeom, 0x7cb5f7);
        upperArmMesh.position.y = -0.2;
        this.leftUpperArm.add(upperArmMesh);

        // Lower arm group
        this.leftLowerArm = new THREE.Group();
        this.leftLowerArm.position.y = -0.4;

        // Elbow joint
        const elbowJointGeom = createSphere(0.055, 12, 10);
        const elbowJoint = this.createMesh(elbowJointGeom, 0x3d7ac7);
        this.leftLowerArm.add(elbowJoint);

        // Lower arm - cylinder
        const lowerArmGeom = createCylinder(0.05, 0.04, 0.38, 16, 2);
        const lowerArmMesh = this.createMesh(lowerArmGeom, 0x6ba8f2);
        lowerArmMesh.position.y = -0.19;
        this.leftLowerArm.add(lowerArmMesh);

        // Simple hand - ellipsoid
        this.leftHand = new THREE.Group();
        this.leftHand.position.y = -0.38;
        const handGeom = createEllipsoid(0.05, 0.08, 0.035, 16, 12);
        const handMesh = this.createMesh(handGeom, 0x4a90e2);
        handMesh.position.y = -0.06;
        this.leftHand.add(handMesh);

        // For animation compatibility, add fingers userData
        this.leftHand.userData.fingers = [];

        // Build hierarchy
        this.leftLowerArm.add(this.leftHand);
        this.leftUpperArm.add(this.leftLowerArm);
        this.leftShoulder.add(this.leftUpperArm);

        return this.leftShoulder;
    }

    buildRightArm() {
        this.rightShoulder = new THREE.Group();
        this.rightShoulder.position.set(0.32, 1.8, 0);

        this.rightUpperArm = new THREE.Group();

        // Shoulder joint
        const shoulderJointGeom = createSphere(0.07, 12, 10);
        const shoulderJoint = this.createMesh(shoulderJointGeom, 0x3d7ac7);
        this.rightShoulder.add(shoulderJoint);

        // Upper arm
        const upperArmGeom = createCylinder(0.06, 0.05, 0.4, 16, 2);
        const upperArmMesh = this.createMesh(upperArmGeom, 0x7cb5f7);
        upperArmMesh.position.y = -0.2;
        this.rightUpperArm.add(upperArmMesh);

        // Lower arm group
        this.rightLowerArm = new THREE.Group();
        this.rightLowerArm.position.y = -0.4;

        // Elbow joint
        const elbowJointGeom = createSphere(0.055, 12, 10);
        const elbowJoint = this.createMesh(elbowJointGeom, 0x3d7ac7);
        this.rightLowerArm.add(elbowJoint);

        // Lower arm
        const lowerArmGeom = createCylinder(0.05, 0.04, 0.38, 16, 2);
        const lowerArmMesh = this.createMesh(lowerArmGeom, 0x6ba8f2);
        lowerArmMesh.position.y = -0.19;
        this.rightLowerArm.add(lowerArmMesh);

        // Simple hand
        this.rightHand = new THREE.Group();
        this.rightHand.position.y = -0.38;
        const handGeom = createEllipsoid(0.05, 0.08, 0.035, 16, 12);
        const handMesh = this.createMesh(handGeom, 0x4a90e2);
        handMesh.position.y = -0.06;
        this.rightHand.add(handMesh);

        // For animation compatibility
        this.rightHand.userData.fingers = [];

        // Build hierarchy
        this.rightLowerArm.add(this.rightHand);
        this.rightUpperArm.add(this.rightLowerArm);
        this.rightShoulder.add(this.rightUpperArm);

        return this.rightShoulder;
    }

    // ==========================================
    // ASSEMBLE COMPLETE ROBOT
    // ==========================================
    buildRobot() {
        const torso = this.buildTorso();
        const head = this.buildHead();
        const leftLeg = this.buildLeftLeg();
        const rightLeg = this.buildRightLeg();
        const leftArm = this.buildLeftArm();
        const rightArm = this.buildRightArm();

        this.root.add(torso);
        this.root.add(head);
        this.root.add(leftLeg);
        this.root.add(rightLeg);
        this.root.add(leftArm);
        this.root.add(rightArm);

        this.root.position.y = 0;
    }

    // ==========================================
    // RESET TO NEUTRAL POSE
    // ==========================================
    resetPose() {
        // Reset neck/head
        if (this.neck) this.neck.rotation.set(0, 0, 0);

        // Reset left leg
        if (this.leftHip) this.leftHip.rotation.set(0, 0, 0);
        if (this.leftUpperLeg) this.leftUpperLeg.rotation.set(0, 0, 0);
        if (this.leftKnee) this.leftKnee.rotation.set(0, 0, 0);
        if (this.leftLowerLeg) this.leftLowerLeg.rotation.set(0, 0, 0);
        if (this.leftAnkle) this.leftAnkle.rotation.set(0, 0, 0);
        if (this.leftFoot) this.leftFoot.rotation.set(0, 0, 0);

        // Reset right leg
        if (this.rightHip) this.rightHip.rotation.set(0, 0, 0);
        if (this.rightUpperLeg) this.rightUpperLeg.rotation.set(0, 0, 0);
        if (this.rightKnee) this.rightKnee.rotation.set(0, 0, 0);
        if (this.rightLowerLeg) this.rightLowerLeg.rotation.set(0, 0, 0);
        if (this.rightAnkle) this.rightAnkle.rotation.set(0, 0, 0);
        if (this.rightFoot) this.rightFoot.rotation.set(0, 0, 0);

        // Reset arms
        if (this.leftShoulder) this.leftShoulder.rotation.set(0, 0, 0);
        if (this.leftUpperArm) this.leftUpperArm.rotation.set(0, 0, 0);
        if (this.leftLowerArm) this.leftLowerArm.rotation.set(0, 0, 0);

        if (this.rightShoulder) this.rightShoulder.rotation.set(0, 0, 0);
        if (this.rightUpperArm) this.rightUpperArm.rotation.set(0, 0, 0);
        if (this.rightLowerArm) this.rightLowerArm.rotation.set(0, 0, 0);

        // Reset root
        this.root.position.set(0, 0, 0);
        this.root.rotation.set(0, 0, 0);
    }

    // ==========================================
    // APPLY ALL JOINT CONSTRAINTS
    // ==========================================
    applyConstraints() {
        // Hip constraints
        this.constrainJoint(this.leftUpperLeg, 'x', this.jointConstraints.hipX);
        this.constrainJoint(this.leftUpperLeg, 'y', this.jointConstraints.hipY);
        this.constrainJoint(this.leftUpperLeg, 'z', this.jointConstraints.hipZ);

        this.constrainJoint(this.rightUpperLeg, 'x', this.jointConstraints.hipX);
        this.constrainJoint(this.rightUpperLeg, 'y', this.jointConstraints.hipY);
        this.constrainJoint(this.rightUpperLeg, 'z', this.jointConstraints.hipZ);

        // Knee constraints (only forward bend)
        this.constrainJoint(this.leftKnee, 'x', this.jointConstraints.kneeX);
        this.constrainJoint(this.rightKnee, 'x', this.jointConstraints.kneeX);

        // Ankle constraints
        this.constrainJoint(this.leftAnkle, 'x', this.jointConstraints.ankleX);
        this.constrainJoint(this.leftAnkle, 'z', this.jointConstraints.ankleZ);
        this.constrainJoint(this.rightAnkle, 'x', this.jointConstraints.ankleX);
        this.constrainJoint(this.rightAnkle, 'z', this.jointConstraints.ankleZ);

        // Shoulder constraints
        this.constrainJoint(this.leftUpperArm, 'x', this.jointConstraints.shoulderX);
        this.constrainJoint(this.leftUpperArm, 'z', this.jointConstraints.shoulderZ);
        this.constrainJoint(this.rightUpperArm, 'x', this.jointConstraints.shoulderX);
        this.constrainJoint(this.rightUpperArm, 'z', this.jointConstraints.shoulderZ);

        // Elbow constraints (only forward bend)
        this.constrainJoint(this.leftLowerArm, 'x', this.jointConstraints.elbowX);
        this.constrainJoint(this.rightLowerArm, 'x', this.jointConstraints.elbowX);

        // Neck constraints
        this.constrainJoint(this.neck, 'x', this.jointConstraints.neckX);
        this.constrainJoint(this.neck, 'y', this.jointConstraints.neckY);
    }
}
