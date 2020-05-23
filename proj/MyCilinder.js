class MyCilinder extends CGFobject {
    /**
     * @method constructor
     * @param  {CGFscene} scene - MyScene object
     * @param  {integer} slices - number of slices around Y axis
     */
    constructor(scene, slices) {
      super(scene);
      this.slices = slices;
  
      this.initBuffers();
    }
  
    /**
     * @method initBuffers
     * Initializes the sphere buffers
     * TODO: DEFINE TEXTURE COORDINATES
     */
    initBuffers() {
      this.vertices = [];
      this.indices = [];
      this.normals = [];
      this.texCoords = [];
  
      var theta = 0;
      var thetaInc = (2 * Math.PI) / this.slices;
      var verts = this.slices;

      var tex_s = 1;
      var texInc = 1 / this.slices;

      for (let angle = 0; angle <= verts; angle++) {
        var vec = [Math.cos(theta), 0, Math.sin(theta)];

        // Normals
        this.normals.push(...vec, ...vec);
        
        // Vertices
        this.vertices.push(...vec);
        vec[1] = 1;
        this.vertices.push(...vec);

        // Tex coords
        this.texCoords.push(tex_s, 1);
        this.texCoords.push(tex_s, 0);

        // Indices
        if (angle != verts) {
          this.indices.push(2*angle, 2*angle + 1, 2*angle + 2);
          this.indices.push(2*angle + 3, 2*angle + 2, 2*angle + 1);
        }

        theta += thetaInc;
        tex_s -= texInc;
      }

      this.primitiveType = this.scene.gl.TRIANGLES;
      this.initGLBuffers();
    }
  }
  