// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import BaseDataManager from "../UserDataManager/DataManager";
import AudioController from "./AudioController";
import AudioManager from "./AudioManager";
const {ccclass, property} = cc._decorator;

@ccclass
export default class AudioButton extends cc.Component {

    Audio:cc.AudioSource = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.Audio = this.node.getComponent(cc.AudioSource);
        // if(this.Audio == null){
        //     this.Audio = this.node.parent.parent.getComponents(cc.AudioSource)[1];
        // }
    }

    PlayAudio(){
        if(BaseDataManager.internalGetNum(AudioManager.AUDIO_VOLUME) != 0) 
        this.Audio.play();
    }
    // update (dt) {}
}
