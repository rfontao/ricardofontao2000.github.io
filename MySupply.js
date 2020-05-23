const SupplyStates =  {      INACTIVE: 0,      FALLING: 1,      LANDED: 2  };
const inactivePos = [0, 0, 0]
const finalHeight = 0.5;
const fallTime = 3;
const dropHeightOffset = -1;

/**
 * MySupply
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MySupply extends MyUnitCubeQuad {

    static globalOffset = 0.00; //Used to prevent box clipping

	constructor(scene) {
        super(scene);
        this.deltaTime = 50;
        this.loadTextures();
        this.reset();
        this.initBuffers();
    }

    reset() {
        this.fallSpeed = 0;
        this.angle = 0;
        this.state = SupplyStates.INACTIVE;
        this.position = inactivePos;
        this.offset = 0.00;
        super.setTextures(...this.droppingTexture);
    }
 
    drop(position, orientation) {
        this.angle = orientation;
        position[1] += dropHeightOffset;
        this.state = SupplyStates.FALLING;
        this.fallSpeed = (position[1] - finalHeight) / fallTime;
        this.position = position;
        MySupply.globalOffset += 0.01;
        this.offset = MySupply.globalOffset;
    }

    isAvailable() {
        return this.state == SupplyStates.INACTIVE;
    }

    display() {
        if(this.state == SupplyStates.LANDED){
            this.scene.pushMatrix();
            this.scene.translate(...this.position);
            this.scene.rotate(this.angle, 0, 1, 0);
            this.scene.translate(0,this.offset,0);
            super.displaySpread();
            this.scene.popMatrix();
        } else if (this.state != SupplyStates.INACTIVE) {
            this.scene.pushMatrix();
            this.scene.translate(...this.position);
            this.scene.rotate(this.angle, 0, 1, 0);
            super.display();
            this.scene.popMatrix();
        }
    }
    
    update(t) {
        this.deltaTime = t;

        if (this.state == SupplyStates.FALLING) {
            this.position[1] = Math.max(finalHeight, this.position[1] - this.fallSpeed * this.deltaTime);
            if (this.position[1] == finalHeight) {
                this.state = SupplyStates.LANDED;
                super.setTextures(...this.landedTexture);
                this.scene.nSuppliesDelivered++;
            }
        }
    }

    loadTextures(){
        var sideMaterial = new CGFappearance(this.scene);
        sideMaterial.loadTexture('images/ApertureCubeSide.png');

        this.droppingTexture = [sideMaterial,sideMaterial,sideMaterial];

        var sideMaterial = new CGFappearance(this.scene);
        sideMaterial.loadTexture('images/CompanionCubeSide.png');

        this.landedTexture = [sideMaterial,sideMaterial,sideMaterial];
    }
}