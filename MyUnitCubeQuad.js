/**
 * MyUnitCubeQuad
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyUnitCubeQuad extends CGFobject {
	constructor(scene) {
		super(scene);
        this.initBuffers();
        
        this.quad = new MyQuad(scene);
        this.topMaterial = new CGFappearance(scene);
        this.botMaterial = new CGFappearance(scene);
        this.sideMaterial = new CGFappearance(scene);

    }
    
    setTextures(topMaterial, sideMaterial, botMaterial) {
        this.topMaterial = topMaterial
        this.sideMaterial = sideMaterial
        this.botMaterial = botMaterial
    }
	
	display() {
        
        this.sideMaterial.apply();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.5);
        this.quad.display();    
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.translate(0, 0, 0.5);
        this.quad.display();    
        this.scene.popMatrix();    

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.translate(0, 0, 0.5);
        this.quad.display();    
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 2, 0, -1, 0);
        this.scene.translate(0, 0, 0.5);
        this.quad.display();    
        this.scene.popMatrix();

        this.botMaterial.apply();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.translate(0, 0, 0.5);
        this.quad.display();    
        this.scene.popMatrix();  
        
        this.topMaterial.apply();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 2, -1, 0, 0);
        this.scene.translate(0, 0, 0.5);
        this.quad.display();    
        this.scene.popMatrix();

    }

    displaySpread(){
        this.sideMaterial.apply();

        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2,1,0,0);
        this.scene.translate(0,1,-0.49);
        this.quad.display();    
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.rotate(-Math.PI/2,1,0,0);
        this.scene.translate(0,1,-0.49);
        this.quad.display();    
        this.scene.popMatrix();    

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.rotate(-Math.PI/2,1,0,0);
        this.scene.translate(0,1,-0.49);
        this.quad.display();    
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 2, 0, -1, 0);
        this.scene.rotate(-Math.PI/2,1,0,0);
        this.scene.translate(0,1,-0.49);
        this.quad.display();    
        this.scene.popMatrix();

        this.topMaterial.apply();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 2, -1, 0, 0);
        this.scene.translate(0, 0, -0.49);
        this.quad.display();    
        this.scene.popMatrix();
    }
    
}

