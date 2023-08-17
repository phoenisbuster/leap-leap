//import { _decorator, Component, Node, AudioClip, AudioSource, Slider } from 'cc';
import { BG_Music } from '../Main/BG_Music';
const { ccclass, property } = cc._decorator;

@ccclass
export class SettingPanel extends cc.Component {
    @property({type: cc.Node})
    BG_Music: cc.Node | null = null;
    @property({type: cc.Slider})
    SoundSetting: cc.Slider | null = null;

    index = 0;
    
    ChangeMusic()
    {
        this.BG_Music.getComponent(BG_Music).ChangeMusic();
    }

    VolumeSetting()
    {
        this.BG_Music.getComponent(cc.AudioSource).volume = this.SoundSetting.progress;
    }
    
    start() 
    {
        if(!this.BG_Music.getComponent(cc.AudioSource).isPlaying)
        {
            this.BG_Music.getComponent(BG_Music).PlayMusic(this.index);
            //this.BG_Music.play();
        }
        
    }

    update(deltaTime: number) 
    {
        
    }
}

