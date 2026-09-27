# Skill: 3D Asset Generation Pipeline

When a user requests a 3D object (e.g., "a modern villa"):

1. **Generate 2D References**: Use your image generation capabilities (e.g., via the Open Generative AI API or another image model) to create 3-5 consistent, high-quality images of the object from different angles. Save them as `reference_01.png`, `reference_02.png`, etc.
2. **Convert to 3D**: Use an image-to-3D MCP server (e.g., a Hunyuan3D or Tripo AI server) to convert the 2D references into a single, optimized .glb 3D model. Save it as `asset.glb`.
3. **Optimize the Model**: Run `npx @gltf-transform/cli optimize asset.glb asset-optimized.glb` to compress the model for web use.
4. **Generate the Scene Code**: Use the `web3d-mcp-server` to generate the React Three Fiber code that loads and displays `asset-optimized.glb` in a scene. The prompt to the server should be detailed, e.g., "Create a React Three Fiber scene that loads asset-optimized.glb, places it on a reflective floor, adds a subtle rotating animation, and uses a studio HDRI environment for realistic lighting."
5. **Integrate the Code**: Write the generated R3F code into your project and run the build.
