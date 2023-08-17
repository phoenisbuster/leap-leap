// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseDataManager from "../UserDataManager/DataManager";
import AudioManager from "./AudioManager";


const {ccclass, property} = cc._decorator;

@ccclass
export default class AudioController extends cc.Component {

    @property(cc.AudioSource)
    Audio:cc.AudioSource = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        //this.Audio = this.node.getComponent(cc.AudioSource);
        if(BaseDataManager.internalGetNum(AudioManager.AUDIO_VOLUME)!=0){
            this.node.children[1].active = false;
        }
        else{
            this.node.children[1].active = true;
        }
    }

    Onclick(){
        if(BaseDataManager.internalGetNum(AudioManager.AUDIO_VOLUME)!=0){
            this.Audio.volume = 0;
            this.node.children[1].active = true;
        }
        else{
            this.Audio.volume = 1;
            this.node.children[1].active = false;
        }
        BaseDataManager.internalSaveNum(AudioManager.AUDIO_VOLUME,this.Audio.volume);
    }

    PlayAudio(){
        this.Audio.play();
    }

    // update (dt) {}
}
