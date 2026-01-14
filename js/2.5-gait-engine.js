// ==========================================
// BÉZIER-BASED GAIT ENGINE FOR NATURAL WALKING
// ==========================================

/**
 * Evaluates a cubic Bézier curve at parameter t
 * @param {number} p0 - Control point 0
 * @param {number} p1 - Control point 1
 * @param {number} p2 - Control point 2
 * @param {number} p3 - Control point 3
 * @param {number} t - Parameter (0 to 1)
 * @returns {number} - Interpolated value
 */
function cubicBezier(p0, p1, p2, p3, t) {
    const oneMinusT = 1 - t;
    return (oneMinusT * oneMinusT * oneMinusT) * p0 +
           (3 * oneMinusT * oneMinusT * t) * p1 +
           (3 * oneMinusT * t * t) * p2 +
           (t * t * t) * p3;
}

/**
 * Lower-leg gait engine using Bézier curves for natural walking motion
 * Provides knee and ankle angles for realistic heel-strike and toe-off
 */
class LowerLegEngine {
    constructor(cycleTime = 1.0) {
        this.cycleTime = cycleTime;

        // Knee Bézier curve control points (x, y)
        // These create the knee bend pattern during walking
        this.kneeCurve = [
            { x: -0.9, y: 0.0 },  // Start: straight
            { x: -0.4, y: 0.6 },  // Lift phase
            { x: 0.6, y: 0.6 },   // Swing phase
            { x: 0.9, y: 0.0 }    // End: straight again
        ];

        // Ankle Bézier curve control points (x, y)
        // These create heel-strike and toe-off motion
        this.ankleCurve = [
            { x: -0.9, y: 0.0 },  // Heel strike
            { x: -0.6, y: 0.4 },  // Foot flat
            { x: 0.3, y: 0.7 },   // Toe-off (push)
            { x: 0.9, y: 0.0 }    // Swing through
        ];

        // Hip swing curve - forward/backward leg movement
        this.hipCurve = [
            { x: -0.9, y: -0.5 }, // Back position
            { x: -0.8, y: -0.3 }, // Moving forward
            { x: 0.3, y: 0.3 },   // Forward swing
            { x: 0.9, y: 0.5 }    // Maximum forward
        ];

        // Body height curve - compensates for leg bending to keep CoM stable
        this.heightCurve = [
            { x: -0.9, y: 0.0 },  // Neutral height
            { x: -0.3, y: -0.15 }, // Slight drop during double support
            { x: 0.3, y: -0.15 },  // Maintain low during swing
            { x: 0.9, y: 0.0 }    // Return to neutral
        ];

        // Amplitudes in degrees (converted to radians in getters)
        this.kneeAmp = 55;   // Maximum knee bend
        this.ankleAmp = 25;  // Maximum ankle flexion
        this.hipAmp = 50;    // Maximum hip swing (degrees)
        this.heightAmp = 0.08; // Body height adjustment (units)
    }

    /**
     * Evaluates a Bézier curve at given phase
     * @param {Array} curve - Array of 4 control points {x, y}
     * @param {number} phase - Phase value (0 to 1)
     * @returns {Object} - {x, y} coordinates on curve
     */
    evalCurve(curve, phase) {
        const x = cubicBezier(
            curve[0].x,
            curve[1].x,
            curve[2].x,
            curve[3].x,
            phase
        );

        const y = cubicBezier(
            curve[0].y,
            curve[1].y,
            curve[2].y,
            curve[3].y,
            phase
        );

        return { x, y };
    }

    /**
     * Gets phase within gait cycle (0 to 1)
     * @param {number} t - Current time
     * @param {number} offset - Phase offset for opposite leg
     * @returns {number} - Phase value (0 to 1)
     */
    getPhase(t, offset = 0) {
        const raw = (t + offset) % this.cycleTime;
        return raw / this.cycleTime;
    }

    /**
     * Gets complete gait data for both legs at given time
     * @param {number} t - Current time
     * @returns {Object} - Hip, knee, ankle angles and body height
     */
    getLowerLegAngles(t) {
        // Left leg phase (starts at 0)
        const phaseL = this.getPhase(t, 0);

        // Right leg phase (offset by half cycle)
        const phaseR = this.getPhase(t, this.cycleTime / 2);

        // Evaluate Bézier curves for left leg
        const hipL = this.evalCurve(this.hipCurve, phaseL);
        const kneeL = this.evalCurve(this.kneeCurve, phaseL);
        const ankleL = this.evalCurve(this.ankleCurve, phaseL);

        // Evaluate Bézier curves for right leg
        const hipR = this.evalCurve(this.hipCurve, phaseR);
        const kneeR = this.evalCurve(this.kneeCurve, phaseR);
        const ankleR = this.evalCurve(this.ankleCurve, phaseR);

        // Body height compensation (average of both legs)
        const heightL = this.evalCurve(this.heightCurve, phaseL);
        const heightR = this.evalCurve(this.heightCurve, phaseR);
        const bodyHeight = ((heightL.y + heightR.y) / 2) * this.heightAmp;

        // Convert to radians and return
        return {
            left_leg: {
                hip: (hipL.y * this.hipAmp) * (Math.PI / 180),
                knee: (kneeL.y * this.kneeAmp) * (Math.PI / 180),
                ankle: (ankleL.y * this.ankleAmp) * (Math.PI / 180)
            },
            right_leg: {
                hip: (hipR.y * this.hipAmp) * (Math.PI / 180),
                knee: (kneeR.y * this.kneeAmp) * (Math.PI / 180),
                ankle: (ankleR.y * this.ankleAmp) * (Math.PI / 180)
            },
            bodyHeight: bodyHeight  // Vertical adjustment to keep feet on ground
        };
    }
}

// Create global instance for use in animations
const gaitEngine = new LowerLegEngine(1.0);
