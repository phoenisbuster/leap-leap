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
export default class AudioState extends cc.Component {
    Audio:cc.AudioSource = null;
    Music:cc.AudioSource = null;
   
    protected onLoad(): void {
        this.Audio = this.node.getComponents(cc.AudioSource)[1];
        this.Audio.volume = BaseDataManager.internalGetNum(AudioManager.AUDIO_VOLUME,1);
        this.Music = this.node.getComponents(cc.AudioSource)[0];
        this.Music.volume = BaseDataManager.internalGetNum(AudioManager.MUSIC_VOLUME,1);

        BaseDataManager.internalSaveNum(AudioManager.AUDIO_VOLUME, this.Audio.volume);
        BaseDataManager.internalSaveNum(AudioManager.MUSIC_VOLUME, this.Music.volume);
    }

    start () {

    }

    // update (dt) {}
}
