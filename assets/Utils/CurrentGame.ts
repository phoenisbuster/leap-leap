
const { ccclass, property } = cc._decorator

@ccclass
export default class CurrentScene extends cc.Component {

  @property({type: cc.SceneAsset, displayName: "Mini Game enter scene"})
  scenePlay : cc.SceneAsset = null;

  start() {
    let self = this;  
    this.scheduleOnce(()=>{
      cc.director.runScene(this.scenePlay);
    },2)
  }
}