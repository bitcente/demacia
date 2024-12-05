import gsap from "gsap";
import { ACESFilmicToneMapping, NeutralToneMapping, Scene, SRGBColorSpace, Texture, WebGLRenderer } from "three";
import { EffectComposer, GammaCorrectionShader, OutputPass, ShaderPass } from "three/examples/jsm/Addons.js";
import { RenderTransitionPass } from "three/examples/jsm/postprocessing/RenderTransitionPass.js";
import { textureLoader } from "../loaders/textureLoader";
import { height, width } from "../variables/size";
import { Camera, setCurrentCamera } from "./camera";

export class Renderer {
    private _renderer: WebGLRenderer;
    private _composer: EffectComposer;
    private _renderTransitionPass: RenderTransitionPass | undefined;
    private _transitionTexture: Texture;
    private _transition = 0;

    private _currentScene: Scene;
    private _targetScene: Scene | undefined;
    private _currentCamera: Camera;
    private _targetCamera: Camera | undefined;

    constructor({ scene, camera }: { scene: Scene; camera: Camera }) {
        this._renderer = new WebGLRenderer({ antialias: true });
        this._renderer.setPixelRatio( window.devicePixelRatio );
        this.updateSize();
        document.querySelector('body')?.appendChild(this._renderer.domElement);

        this._currentScene = scene;
        this._currentCamera = camera;

        // Load texture for transitions
        this._transitionTexture = textureLoader.load('/shaders/transition.png');

        // Postprocessing
        this._composer = new EffectComposer( this._renderer );
    }

    render() {
        // Prevent render both scenes when it's not necessary
        if ( this._transition === 0 ) {
            if (this._currentScene && this._currentCamera)
                this._renderer.render( this._currentScene, this._currentCamera );
        } else {
            // When 0 < transition < 1 render transition between two scenes
            this._composer.render();
        }
    }

    updateSize() {
        this._renderer.setSize( width, height );
    }

    transitionToScene({
        targetScene,
        targetCamera,
        onComplete,
    }: {
        targetScene: Scene;
        targetCamera: Camera;
        onComplete?: () => void;
    }) {
        this._targetScene = targetScene;
        this._targetCamera = targetCamera;
        this._renderTransitionPass = new RenderTransitionPass( this._targetScene, this._targetCamera, this._currentScene, this._currentCamera );
        this._renderTransitionPass.setTexture( this._transitionTexture );
        this._composer.insertPass( this._renderTransitionPass, 0 );


        gsap.to(this._currentScene.scale, {
            x: 1.5,
            y: 1.5,
            duration: 2,
            ease: "power2.inOut",
        });
        gsap.from(this._targetScene.scale, {
            x: .9,
            y: .9,
            duration: 2,
            ease: "power2.inOut",
        });

        gsap.to(this, {
            _transition: 1,
            duration: 2,
            ease: "power2.inOut",
            onUpdate: () => {
                if (!this._renderTransitionPass) return;
                this._renderTransitionPass.setTransition( this._transition );
            },
            onComplete: () => {
                this._transition = 0;
                if (this._targetScene && this._targetCamera) {
                    this._currentScene = this._targetScene;
                    this._currentCamera = this._targetCamera;
                    setCurrentCamera(this._currentCamera);

                    // Clean composer from transition pass
                    if (this._renderTransitionPass)
                        this._composer.removePass(this._renderTransitionPass);
                }
                onComplete?.();
            }
        });
    }

    get renderer() {
        return this._renderer;
    }
}
