import { Map } from "../map/Map";
/**
 * 抽象类：图层类
 */
export abstract class Layer {
    options: any;

    map!: Map;
    zoomAnimated: any;

    /***
     * 图层标识符
     */
    public guid?: string;

    /**
     * 图层名称
     */
    public title: string | undefined;

    visible: boolean = false;

    constructor() { }

    // 方法
    /**
     * 加载到地图
     * @param map 地图容器
     */
    addTo(map: Map): Promise<Layer> {
        map.addLayer(this);
        this.map = map;
        return Promise.resolve(this);
    }


    /**
     * 获取地图容器
     */
    getMap(): Map | undefined {
        return this.map;
    }

    /**
     * 移除图层
     */
    abstract remove(): number;

    /**
     * 移除图层
     * @param map 所在地图容器
     */
    removeFrom(map: Map): Layer {
        if (map) {
            map.removeLayer(this);
        }
        return this;
    }

    /**
     * 渲染绘制（异步）
     */
    abstract refresh(): void;
}