
// ==========================================
// MAIN - INITIALIZATION & RENDER LOOP
// ==========================================

// Create robot instance
const robot = new HumanoidRobot();
scene.add(robot.root);

// Make robot globally accessible for controls
window.robot = robot;

// Clock for delta time
const clock = new THREE.Clock();

// Main animation loop
function animate() {
    requestAnimationFrame(animate);
    
    const deltaTime = clock.getDelta();
    updateAnimation(robot, deltaTime);
    
    // Camera orbits around robot (disabled when dragging)
    if (!isDragging) {
        const cameraAngle = Date.now() * 0.0001;
        camera.position.x = Math.sin(cameraAngle) * 5;
        camera.position.z = Math.cos(cameraAngle) * 5;
    }
    camera.lookAt(0, 1.5, 0);
    
    renderer.render(scene, camera);
}

// Start the animation loop
animate();
