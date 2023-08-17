import UI_Manager from "./UI_Manager";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class CloseSetiingButton extends cc.Component {

    @property(cc.Node)
    SettingUI = null;

    @property(cc.Node)
    GamePlayUI = null;

    @property(cc.Node)
    Home = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}


    start() {
        this.Home = this.node.parent.parent.getComponent(UI_Manager).Home;
    }

    OnClick() {
        this.SettingUI = this.node.parent.parent.getComponent(UI_Manager).Setting;
        this.SettingUI.active = false;
        this.Home.active = true;
    }

    // update (dt) {}
}
