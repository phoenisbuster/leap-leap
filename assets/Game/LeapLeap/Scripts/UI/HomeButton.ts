import UI_Manager from "./UI_Manager";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class HomeButton extends cc.Component {

    // @property(cc.Node)
    // PauseUI = null;

    // @property(cc.Node)
    // GamePlayUI = null;

    // @property(cc.Node)
    // Home = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        //this.Home = this.node.parent.parent.getComponent(UI_Manager).Home;
    }

    OnClick() {
        // cc.log(this.Home);
        // this.PauseUI = this.node.parent.parent.getComponent(UI_Manager).PauseUI;
        // this.GamePlayUI = this.node.parent.parent.getComponent(UI_Manager).GamePlay;

        // this.PauseUI.destroy();
        // this.GamePlayUI.active = false;
        // this.node.parent.parent.getComponent(UI_Manager).PauseUI = null;
        // this.node.parent.parent.getComponent(UI_Manager).GamePlay = null;
        // this.Home.active = true;
        cc.tween(this.node).to(0.05,{
        }).call(()=>{
            cc.director.loadScene(cc.director.getScene().name);
        }).start();
    }

    // update (dt) {}
}
