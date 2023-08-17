import GameManager from "../GameManagerScript/GameManager ";
import UI_Manager from "./UI_Manager";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class ResumeButton extends cc.Component {

    @property(cc.Node)
    GamePlayUI = null;

    GameManager: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        this.GameManager = cc.find("GameManager");
    }

    start() {
        //this.GamePlayUI = cc.find("New Canvas/GamePlay");
        this.GamePlayUI = this.node.parent.parent.getComponent(UI_Manager).GamePlay;
    }

    OnClick() {
        cc.log(this.node.parent.parent);
        this.GamePlayUI.children[3].active = true;
        this.node.parent.active = false;
        this.GameManager.getComponent(GameManager).GamePause();
        //this.node.active = false;

    }
    // update (dt) {}
}
