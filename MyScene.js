/**
* MyScene
* @constructor
*/
class MyScene extends CGFscene {
    constructor() {
        super();
    }
    init(application) {
        super.init(application);
        this.initCameras();
        this.initLights();

        // Deltatime
        this.lastT = 0;
        this.deltaTime = 50; // Update period

        //Background color
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.setUpdatePeriod(50);
        
        this.enableTextures(true);

        //Initialize scene objects
        this.axis = new CGFaxis(this);
        this.sphere = new MySphere(this, 16, 8);
        this.cilinder = new MyCilinder(this, 16);
        this.cubemap = new MyUnitCube(this, 50);
        this.vehicle = new MyVehicle(this);
        this.plane = new MyPlane(this, 50, 16);
        this.billboard = new MyBillboard(this, [-8, 0, -8], Math.PI / 4);

        this.totalSupplies = 5;
        this.nSuppliesDelivered = 0;
        this.supplies = []
        for (let i = 0; i < this.totalSupplies; i++) {
            this.supplies.push(new MySupply(this));
        }

        // Shaders
        this.terrainMapIndex = 2;
        this.terrainShader = new CGFshader(this.gl, "shaders/terrain.vert", "shaders/terrain.frag");
        this.terrainShader.setUniformsValues({ uSampler2: this.terrainMapIndex });

        // Initialize textures (and appearances)
        this.earthAppearance = new CGFappearance(this).loadTexture("images/earth.jpg");

        this.terrainAppearance = new CGFappearance(this);
        this.terrainAppearance.loadTexture("images/terrain.jpg");
        this.terrainHeightMap = new CGFtexture(this, "images/terrain_heightmap.jpg");

        this.cubemapFilenames = [
            "images/skybox/cubemap.png",
            "images/skybox/sunset_cubemap.png",
            "images/skybox/bridge_cubemap.png",
            "images/skybox/underground_site_cubemap.png"
        ];
        this.cubemapTexture;
        
        // Interface
        this.cubemapTextures = {
            "Skybox": 0,
            "Sunset": 1,
            "Bridge": 2,
            "Underground": 3
        }
        this.selectedCubemapTex = 0;

        this.cubemapAppearance = new CGFappearance(this);
        this.onSelectedCubemapTexture(0);

        this.DEFAULT_ENGINE = 0;
        this.IMPROVED_ENGINE = 1;
        this.engineVersion = 0;
        this.engineVersions = {
            "Default engine": 0,
            "Improved engine": 1
        }

        this.speedFactor = 1;
        this.turnRadius = 1;
        this.scaleFactor = 1;

        //Objects connected to MyInterface
        this.displayAxis = true;
    }

    onSelectedCubemapTexture(v) {
        this.cubemapTexture = new CGFtexture(this, this.cubemapFilenames[v]);
        this.cubemapAppearance.setTexture(this.cubemapTexture);
    }

    onSelectedEngineVersion(v) {
        this.vehicle.onEngineChange(v);
    }

    initLights() {
        this.lights[0].setPosition(15, 2, 5, 1);
        this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.lights[0].enable();
        this.lights[0].update();
    }

    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 25, 15), vec3.fromValues(0, 10, 0));
    }

    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }

    // called periodically (as per setUpdatePeriod() in init())
    update(t){

        // Deltatime is normalized to seconds
        if (this.lastT == 0)
            this.deltaTime = 50 / 1000; // Default time between calls
        else
            this.deltaTime = (t - this.lastT) / 1000;
        this.lastT = t;

        this.checkKeys();
        this.gui.updateKeyDowns();
        this.vehicle.update(this.deltaTime);
        this.supplies.forEach(supply => {
            supply.update(this.deltaTime);
        });
    }

    getSupplyPercentage() {
        return this.nSuppliesDelivered / this.totalSupplies;
    }

    dropSupply() {
        for (let i = 0; i < this.supplies.length; i++) {
            if (this.supplies[i].isAvailable()) {
                this.supplies[i].drop(this.vehicle.getPosition().slice(), this.vehicle.getAngle());
                this.nSuppliesDelivered++;
                break;
            }
        }
    }

    checkKeys() {

        // Check for key codes e.g. in https://keycode.info/
        if (this.gui.getKey("KeyW")) {
            this.vehicle.accelerate(0.3);
        }

        if (this.gui.getKey("KeyS")) {
            this.vehicle.accelerate(-0.2);
        }

        if (this.gui.getKey("KeyA")) {
            this.vehicle.turn(this.turnRadius);
        }

        if (this.gui.getKey("KeyD")) {
            this.vehicle.turn(-this.turnRadius);
        }

        if (this.gui.getKeyDown("KeyP")) {
            this.vehicle.toggleAutoPilot();
        }

        if (this.gui.getKeyDown("KeyL")) {
            this.dropSupply();
        }

        if (this.gui.getKey("KeyR")) {
            this.vehicle.reset();
            this.supplies.forEach(supply => {
                supply.reset();
            });
            this.nSuppliesDelivered = 0;
        }

    }

    display() {
        // ---- BEGIN Background, camera and axis setup
        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();
        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();
        
        // Draw axis
        if (this.displayAxis)
            this.axis.display();

        this.setDefaultAppearance();
        this.activeTexture = null;

        // ---- BEGIN Primitive drawing section

        this.pushMatrix();
        this.scale(this.scaleFactor,this.scaleFactor,this.scaleFactor);

        this.pushMatrix();
        this.setActiveShader(this.terrainShader);
        this.terrainAppearance.apply();
        this.terrainHeightMap.bind(this.terrainMapIndex);
        this.rotate(Math.PI / 2, -1, 0, 0);
        this.plane.display();
        this.popMatrix();
        this.setActiveShader(this.defaultShader);

        this.vehicle.display();

        this.billboard.display();

        this.supplies.forEach(supply => {
            supply.display();
        });

        // Cubemap
        this.cubemapAppearance.apply();
        this.cubemap.display();

        this.popMatrix();

        // ---- END Primitive drawing section
    }
}