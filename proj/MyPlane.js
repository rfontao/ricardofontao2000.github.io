
/** Represents a plane with nrDivs divisions along both axis, with center at (0,0) */
class MyPlane extends CGFobject{
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
				this.vertices.push(xCoord, yCoord, 0);
				this.normals.push(0, 0, 1);
				this.texCoords.push(i*this.texStep, j*this.texStep);
				xCoord += this.patchLength;
			}

			yCoord -= this.patchLength;
		}
		// Generating indices
		this.indices = [];

		var ind = 0;
		for (var j = 0; j < this.nrDivs; j++) {
			for (var i = 0; i <= this.nrDivs; i++) {
				this.indices.push(ind);
				this.indices.push(ind + this.nrDivs + 1);
				ind++;
			}

			if (j + 1 < this.nrDivs) {
				this.indices.push(ind + this.nrDivs);
				this.indices.push(ind);
			}
		}
		this.primitiveType = this.scene.gl.TRIANGLE_STRIP;
		this.initGLBuffers();
	}

	setFillMode() { 
		this.primitiveType=this.scene.gl.TRIANGLE_STRIP;
	}

	setLineMode() { 
		this.primitiveType=this.scene.gl.LINES;
	};

}


