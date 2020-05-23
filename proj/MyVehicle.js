/**
* MyVehicle
* @constructor
*/
class MyVehicle extends CGFobject {
    constructor(scene) {
        super(scene);

        this.deltaTime = 50;

        this.sphere = new MySphere(this.scene, 20, 20);
        this.cilinder = new MyCilinder(this.scene, 20);
        this.rudder = new MyRudder(this.scene);
        this.doublePlane = new MyDoubleSidedPlane(this.scene, 1, 30);
        this.doublePlaneLow = new MyDoubleSidedPlane(this.scene, 1, 2);

        this.hullAppearance = new CGFappearance(this.scene);
        this.hullAppearance.loadTexture("images/zepellin_balloon.png");

        this.testAppearance = new CGFappearance(this.scene);
        this.testAppearance.loadTexture("images/testMap.jpg");

        this.rudderAppearance = new CGFappearance(this.scene);
        this.rudderAppearance.loadTexture("images/rudder.png");

        this.mainGondolaAppearance = new CGFappearance(this.scene);
        this.mainGondolaAppearance.loadTexture("images/gondola_main.png");

        this.topsGondolaAppearance = new CGFappearance(this.scene);
        this.topsGondolaAppearance.loadTexture("images/gondola_tops.png");

        this.rotorAppearance = new CGFappearance(this.scene);
        this.rotorAppearance.loadTexture("images/rotor.png");

        this.rotorBladeAppearance = new CGFappearance(this.scene);
        this.rotorBladeAppearance.loadTexture("images/roto_blade.png");

        this.flagAppearance = new CGFappearance(this.scene);
        this.flagAppearance.loadTexture("images/bioshock_columbia_flag.jpg");

        this.phase = 0.0;
        this.flagShader = new CGFshader(this.scene.gl, "shaders/flag.vert", "shaders/flag.frag");
        this.flagShader.setUniformsValues({ timeFactor: this.phase });

        this.autoPilotEnabled = false;

        this.reset();
    }

    getPosition() {
        return this.position;
    }

    getAngle() {
        return this.curAngle;
    }

    onEngineChange(engine) {
        if (engine == this.scene.DEFAULT_ENGINE) {
            this.speed[0] = Math.sqrt(this.speed[0]**2 + this.speed[1]**2 + this.speed[2]**2);
        }
        else { // IMPROVED_ENGINE
            this.speed[2] = this.speed[0] * Math.cos(this.curAngle);
            this.speed[1] = 0;
            this.speed[0] = this.speed[0] * Math.sin(this.curAngle);
        }
    }

    autoPilot() {
        // These numbers come from the equations of Circular Motion
        // All praise Villate and FIS1: https://def.fe.up.pt/dinamica/movimento_curvilineo.html
        this.acceleration = 0;
        this.turned = (Math.PI * 2.0 / 5.0);
        this.speed[0] = this.turned * 5 * this.deltaTime;
    }

    toggleAutoPilot() {
        this.autoPilotEnabled = !this.autoPilotEnabled;
    }

    lerp(v0, v1, t) {
        return (1 - t) * v0 + t * v1;
    }

    clamp(value, min, max) {
        return Math.max(min, Math.min(value, max));
    }

    update(t) {

        this.deltaTime = t;
        this.phase += this.deltaTime;

        // This overrides all inputs, so the rest of the logic is sound
        // we only need to give it the theoretical values to keep itself going
        if (this.autoPilotEnabled)
            this.autoPilot(t);

        // Animate rotors
        if (this.scene.engineVersion == this.scene.DEFAULT_ENGINE) {
            this.rotorAngle += this.speed[0] * 0.75 + 0.05;
        }
        else {
            // TODO: Make this one smooth, but not that important
            if (this.acceleration > 0)
                this.rotorAngle += 0.4 * this.scene.speedFactor;
            else if (this.acceleration < 0)
                this.rotorAngle -= 0.4 * this.scene.speedFactor;
            else
                this.rotorAngle += 0.05;
        }

        // Animate Rudders
        if (this.turned > 0)
            this.rudderAngle = this.lerp(this.rudderAngle, -0.25 * this.scene.turnRadius, this.clamp(this.deltaTime * 3, 0, 1));
        else if (this.turned < 0)
            this.rudderAngle = this.lerp(this.rudderAngle, 0.25 * this.scene.turnRadius, this.clamp(this.deltaTime * 3, 0, 1));
        else
            this.rudderAngle = this.lerp(this.rudderAngle, 0, this.clamp(this.deltaTime * 3, 0, 1));

        // Apply deltatime
        this.acceleration *= this.deltaTime;
        this.turned *= this.deltaTime;
        this.curAngle += this.turned;
        
        // Adjust position
        if (this.scene.engineVersion == this.scene.DEFAULT_ENGINE) {
            this.speed[0] += this.acceleration;
            this.speed[0] = Math.max(0, this.speed[0]);

            if (this.autoPilotEnabled) {
                this.position[0] += this.speed[0] * Math.sin(this.curAngle);
                this.position[2] += this.speed[0] * Math.cos(this.curAngle);
            }
            else {
                this.position[0] += this.scene.speedFactor * this.speed[0] * Math.sin(this.curAngle);
                this.position[2] += this.scene.speedFactor * this.speed[0] * Math.cos(this.curAngle);
            }
            this.phase += 2 * this.speed[0];
        }
        else {
            this.speed[0] += this.acceleration * Math.sin(this.curAngle);
            this.speed[2] += this.acceleration * Math.cos(this.curAngle);

            if (this.autoPilotEnabled) {
                this.position[0] += this.speed[0];
                this.position[2] += this.speed[2];
            }
            else {
                this.position[0] += this.speed[0] * this.scene.speedFactor;
                this.position[2] += this.speed[2] * this.scene.speedFactor;
            }

            this.phase += 2 * Math.sqrt(this.speed[0]**2 + this.speed[2]**2);

            this.speed[0] *= 0.95;
            this.speed[2] *= 0.95;
        }

        this.flagShader.setUniformsValues({ timeFactor: this.phase });

        // Reset inputs (in auto-pilot it doesn't matter anyway xD)
        this.acceleration = 0;
        this.turned = 0;
    }

    turn(val) {
        this.turned = val;
    }

    accelerate(val) {
        this.acceleration = val;
    }

    reset() {
        // Physics
        this.curAngle = 0;
        this.speed = [0, 0, 0];
        this.position = [0, 10, 0];
        this.autoPilotEnabled = false;

        // Inputs (and physics)
        this.acceleration = 0;
        this.turned = 0;

        // Display
        this.thrusting = 0;
        this.rotorAngle = 0;
        this.turning = 0;
        this.rudderAngle = 0;
    }

    displayFlag() {
        this.scene.pushMatrix();
        this.flagAppearance.apply();
        var oldShader = this.scene.activeShader;
        this.scene.setActiveShader(this.flagShader);
        this.scene.scale(2, 1, 1);
        this.doublePlane.display();
        this.scene.setActiveShader(oldShader);
        this.scene.popMatrix();
        
        this.scene.activeTexture = null;
        this.scene.pushMatrix();
        this.scene.translate(-1.75, 0.2, 0);
        this.scene.scale(1.5, 0.02, 0.02);
        this.doublePlaneLow.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.scene.translate(-1.75, -0.2, 0);
        this.scene.scale(1.5, 0.02, 0.02);
        this.doublePlaneLow.display();
        this.scene.popMatrix();
    }

    displayRudders() {
        this.rudderAppearance.apply();

        var separation = 0.35;
        // Top
        this.scene.pushMatrix();
        this.scene.translate(0, separation, -1.5);
        this.scene.rotate(this.rudderAngle, 0, 1, 0);
        this.rudder.display();
        this.scene.popMatrix();

        // Bottom
        this.scene.pushMatrix();
        this.scene.translate(0, -separation, -1.5);
        this.scene.rotate(this.rudderAngle, 0, 1, 0);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.rudder.display();
        this.scene.popMatrix();

        // Right
        this.scene.pushMatrix();
        this.scene.translate(separation, 0, -1.5);
        this.scene.rotate(-Math.PI / 2, 0, 0, 1);
        this.rudder.display();
        this.scene.popMatrix();

        // Left
        this.scene.pushMatrix();
        this.scene.translate(-separation, 0, -1.5);
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        this.rudder.display();
        this.scene.popMatrix();
    }

    displayHull(){
        this.hullAppearance.apply();

        this.scene.pushMatrix();
        this.scene.translate(0, 0.15, 0);
        this.scene.pushMatrix();
        this.scene.scale(0.85, 0.85, 2);
        this.sphere.display();
        this.scene.popMatrix();
        this.displayRudders();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(this.rudderAngle / 2, 0, 1, 0);
        this.scene.translate(0, 0.15, -4.2);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.displayFlag();
        this.scene.popMatrix();
    }

    displaySinglePropeller(){
        this.scene.pushMatrix();
        this.rotorAppearance.apply();
        this.scene.scale(0.08, 0.08, 0.2);
        this.sphere.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.rotorBladeAppearance.apply();
        this.scene.translate(0, 0, -0.23);
        this.scene.rotate(this.rotorAngle, 0, 0, 1);
        this.scene.scale(0.01, 0.12, 0.03);
        this.sphere.display();
        this.scene.popMatrix();
    }

    displayPropellers() {
        this.scene.pushMatrix();
        this.scene.translate(0.275, -0.15, -0.65);
        this.displaySinglePropeller();
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.scene.translate(-0.275, -0.15, -0.65);
        this.displaySinglePropeller();
        this.scene.popMatrix();
    }

    displayGondola() {
        // Cilinder
        this.mainGondolaAppearance.apply();
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -0.6);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.scale(0.25, 1.4, 0.25);
        this.cilinder.display();
        this.scene.popMatrix();
        
        this.topsGondolaAppearance.apply();

        // Sphere 1
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -0.55);
        this.scene.scale(0.246, 0.246, 0.246);
        this.sphere.display();
        this.scene.popMatrix();
        
        // Sphere 2
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.75);
        this.scene.scale(0.246, 0.246, 0.246);
        this.sphere.display();
        this.scene.popMatrix();
    }

    displayDeck(){
        this.scene.pushMatrix();
        this.scene.translate(0, -0.75, 0);
        this.testAppearance.apply();
        this.displayGondola();
        this.displayPropellers();

        this.scene.popMatrix();
    }

    display(){
        this.scene.pushMatrix();

        // Movement
        this.scene.translate(...this.position);
        this.scene.rotate(this.curAngle, 0, 1, 0);

        // Blimp
        this.displayHull();
        this.displayDeck();

        this.scene.popMatrix();
    }
    
}
