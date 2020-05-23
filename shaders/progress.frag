#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;

uniform float percentage;

void main() {
	// Starting color = (1.0, 0.0, 0.0)
	// End color = (0.0, 1.0, 0.0)
	// Remaining color = (0.5, 0.5, 0.5)
	
	// toMin + (num - fromMin)/(fromMax - fromMin) * (toMax - toMin)

	if (vTextureCoord.x < percentage)
		gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0) + (vec4(0.0, 1.0, 0.0, 1.0) - vec4(1.0, 0.0, 0.0, 1.0)) * (vTextureCoord.x);
		// gl_FragColor = vec4(vTextureCoord.x, vTextureCoord.x, vTextureCoord.x, 1.0);
	else
		gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0);

}
