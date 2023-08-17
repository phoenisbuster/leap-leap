// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import SoundManager from "./SoundManager";
import { SoundName } from "./SoundName";


const {ccclass, property} = cc._decorator;


@ccclass
export default class ButtonSound extends cc.Component {
    @property({type: cc.Enum(SoundName)})
    sound: SoundName = SoundName.SfxClick;

    onLoad () {
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node; 
        clickEventHandler.component = "ButtonSound";
        clickEventHandler.handler = "callback";

        var button = this.node.getComponent(cc.Button);
        
        button.clickEvents.push(clickEventHandler);
    }

    callback () {
        // SoundManager.getInstance().play(this.sound.toString());
        SoundManager.getInstance().play("SfxClick");
    }

    // update (dt) {}
}
