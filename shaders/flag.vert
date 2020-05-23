attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D uSampler2;

uniform float timeFactor;

#define TIME_SCALE 1.4
#define AMPLITUDE 0.1
#define FREQUENCY 14.0
#define BUILDUP 0.25
#define TMP_NAME (1.0 / BUILDUP)

void main() {

    vTextureCoord = aTextureCoord;

    float trig_offset;
    if (aVertexNormal.z > 0.0)
        trig_offset = aTextureCoord.s;
    else
        trig_offset = 1.0 - aTextureCoord.s;

    vec3 offset;
    if (trig_offset < BUILDUP)
        offset = vec3(0.0, 0.0, pow(TMP_NAME * (trig_offset - BUILDUP) + 1.0, 2.0) * AMPLITUDE * sin(FREQUENCY * trig_offset + TIME_SCALE * timeFactor));
    else
        offset = vec3(0.0, 0.0, AMPLITUDE * sin(FREQUENCY * trig_offset + TIME_SCALE * timeFactor));
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + offset, 1.0);

}

