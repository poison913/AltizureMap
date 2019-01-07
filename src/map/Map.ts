import { Layer } from "../layer/Layer";
export class Map {
    public sandbox!: altizure.Sandbox;

    /**
     * 图层列表
     */
    layers!: Layer[];
    divID!: string;

    constructor(id: string, options: altizure.SanboxOptions) {
        this.sandbox = new altizure.Sandbox(id, options);
        this.layers = new Array<Layer>();
        this.divID = id;
        console.log("map created.");
    }

    /**
     * 删除图层
     * @param layer 待删除的图层
     * @returns 返回图层所在序列
     */
    public removeLayer(layer: Layer): number {
        const layerIndex = this.layers.indexOf(layer);
        if (layerIndex > -1) {
            this.layers.splice(layerIndex, 1);
        }
        return layerIndex;
    }

    public addLayer(layer: Layer): any {
        this.layers.push(layer);
    }

    public flyTo(p: altizure.Pose, duration: number): Promise<object> {
        return this.sandbox.camera.flyTo(p);
    }

    public getView(): altizure.LngLatAlt[] {
        const mapDom = document.getElementById(this.divID) as HTMLElement;
        const bottomLeft = this.sandbox.window.toLngLatAlt({ x: 0, y: mapDom.clientHeight });
        const topRight = this.sandbox.window.toLngLatAlt({ x: mapDom.clientWidth, y: 0 });
        return [bottomLeft, topRight];
    }
}

