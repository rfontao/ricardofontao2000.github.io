attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D uSampler2;

void main() {

	vTextureCoord = aTextureCoord;

    vec3 height_offset = aVertexNormal * 8.0 * (texture2D(uSampler2, vTextureCoord).b);

    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + height_offset, 1.0);

}

