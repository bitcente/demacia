import { Group, Scene } from "three";
import { getLayersByScreenId } from "../layers/getLayersByScreenId";
import { Layer, screens } from "../layers";



export class Screen {
    private _id: string;
    private _scene: Scene;
    private _sceneGroup: Group;
    private _data: {
        id: string;
        title: string;
        description: string;
        layers: Layer[];
    } | undefined;
    _layers: any[] = [];

    constructor({ id }: { id: string }) {
        this._id = id;
        this._scene = new Scene();
        this._sceneGroup = new Group();
        this._data = screens.find((searchedScreen) => searchedScreen.id === id);
    }

    async init() {
        this._layers = await getLayersByScreenId({ id: this._id });
        this._layers.forEach(layer => {
            this._scene.add(layer);
        })
    }

    render() {

    }

    get id() {
        return this._id;
    }
    get scene() {
        return this._scene;
    }
    get sceneGroup() {
        return this._sceneGroup;
    }
    get data() {
        return this._data;
    }
}