// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import UI_Manager from "./UI_Manager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LeaderBoardButton extends cc.Component {

    @property(cc.Prefab)
    LeaderBoardPrefab = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    OnClick() {
        if (this.node.parent.parent.getComponent(UI_Manager).LeaderBoard == null) {
            let PopupLeaderBoard = cc.instantiate(this.LeaderBoardPrefab);
            PopupLeaderBoard.parent = this.node.parent.parent;
            PopupLeaderBoard.parent.getComponent(UI_Manager).Home = this.node.parent;
            PopupLeaderBoard.parent.getComponent(UI_Manager).LeaderBoard = PopupLeaderBoard;
        }
        else {
            this.node.parent.parent.getComponent(UI_Manager).LeaderBoard.active = true;
        }
        this.node.parent.emit("PopUp", false);
        this.node.parent.active = false;
    }

    // update (dt) {}
}
