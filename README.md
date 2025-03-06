# Three.js Video Streaming Application

This repository contains a TypeScript application that integrates Three.js with video streaming capabilities. The application creates an interactive 3D environment where an external video stream is displayed on a plane within the scene, along with other 3D elements like a floor, a rotating cube, and dynamic lighting.

## Features

- **Video Streaming Integration**: Supports HLS and other video streaming formats
- **Interactive 3D Environment**: Complete with floor, cube, and lighting
- **Responsive Design**: Adapts to different window sizes
- **Shadow Casting**: Realistic shadows from 3D objects
- **Camera Controls**: Orbit controls for navigating the 3D space

## Live Demo

You can view the live application at: https://mildmanjan.github.io/three-video-ts

## Screenshots

![Application Screenshot](screenshot.png)

## Technologies Used

- **Three.js**: WebGL-based 3D graphics library
- **TypeScript**: Strongly-typed JavaScript
- **HLS.js**: HTTP Live Streaming client
- **Webpack**: Module bundler
- **GitHub Pages**: Hosting platform

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mildmanjan/three-video-ts.git
   cd your-repo-name
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser at `http://localhost:9001`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Deploying to GitHub Pages

```bash
npm run deploy
```

## Customization

### Changing the Video Source

To use a different video stream, update the `streamUrl` variable in `src/index.ts`:

```typescript
// Initialize Video Handler
const streamUrl = "YOUR_STREAM_URL_HERE";
this.videoHandler = new VideoStreamHandler(streamUrl);
```

### Adjusting Scene Elements

You can modify scene elements like colors, positions, and sizes in the `setupScene` method of the `App` class:

```typescript
// Create cube
const cubeGeometry = new THREE.BoxGeometry(2, 2, 2); // Change size here
const cubeMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x00ff00, // Change color here
    roughness: 0.5,
    metalness: 0.1
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(-5, -3, 0); // Change position here
```

## Structure

- **`src/index.ts`**: Main application entry point
- **`src/utils/VideoStreamHandler.ts`**: Handles video streaming
- **`src/utils/QualitySelector.ts`**: Optional quality selection for streams
- **`src/utils/EffectsManager.ts`**: Optional visual effects

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Three.js community for their excellent documentation and examples
- HLS.js for video streaming capabilities