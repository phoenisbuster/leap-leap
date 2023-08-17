// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    state = true;

    start() {

    }

    Onclick() {
        if (this.state == true) {
            this.node.children[1].active = true;
        }
        else {
            this.node.children[1].active = false;
        }
        this.state = !this.state;
    }

    // update (dt) {}
}
