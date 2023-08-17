import UI_Manager from "./UI_Manager";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class SettingButton extends cc.Component {

    @property(cc.Prefab)
    SettingPrefab = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    OnClick() 
    {
        if (this.node.parent.parent.getComponent(UI_Manager).Setting == null) {
            let PopupSetting = cc.instantiate(this.SettingPrefab);
            PopupSetting.parent = this.node.parent.parent;
            PopupSetting.parent.getComponent(UI_Manager).Home = this.node.parent;
            PopupSetting.parent.getComponent(UI_Manager).Setting = PopupSetting;
        }
        else {
            this.node.parent.parent.getComponent(UI_Manager).Setting.active = true;
        }
        this.node.parent.emit("PopUp", false);
        this.node.parent.active = false;
    }
    // update (dt) {}
}
