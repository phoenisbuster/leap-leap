import BaseDataManager from "../UserDataManager/DataManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class AudioManager extends cc.Component {

    @property([cc.AudioClip])
    MusicClip: cc.AudioClip[] = [];

    @property([cc.AudioClip])
    ButtonEff: cc.AudioClip[] = [];

    private static instance: AudioManager = null;

    private AUDIO_ENABLE = "AudioEnable";
    private MUSIC_ENABLE = "MusicEnable";
    public static AUDIO_VOLUME = "AudioVolume";
    public static MUSIC_VOLUME = "MusicVolume";

    private curMusicId = -1;
    private curBtnEffId = -1;

    private isEnabledAudio = true;
    private isEnabledMusic = true;
    private curAudioVol = 1;
    private curMusicVol = 1;

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        if(this.MusicClip.length <= 0 || this.ButtonEff.length <= 0)
        {
            cc.error("No sound");
        }
        else
        {
            AudioManager.instance = this;
            this.loadSettingDataFromStorage();
        }    
    }

    start () 
    {

    }

    OnPlayMusic(index: number = -1, volume: number = 1)
    {
        if(index < 0)
        {
            index = Math.floor(Math.random()* this.MusicClip.length);
        }

        this.curMusicId = cc.audioEngine.playMusic(this.MusicClip[index], false);

        cc.audioEngine.getState(this.curMusicId)
    }


    setAudioVol()
    {

    }
    /////////////// LOAD SETTING DATA FROM STORAGE /////////////////
    loadSettingDataFromStorage()
    {
        this.isEnabledAudio = this.getAudioStatus();
        this.isEnabledMusic = this.getMusicStatus();
        this.curAudioVol = this.getAudioVolume();
        this.curMusicVol = this.getMusicVolume();
    }

    getAudioStatus(): boolean
    {
        return BaseDataManager.internalGetBoolean(this.AUDIO_ENABLE, true);
    }

    setAudioStatus(isOn: boolean)
    {
        BaseDataManager.internalSaveBoolean(this.AUDIO_ENABLE, isOn);
    }

    getAudioVolume(): number
    {
        return BaseDataManager.internalGetNum(AudioManager.AUDIO_VOLUME, 1);
    }

    setAudioVolume(volume: number)
    {
        BaseDataManager.internalSaveNum(AudioManager.AUDIO_VOLUME, volume);
    }

    getMusicStatus(): boolean
    {
        return BaseDataManager.internalGetBoolean(this.MUSIC_ENABLE, true);
    }

    setMusicStatus(isOn: boolean)
    {
        BaseDataManager.internalSaveBoolean(this.MUSIC_ENABLE, isOn);
    }

    getMusicVolume(): number
    {
        return BaseDataManager.internalGetNum(AudioManager.MUSIC_VOLUME, 1);
    }

    setMusicVolume(volume: number)
    {
        BaseDataManager.internalSaveNum(AudioManager.MUSIC_VOLUME, volume);
    }

    // update (dt) {}
}
