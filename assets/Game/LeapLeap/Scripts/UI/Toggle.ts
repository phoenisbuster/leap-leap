// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Toggle extends cc.Component {

    state = false;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
    }

    OnClick() {
        let anim = this.getComponent(cc.Animation);
        let animParent = this.node.parent.getComponent(cc.Animation);
        if (this.state == false) {
            anim.play("ToggleOn");
            animParent.play("ToggleColorOn");
            this.state = true;
        }
        else {
            anim.play("ToggleOff");
            animParent.play("ToggleColorOff");
            this.state = false;
        }
    }
    // update (dt) {}
}
