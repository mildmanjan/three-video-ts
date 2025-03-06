import * as THREE from 'three';
import Hls from 'hls.js';

type TextureReadyCallback = (texture: THREE.VideoTexture) => void;

export class VideoStreamHandler {
    private video: HTMLVideoElement;
    private texture: THREE.VideoTexture | null = null;
    private streamUrl: string;
    private textureReadyCallbacks: TextureReadyCallback[] = [];
    private hls: Hls | null = null;

    constructor(streamUrl: string) {
        this.streamUrl = streamUrl;
        this.video = document.createElement('video');
        this.video.crossOrigin = 'anonymous';
        this.video.muted = true;
        this.video.playsInline = true;
        this.video.style.display = 'none';
        document.body.appendChild(this.video); // Needs to be added to DOM for some browsers
        
        this.initVideoStream();
    }

    private initVideoStream(): void {
        // Check if HLS is supported natively
        if (this.video.canPlayType('application/vnd.apple.mpegurl')) {
            // Native HLS support (Safari)
            this.video.src = this.streamUrl;
            this.setupVideoEvents();
        } else if (Hls.isSupported()) {
            // Use HLS.js
            this.hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
            });
            
            this.hls.loadSource(this.streamUrl);
            this.hls.attachMedia(this.video);
            
            this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
                this.video.play()
                    .catch(error => console.error('Error playing video:', error));
            });
            
            this.hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    switch(data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            console.log('Network error, trying to recover...');
                            this.hls?.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            console.log('Media error, trying to recover...');
                            this.hls?.recoverMediaError();
                            break;
                        default:
                            console.error('Fatal error, cannot recover:', data);
                            this.destroyHls();
                            break;
                    }
                }
            });
            
            this.setupVideoEvents();
        } else {
            console.error('Neither native HLS nor Hls.js is supported in this browser');
        }
    }

    private setupVideoEvents(): void {
        this.video.addEventListener('playing', () => {
            if (!this.texture) {
                console.log('Video started playing, creating texture');
                this.texture = new THREE.VideoTexture(this.video);
                this.texture.minFilter = THREE.LinearFilter;
                this.texture.magFilter = THREE.LinearFilter;
                this.texture.format = THREE.RGBAFormat;
                
                // Notify all callbacks that texture is ready
                this.textureReadyCallbacks.forEach(callback => callback(this.texture!));
            }
        });
        
        this.video.addEventListener('error', (e) => {
            console.error('Video error:', e);
        });
    }

    public onTextureReady(callback: TextureReadyCallback): void {
        if (this.texture) {
            // If texture already exists, call callback immediately
            callback(this.texture);
        } else {
            // Otherwise, add to callback queue
            this.textureReadyCallbacks.push(callback);
        }
    }

    public update(): void {
        // Update video texture if it exists
        if (this.texture) {
            this.texture.needsUpdate = true;
        }
    }

    public destroy(): void {
        this.destroyHls();
        this.video.pause();
        this.video.removeAttribute('src');
        this.video.load();
        this.video.remove();
        this.texture?.dispose();
    }

    private destroyHls(): void {
        if (this.hls) {
            this.hls.destroy();
            this.hls = null;
        }
    }
}