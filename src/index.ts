import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { VideoStreamHandler } from './utils/VideoStreamHandler';

class App {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private controls: OrbitControls;
    private videoHandler: VideoStreamHandler;
    private videoMesh: THREE.Mesh | null = null;

    constructor() {
        // Initialize Scene
        this.scene = new THREE.Scene();
        
        // Initialize Camera
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.camera.position.z = 15;
        
        // Initialize Renderer
this.renderer = new THREE.WebGLRenderer({ antialias: true });
this.renderer.setSize(window.innerWidth, window.innerHeight);
this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
this.renderer.shadowMap.enabled = true;
this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(this.renderer.domElement);
        
        // Initialize Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        
        // Initialize Video Handler
        // Replace with your streaming URL
        const streamUrl = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
        this.videoHandler = new VideoStreamHandler(streamUrl);
        
        // Setup scene
        this.setupScene();
        
        // Add event listeners
        window.addEventListener('resize', () => this.onResize());
        
        // Start animation loop
        this.animate();
    }

    private cube: THREE.Mesh | null = null;

    private setupScene(): void {
        // Add lighting
        // Ambient light for overall scene illumination
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
       // Directional light to cast shadows
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0); // Increase intensity
directionalLight.position.set(5, 10, 7); // Reposition for better shadow angle
directionalLight.castShadow = true;

// Configure shadow parameters more precisely
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
directionalLight.shadow.camera.left = -15;
directionalLight.shadow.camera.right = 15;
directionalLight.shadow.camera.top = 15;
directionalLight.shadow.camera.bottom = -15;
directionalLight.shadow.bias = -0.001; // Reduce shadow acne

this.scene.add(directionalLight);

// Optional: Visualize the light's shadow camera (helpful for debugging)
// const helper = new THREE.CameraHelper(directionalLight.shadow.camera);
// this.scene.add(helper);
        
        // Add a point light for additional highlights
        const pointLight = new THREE.PointLight(0xffffff, 0.5);
        pointLight.position.set(-5, 5, -5);
        this.scene.add(pointLight);
        
        // Create floor
        const floorGeometry = new THREE.PlaneGeometry(20, 20);
        const floorMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x222222,
            roughness: 0.8,
            metalness: 0.2
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2; // Rotate to make it horizontal
        floor.position.y = -5; // Position it below other objects
        floor.receiveShadow = true;
        this.scene.add(floor);
        
        // Create cube
        const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
        const cubeMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x00ff00,
            roughness: 0.5,
            metalness: 0.1
        });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(-5, -3, 6); // Position to left of video
        cube.castShadow = true;
        cube.receiveShadow = true;
        this.scene.add(cube);
        
        // Store cube reference for animation
        this.cube = cube;
        
        // Create video plane once texture is ready
        this.videoHandler.onTextureReady((texture) => {
            // Create geometry for video display
            const geometry = new THREE.PlaneGeometry(16, 9); // 16:9 aspect ratio
            const material = new THREE.MeshStandardMaterial({ 
                map: texture,
                side: THREE.DoubleSide,
                toneMapped: false,
            });
            
            this.videoMesh = new THREE.Mesh(geometry, material);
            this.videoMesh.position.y = 0; // Center vertically
            this.videoMesh.castShadow = true;
            this.scene.add(this.videoMesh);
        });


// Add fog to create depth 
this.scene.fog = new THREE.FogExp2(0x666666, 0.002);
// Add grid helper
const gridHelper = new THREE.GridHelper(20, 20, 0x555555, 0x333333);
gridHelper.position.y = -4.99; // Just above the floor
this.scene.add(gridHelper);        

        // Create skybox
const skyboxGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
const skyboxMaterials = [
    new THREE.MeshBasicMaterial({ color: 0x8888ff, side: THREE.BackSide }),
    new THREE.MeshBasicMaterial({ color: 0x8888ff, side: THREE.BackSide }),
    new THREE.MeshBasicMaterial({ color: 0xaaccff, side: THREE.BackSide }), // Top - lighter
    new THREE.MeshBasicMaterial({ color: 0x666666, side: THREE.BackSide }), // Bottom - darker
    new THREE.MeshBasicMaterial({ color: 0x8888ff, side: THREE.BackSide }),
    new THREE.MeshBasicMaterial({ color: 0x8888ff, side: THREE.BackSide })
];
const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterials);
this.scene.add(skybox);
    }

    private onResize(): void {
        // Update camera
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        
        // Update renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    private animate(): void {
        requestAnimationFrame(() => this.animate());
        
        // Update controls
        this.controls.update();
        
        // Animate cube if it exists
        if (this.cube) {
            this.cube.rotation.x += 0.01;
            this.cube.rotation.y += 0.01;
        }
        
        // Update video texture
        this.videoHandler.update();
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
}

// Start application when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    new App();
});