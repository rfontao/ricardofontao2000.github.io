/** Represents a plane with nrDivs divisions along both axis, with center at (0,0) */
class MyDoubleSidedPlane extends CGFobject{
	constructor(scene, size, nrDivs) {
		super(scene);
		// nrDivs = 1 if not provided
		nrDivs = typeof nrDivs !== 'undefined' ? nrDivs : 1;
		size = typeof size !== 'undefined' ? size : 1;
		this.nrDivs = nrDivs;
		this.size = size;
		this.patchLength = this.size / nrDivs;
		this.texStep = 1.0 / this.nrDivs;
		
		this.initBuffers();
	}

	initBuffers() {
		// Generate vertices, normals, and texCoords
		this.vertices = [];
		this.normals = [];
        this.texCoords = [];

		var yCoord = this.size / 2.0;
		for (var j = 0; j <= this.nrDivs; j++) {
			var xCoord = -this.size / 2.0;
			
			for (var i = 0; i <= this.nrDivs; i++) {
				this.vertices.push(xCoord, yCoord, 0.001);
				this.normals.push(0, 0, 1);
				this.texCoords.push(i*this.texStep, j*this.texStep);
				xCoord += this.patchLength;
			}

			yCoord -= this.patchLength;
        }
        
		// Generating indices
		this.indices = [];

		for (var j = 0; j < this.nrDivs; j++) {
			for (var i = 0; i < this.nrDivs; i++) {

                var tl = j*(this.nrDivs+1) + i
                var tr = j*(this.nrDivs+1) + i + 1
                var bl = (j+1)*(this.nrDivs+1) + i
                var br = (j+1)*(this.nrDivs+1) + i + 1

                this.indices.push(tr, tl, bl);
                this.indices.push(bl, br, tr);
            }
            
            console.log("nextLine\n");
        }
        

		yCoord = this.size / 2.0;
		for (var j = 0; j <= this.nrDivs; j++) {
			var xCoord = -this.size / 2.0;
			
			for (var i = 0; i <= this.nrDivs; i++) {
				this.vertices.push(xCoord, yCoord, -0.001);
				this.normals.push(0, 0, -1);
                this.texCoords.push((this.nrDivs-i)*this.texStep, j*this.texStep);
				xCoord += this.patchLength;
			}

			yCoord -= this.patchLength;
        }
        
		// Generating indices
		var baseInd = (this.nrDivs + 1) ** 2;
		for (var j = 0; j < this.nrDivs; j++) {
			for (var i = 0; i < this.nrDivs; i++) {

                var tl = baseInd + j*(this.nrDivs+1) + i
                var tr = baseInd + j*(this.nrDivs+1) + i + 1
                var bl = baseInd + (j+1)*(this.nrDivs+1) + i
                var br = baseInd + (j+1)*(this.nrDivs+1) + i + 1

                this.indices.push(bl, tl, tr);
                this.indices.push(tr, br, bl);
            }
            
            console.log("nextLine\n");
        }

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	setFillMode() { 
		this.primitiveType=this.scene.gl.TRIANGLES;
	}

	setLineMode() { 
		this.primitiveType=this.scene.gl.LINES;
	};

}


