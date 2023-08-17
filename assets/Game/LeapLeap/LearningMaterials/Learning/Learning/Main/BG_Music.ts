//import { _decorator, Component, Node, AudioSource, AudioClip } from 'cc';
const { ccclass, property } = cc._decorator;

@ccclass
export class BG_Music extends cc.Component 
{
    @property({type: cc.AudioClip})
    MusicList: cc.AudioClip[] = []

    ChangeMusic()
    {
        let index = Math.floor(Math.random() * ((this.MusicList.length-1) - 0 + 1) + 0);
        this.PlayMusic(index);
    }

    PlayMusic(index: number)
    {
        this.node.getComponent(cc.AudioSource).stop();
        this.node.getComponent(cc.AudioSource).clip = this.MusicList[index];
        this.node.getComponent(cc.AudioSource).play();
    }

    start() 
    {

    }

    update(deltaTime: number) 
    {
        if(!this.node.getComponent(cc.AudioSource).isPlaying)
        {
            this.ChangeMusic();
        }
    }
}

