import UI_Manager from "./UI_Manager";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class CloseButton extends cc.Component {

    //@property(cc.Node)
    SettingUI:cc.Node = null;

    //@property(cc.Node)
    LeaderBoardUI:cc.Node = null;

    //@property(cc.Node)
    GamePlayUI:cc.Node = null;

    //@property(cc.Node)
    Home:cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}


    start() {
        this.Home = this.node.parent.parent.getComponent(UI_Manager).Home;
    }

    CloseSetting() {
        this.SettingUI = this.node.parent.parent.getComponent(UI_Manager).Setting;
        this.SettingUI.active = false;
        this.Home.active = true;
        this.Home.emit("PopUp", true);
    }

    CloseLeaderBoard() {
        this.LeaderBoardUI = this.node.parent.parent.getComponent(UI_Manager).LeaderBoard;
        this.LeaderBoardUI.active = false;
        this.Home.active = true;
        this.Home.emit("PopUp", true);
    }

    // update (dt) {}
}
