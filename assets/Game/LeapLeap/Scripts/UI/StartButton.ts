import UI_Manager from "./UI_Manager";
const { ccclass, property } = cc._decorator;

@ccclass
export default class StartButton extends cc.Component {


    @property(cc.Node)
    GamePlayPrefab: cc.Node = null;
    //@property(cc.Node)
    //PlayButton = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
    }

    OnClick() {
        let GamePlayUI = this.GamePlayPrefab;
        //GamePlayUI.parent = this.node.parent;
        GamePlayUI.parent.getComponent(UI_Manager).Home = this.node;
        GamePlayUI.parent.getComponent(UI_Manager).GamePlay = GamePlayUI;
        //this.node.active = false;
        GamePlayUI.scale = 1;
        cc.tween(GamePlayUI).to(0.25, 
        {
            opacity: 255
        }).start();
    }

    // update (dt) {}
}
