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
export default class PauseButton extends cc.Component {

    @property(cc.Prefab)
    PauseUI = null;

    @property(cc.Node)
    GamePlay = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () 
    // {
    //   
    // }

    start () {

    }

    OnClick() {
        if (this.node.parent.parent.getComponent(UI_Manager).PauseUI == null) {
            let PauseUI = cc.instantiate(this.PauseUI);
            PauseUI.parent = this.node.parent.parent;
            this.node.parent.parent.getComponent(UI_Manager).PauseUI = PauseUI;
        }
        else {
            this.PauseUI = this.node.parent.parent.getComponent(UI_Manager).PauseUI;
            this.PauseUI.active = true;
        }
        this.GamePlay.active = false;
    }

    // update (dt) {}
}
