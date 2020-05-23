/**
 * MyBillboard
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyBillboard extends CGFobject {

    constructor(scene, position, angle) {
        super(scene);
        this.position = position;
        this.angle = angle;
        this.plane = new MyPlane(scene, 1, 8);

        this.backAppearance = new CGFappearance(scene);
        this.backAppearance.setAmbient(0, 0, 0, 1);
        this.backAppearance.setDiffuse(0, 0, 0, 1);
        this.backAppearance.setSpecular(0, 0, 0, 1);
        this.backAppearance.setShininess(10.0);

        this.legsAppearance = new CGFappearance(scene);
        this.legsAppearance.setAmbient(0.15, 0.15, 0.15, 1);
        this.legsAppearance.setDiffuse(0.15, 0.15, 0.15, 1);
        this.legsAppearance.setSpecular(0.15, 0.15, 0.15, 1);
        this.legsAppearance.setShininess(10.0);

        this.progressShader = new CGFshader(this.scene.gl, "shaders/progress.vert", "shaders/progress.frag");
        this.progressShader.setUniformsValues({ percentage: 0 });

        this.frontAppearance = new CGFappearance(scene);
        this.frontAppearance.loadTexture("images/supplies_delivered.png");

		this.initBuffers();
    }

    displayTop() {
        this.scene.pushMatrix();

        this.scene.translate(0, 1.5, 0);

        this.scene.pushMatrix();
        this.frontAppearance.apply();  // Set ANY texture
        this.scene.setActiveShader(this.progressShader);
        this.progressShader.setUniformsValues({ percentage: this.scene.getSupplyPercentage() });
        this.scene.translate(0, -0.2, 0.01);
        this.scene.scale(1.8, 0.4, 1);
        this.plane.display();
        this.scene.popMatrix();
        this.scene.setActiveShader(this.scene.defaultShader);

        this.scene.activeTexture = null;

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.scale(2, 1, 1);
        this.backAppearance.apply();
        this.plane.display();
        this.scene.popMatrix();

        this.scene.scale(2, 1, 1);
        this.frontAppearance.apply();
        this.plane.display();

        this.scene.popMatrix();
    }

    displayLegs() {

        this.scene.pushMatrix();
        this.legsAppearance.apply();

        this.scene.translate(0, 0.5, 0);

        this.scene.pushMatrix();
        this.scene.translate(0.6, 0, 0);
        this.scene.scale(0.15, 1, 0.15);
        this.plane.display();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.plane.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-0.6, 0, 0);
        this.scene.scale(0.15, 1, 0.15);
        this.plane.display();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.plane.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(...this.position);
        this.scene.rotate(this.angle, 0, 1, 0);
        
        this.displayTop();
        this.displayLegs();

        this.scene.popMatrix();
    }

}