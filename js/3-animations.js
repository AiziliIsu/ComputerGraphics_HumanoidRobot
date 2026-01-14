// ==========================================
// ANIMATION FUNCTIONS
// ==========================================

// Animation 1: Idle - Breathing motion
function idleAnimation(robot, t) {
    const breathe = Math.sin(t * 2) * 0.03;
    if (robot.torso) {
        robot.torso.position.y = 1.6 + breathe;
    }
    robot.neck.rotation.x = Math.sin(t * 1.5) * 0.05;
    robot.applyConstraints();
}

// Animation 2: Walk - Natural walking cycle with Bézier-based gait
function walkAnimation(robot, t) {
    // Get complete gait data from Bézier gait engine
    const gaitTime = t * 0.6; // Adjust speed for natural walking pace
    const gaitData = gaitEngine.getLowerLegAngles(gaitTime);

    // HIPS - USE BÉZIER CURVES for natural hip swing
    robot.leftUpperLeg.rotation.x = gaitData.left_leg.hip;
    robot.rightUpperLeg.rotation.x = gaitData.right_leg.hip;

    // KNEES - USE BÉZIER CURVES for natural knee bend timing
    robot.leftKnee.rotation.x = gaitData.left_leg.knee;
    robot.rightKnee.rotation.x = gaitData.right_leg.knee;

    // ANKLES - USE BÉZIER CURVES for heel-strike and toe-off motion
    robot.leftAnkle.rotation.x = -gaitData.left_leg.ankle;  // Negative for proper forward flex
    robot.rightAnkle.rotation.x = -gaitData.right_leg.ankle;

    // BODY HEIGHT - Compensate for leg bending to keep feet on ground
    // This is the key to preventing feet from sinking or flying!
    robot.root.position.y = gaitData.bodyHeight;

    // Forward movement - simulates ground moving backward
    robot.root.position.z = t * 0.3;

    // Apply constraints
    robot.applyConstraints();
}

// Animation 3: Run - Faster, more dynamic with forward motion
function runAnimation(robot, t) {
    const runSpeed = 5;
    const step = Math.sin(t * runSpeed);
    const step2 = Math.sin(t * runSpeed + Math.PI);

    // Legs - more pronounced
    robot.leftUpperLeg.rotation.x = step * 0.8;
    robot.leftKnee.rotation.x = Math.max(0, -step * 1.2);
    robot.leftAnkle.rotation.x = step * 0.5;

    robot.rightUpperLeg.rotation.x = step2 * 0.8;
    robot.rightKnee.rotation.x = Math.max(0, -step2 * 1.2);
    robot.rightAnkle.rotation.x = step2 * 0.5;

    // Forward lean and bob with forward movement
    robot.root.rotation.x = -0.1;
    robot.root.position.y = Math.abs(Math.sin(t * runSpeed * 2)) * 0.12;
    robot.root.position.z = t * 1.2;  // Fast forward running motion

    robot.applyConstraints();
}

// Animation 4: Head Turn - Look around
function waveAnimation(robot, t) {
    const turnSpeed = 2;

    // Head turns left and right
    robot.neck.rotation.y = Math.sin(t * turnSpeed) * 0.8;
    robot.neck.rotation.x = Math.sin(t * turnSpeed * 0.5) * 0.15;

    robot.applyConstraints();
}

// Animation 5: Jump - Simple jumping motion
function rotateBodyAnimation(robot, t) {
    const jumpSpeed = 2;
    const phase = (t * jumpSpeed) % (Math.PI * 2);

    // Jump height
    const jumpHeight = Math.max(0, Math.sin(phase)) * 0.3;
    robot.root.position.y = jumpHeight;

    // Bend knees during takeoff and landing
    const kneeBend = Math.max(0, Math.sin(phase)) * 0.5;
    robot.leftKnee.rotation.x = kneeBend;
    robot.rightKnee.rotation.x = kneeBend;

    // Ankle flex
    robot.leftAnkle.rotation.x = -kneeBend * 0.5;
    robot.rightAnkle.rotation.x = -kneeBend * 0.5;

    robot.applyConstraints();
}
