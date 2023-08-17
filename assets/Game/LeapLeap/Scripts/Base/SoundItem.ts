// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const {ccclass, property} = cc._decorator;
export enum SoundType{
	Background,
	Effect_Single,
	Effect_Multiple,
    Effect_Loop_AutoStop //loop sfx va tu dong tat sau n giay
}


@ccclass
export default class SoundItem extends cc.Component {
    @property(cc.AudioSource)
    audioSource: cc.AudioSource = null;

    @property({ type: cc.Enum(SoundType) })
    soundType: SoundType = SoundType.Background;

    @property()
    autoStopDelay: number = -1;

    audioId: number = -1;

    play(from: number = 0, autoStopDelay: number = -1){
        this.autoStopDelay = autoStopDelay;
        switch(this.soundType){
            case SoundType.Background:
                if(this.isValidAudioId() && cc.audioEngine.getState(this.audioId) == cc.audioEngine.AudioState.PLAYING) return;
                this.audioId = cc.audioEngine.playMusic(this.audioSource.clip, true);
                break;

            case SoundType.Effect_Single:
                if(this.isValidAudioId() && cc.audioEngine.getState(this.audioId) == cc.audioEngine.AudioState.PLAYING) return;
                this.audioId = cc.audioEngine.playEffect(this.audioSource.clip, false);
                let durationES = cc.audioEngine.getDuration(this.audioId);
                cc.audioEngine.setCurrentTime(this.audioId, Math.min(from, durationES));
                break;

            case SoundType.Effect_Loop_AutoStop:
                if(this.isValidAudioId() && cc.audioEngine.getState(this.audioId) == cc.audioEngine.AudioState.PLAYING) return;
                this.audioId = cc.audioEngine.playEffect(this.audioSource.clip, true);
                let durationLAE = cc.audioEngine.getDuration(this.audioId);
                cc.audioEngine.setCurrentTime(this.audioId, Math.min(from, durationLAE));

                let self = this;
                if(self.autoStopDelay > 0){
                    cc.tween(self.node)
                        .delay(self.autoStopDelay)
                        .call(()=>{
                            self.stop();
                        }).start();
                }
                break;

            case SoundType.Effect_Multiple:
                break;
        }
        // //cc.error(this.audioId);
    }

    stop(){
        if(this.isValidAudioId()){
            cc.audioEngine.stop(this.audioId);
            cc.Tween.stopAllByTarget(this.node);
        }
    }

    isValidAudioId(){
        return this.audioId >= 0;
    }

    onDestroy(){
        cc.Tween.stopAllByTarget(this.node);
    }
}


