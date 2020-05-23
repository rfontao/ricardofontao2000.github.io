/**
 * MyUnitCube   
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyUnitCube extends CGFobject {
	constructor(scene, size) {
		super(scene);
        this.size = size;
        this.initBuffers();
	}
    
    // TODO: Fazer rotate de 90º para dar fix ao "front"
    
	initBuffers() {

        this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.texCoords = [];

        // This is now a "variableSizeUnitCube" :D
        var dist = this.size * 0.5;

        for (let i = 0; i < 6; i++) {

            var normal = [0, 0, 0];
            var third = 1.0 / 3.0;
            
            switch (i) {
                case 0:
                    this.texCoords.push(0.75, third);
                    this.texCoords.push(1, third);
                    this.texCoords.push(1, 2*third);
                    this.texCoords.push(0.75, 2*third);
                    normal[0] = 1; break;
                case 1:
                    this.texCoords.push(0, third);
                    this.texCoords.push(0.25, third);
                    this.texCoords.push(0.25, 2*third);
                    this.texCoords.push(0, 2*third);
                    normal[2] = 1; break;
                case 2:
                    this.texCoords.push(0.25, third);
                    this.texCoords.push(0.5, third);
                    this.texCoords.push(0.5, 2*third);
                    this.texCoords.push(0.25, 2*third);
                    normal[0] = -1; break;
                case 3:
                    this.texCoords.push(0.5, third);
                    this.texCoords.push(0.75, third);
                    this.texCoords.push(0.75, 2*third);
                    this.texCoords.push(0.5, 2*third);
                    normal[2] = -1; break;
                case 4:
                    // Top
                    this.texCoords.push(0.5, 0);
                    this.texCoords.push(0.5, third);
                    this.texCoords.push(0.25, third);
                    this.texCoords.push(0.25, 0);
                    normal[1] = 1; break;
                case 5:
                    // Bottom
                    this.texCoords.push(0.25, 1);
                    this.texCoords.push(0.25, 2 * third);
                    this.texCoords.push(0.5, 2 * third);
                    this.texCoords.push(0.5, 1);
                    normal[1] = -1; break;
            }

            if (Math.abs(normal[2]) == 1) {
                var aux = dist*normal[2];
                this.vertices.push(aux, dist, aux);
                this.vertices.push(-aux, dist, aux);
                this.vertices.push(-aux, -dist, aux);
                this.vertices.push(aux, -dist, aux);
            }
            else if (Math.abs(normal[0]) == 1) {
                var aux = dist*normal[0];
                this.vertices.push(aux, dist, -aux);
                this.vertices.push(aux, dist, aux);
                this.vertices.push(aux, -dist, aux);
                this.vertices.push(aux, -dist, -aux);
            }
            else if (Math.abs(normal[1]) == 1) {
                var aux = dist*normal[1];
                this.vertices.push(dist, aux, -aux);
                this.vertices.push(-dist, aux, -aux);
                this.vertices.push(-dist, aux, aux);
                this.vertices.push(dist, aux, aux);
            }

            normal[0] *= -1;
            normal[1] *= -1;
            normal[2] *= -1;
            this.normals.push(...normal, ...normal, ...normal, ...normal);

            this.indices.push(i*4+2, i*4+1, i*4);
            this.indices.push(i*4+2, i*4, i*4+3);
        }

		//The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
    }
    
    display() {
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        super.display();
        this.scene.popMatrix();
    }

    updateBuffers() {

    }
}

