# 3D Humanoid Robot Animation with Three.js

An interactive 3D humanoid robot built with Three.js, featuring realistic walking animations, procedural gait generation, and modular animation system. This project demonstrates advanced computer graphics concepts including hierarchical modeling, inverse kinematics, and procedural animation.

##  Table of Contents
- [Features](#features)
- [Demo](#demo)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Animation System](#animation-system)
- [Architecture](#architecture)
- [Controls](#controls)
- [Authors](#authors)

##  Features

- **Realistic Humanoid Model**: Fully articulated robot with hierarchical joint structure
- **Procedural Walking Animation**: Physics-based gait engine with smooth transitions
- **Multiple Animation States**: Idle, walking, running, and custom animations
- **Modular Architecture**: Clean separation of concerns across 6 specialized modules
- **Real-time Rendering**: Smooth 60 FPS performance using Three.js WebGL
- **Dynamic Camera**: Orbiting camera that follows the robot
- **Interactive UI**: Real-time display of current animation state

##  Demo

Open `basic.html` in a modern web browser to see the robot in action. The robot will automatically cycle through different animations.

##  Technologies

- **Three.js** - 3D graphics library for WebGL rendering
- **JavaScript (ES6+)** - Core programming language
- **HTML5 Canvas** - Rendering context
- **WebGL** - Low-level graphics API

##  Project Structure

```
.
├── basic.html              # Main HTML entry point
├── js/
│   ├── 1-scene-setup.js    # Scene, camera, lighting, and renderer setup
│   ├── 1.5-geometry-utils.js # Utility functions for creating 3D geometries
│   ├── 2-robot-class.js    # HumanoidRobot class definition
│   ├── 2.5-gait-engine.js  # Walking animation and gait cycle logic
│   ├── 3-animations.js     # Animation functions and state management
│   ├── 4-controls.js       # User input controls (currently disabled)
│   ├── 5-animation-manager.js # Animation sequencing and transitions
│   └── 6-main.js           # Main loop and initialization
├── three.min.js            # Three.js library
└── README.md
```

### Module Breakdown

1. **Scene Setup** (`1-scene-setup.js`)
   - WebGL renderer initialization
   - Camera and scene configuration
   - Lighting setup (ambient + directional)
   - Ground plane and background

2. **Geometry Utils** (`1.5-geometry-utils.js`)
   - Helper functions for creating robot body parts
   - Reusable geometry creation utilities

3. **Robot Class** (`2-robot-class.js`)
   - Hierarchical robot structure
   - Joint definitions and constraints
   - Body part creation and assembly
   - 488 lines of detailed robot construction

4. **Gait Engine** (`2.5-gait-engine.js`)
   - Procedural walking animation
   - Leg movement synchronization
   - Stride and step calculations

5. **Animations** (`3-animations.js`)
   - Animation state definitions
   - Transition logic
   - Update loop for animation playback

6. **Animation Manager** (`5-animation-manager.js`)
   - High-level animation sequencing
   - State machine for animation flows

7. **Main** (`6-main.js`)
   - Application entry point
   - Render loop
   - Camera orbit control


##  Animation System

The project features a sophisticated animation system:

### Gait Engine
- **Stride Calculation**: Procedurally generates walking motion
- **Joint Constraints**: Realistic range of motion for hips, knees, and ankles
- **Phase-based Movement**: Synchronizes left and right leg movements

### Animation States
- **Idle**: Subtle breathing motion
- **Walk**: Natural walking gait with arm swing
- **Run**: Faster movement with increased stride
- **Custom Sequences**: Easily extensible for new animations

##  Architecture

The project follows a modular architecture with clear separation of concerns:

```
┌─────────────────┐
│   Main Loop     │ (6-main.js)
└────────┬────────┘
         │
         ├─────────────────┬─────────────────┬──────────────────┐
         │                 │                 │                  │
┌────────▼────────┐ ┌──────▼──────┐ ┌────────▼────────┐ ┌──────▼──────┐
│ Animation Mgr   │ │   Robot     │ │    Scene        │ │   Controls  │
│ (5-*.js)        │ │   (2-*.js)  │ │    (1-*.js)     │ │   (4-*.js)  │
└─────────────────┘ └──────┬──────┘ └─────────────────┘ └─────────────┘
                           │
                    ┌──────▼──────┐
                    │ Gait Engine │
                    │ (2.5-*.js)  │
                    └─────────────┘
```

##  Controls

Currently, the robot is set to auto-play animations:
- **Camera**: Automatically orbits around the robot
- **Animations**: Cycle automatically through different states

*Note: User controls are currently disabled but can be re-enabled in `4-controls.js`*


## 🙏 Acknowledgments

- Built with [Three.js](https://threejs.org/)
- Computer Graphics Course Project

