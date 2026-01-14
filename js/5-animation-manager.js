// ==========================================
// ANIMATION MANAGER
// ==========================================

let animationTime = 0;
let currentAnimation = 0;
const animationDuration = 4; // seconds per animation
const animationNames = ['Idle', 'Walk', 'Run', 'Head Turn', 'Jump'];

// Update info panel with current animation name
function updateInfoPanel() {
    const elem = document.getElementById('current-animation');
    if (elem) elem.textContent = animationNames[currentAnimation];
}

// Main animation update function
function updateAnimation(robot, deltaTime) {
    animationTime += deltaTime;
    
    // Reset pose at start of each animation
    if (animationTime < 0.05){
        robot.resetPose();
        updateInfoPanel();
    }

    const t = animationTime;

// Execute current animation
    switch (currentAnimation) {
        case 0: idleAnimation(robot, t); break;
        case 1: walkAnimation(robot, t); break;
        case 2: runAnimation(robot, t); break;
        case 3: waveAnimation(robot, t); break;
        case 4: rotateBodyAnimation(robot, t); break;
        case 5: fingerCurlAnimation(robot, t); break;
    }

    // Move to next animation after duration
    if (animationTime >= animationDuration) {
        animationTime = 0;
        currentAnimation = (currentAnimation + 1) % 5;
        robot.resetPose();
    }
}
