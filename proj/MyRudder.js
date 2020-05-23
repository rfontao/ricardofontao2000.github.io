/**
 * MyRudder
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyRudder extends CGFobject {
	constructor(scene) {
		super(scene);
		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [
            // Frontside
            0, 0, 0,	//0
		    0, 0, -1,	//1
            0, 0.5, -1,	//2
            0, 0.5, -0.5,  //3
            // Backside
            0, 0, 0,	//4
		    0, 0, -1,	//5
            0, 0.5, -1,	//6
            0, 0.5, -0.5   //7
		];

        this.normals = [];
        for (let i = 0; i < 4; i++)
            this.normals.push(1, 0, 0);
        for (let i = 0; i < 4; i++)
            this.normals.push(-1, 0, 0);

		//Counter-clockwise reference of vertices
		this.indices = [
            0, 1, 2,
            2, 3, 0,

            4, 7, 6,
            6, 5, 4
        ];
        
        this.texCoords = [
            0, 0,
            1, 0,
            1, 1,
            0.5, 1,
        
            0, 0,
            1, 0,
            1, 1,
            0.5, 1
        ];

		//The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}
}

