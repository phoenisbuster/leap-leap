// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import LocalStorageManager from "./LocalStorageManager";
import SoundItem from "./SoundItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SoundManager extends cc.Component {
  private static instance: SoundManager = null;
  soundMap: Map<string, SoundItem> = new Map<string, SoundItem>();

  private KEY_EFFECT_VOLUME: string = "volumeEffect";
  private KEY_EFFECT: string = "isEffect";
  private KEY_MUSIC_VOLUME: string = "volumeMusic";
  private KEY_MUSIC: string = "isMusic";
  
  private isEnableMusic: boolean = true;
  private isEnableSfx: boolean = true;
  private musicVolume: number = 1;
  private sfxVolume: number = 1;

  static ON_SOUND_BG_EVENT = "ON_SOUND_BG_EVENT";
  static ON_SOUND_EFF_EVENT = "ON_SOUND_EFF_EVENT";

  static getInstance(): SoundManager {
    return SoundManager.instance;
  }

  onLoad(){
    this.init();
    this.loadConfigFromFromStorage();
  }

  init(){
    SoundManager.instance = this;
    let sounds = this.node.getComponentsInChildren(SoundItem);
    for (let i = 0; i < sounds.length; i++) {
      this.soundMap.set(sounds[i].node.name, sounds[i]);
    }
  }

  play(soundName: string, from: number = 0, autoStopDelay: number = -1){
    if(this.soundMap.has(soundName)){
      this.soundMap.get(soundName).play(from, autoStopDelay);
    }else{
      cc.warn("can not find sound", soundName)
    }
  }

  stop(soundName: string){
    if(this.soundMap.has(soundName)){
      this.soundMap.get(soundName).stop();
    }
  }

  private loadConfigFromFromStorage() {
    this.isEnableMusic = this.getMusicStatusFromStorage();
    this.isEnableSfx = this.getSfxStatusFromStorage();
    this.musicVolume = this.getMusicVolumeFromStorage();
    this.sfxVolume = this.getSfxVolumeFromStorage();

    this.setMusicVolume(this.musicVolume);
    this.setSfxVolume(this.sfxVolume);
  }

  setMusicStatus(isOn: boolean){
    this.isEnableMusic = isOn;
    cc.audioEngine.setMusicVolume(this.MusicVolume);
    this.saveMusicStatusToStorage(isOn);
    cc.systemEvent.emit(SoundManager.ON_SOUND_BG_EVENT, isOn);
  }

  setMusicVolume(volume: number, isSave: boolean = true){
    this.musicVolume = volume;
    cc.audioEngine.setMusicVolume(volume);
    if(!isSave) return; 
    
    this.saveMusicVolumeToStorage(volume);
    let isOn = volume > 0;
    this.saveMusicStatusToStorage(isOn);
    cc.systemEvent.emit(SoundManager.ON_SOUND_BG_EVENT, isOn);
  }

  get MusicVolume(){
    return this.isEnableMusic? this.musicVolume: 0;
  }

  setSfxVolume(volume: number, isSave: boolean = true){
    this.sfxVolume = volume;
    cc.audioEngine.setEffectsVolume(volume);
    if(!isSave) return;
    
    this.saveSfxVolumeToStorage(volume);
    let isOn = this.sfxVolume > 0;
    this.saveSfxStatusToStorage(isOn);
    cc.systemEvent.emit(SoundManager.ON_SOUND_EFF_EVENT, isOn);
  }

  setSfxStatus(isOn: boolean){
    this.isEnableSfx = isOn;
    cc.audioEngine.setEffectsVolume(this.SfxVolume);
    this.saveSfxStatusToStorage(isOn);
    cc.systemEvent.emit(SoundManager.ON_SOUND_EFF_EVENT, isOn);
  }

  get SfxVolume(){
    return this.isEnableSfx? this.sfxVolume: 0;
  }

  //SECTION Storage
  getMusicStatusFromStorage(): boolean {
    return LocalStorageManager.internalGetBoolean(this.KEY_MUSIC, true);
  }

  saveMusicStatusToStorage(isOn: boolean){
    LocalStorageManager.internalSaveBoolean(this.KEY_MUSIC, isOn);
  }

  getMusicVolumeFromStorage(): number {
    return Number.parseFloat(LocalStorageManager.internalGetString(this.KEY_MUSIC_VOLUME, "1"));
  }

  saveMusicVolumeToStorage(volume: number): void {
    LocalStorageManager.internalSaveString(this.KEY_MUSIC_VOLUME, volume.toString());
  }

  getSfxStatusFromStorage(): boolean {
    return LocalStorageManager.internalGetBoolean(this.KEY_EFFECT, true);
  }

  saveSfxStatusToStorage(isOn: boolean){
    LocalStorageManager.internalSaveBoolean(this.KEY_EFFECT, isOn);
  }

  getSfxVolumeFromStorage(): number {
    return Number.parseFloat(LocalStorageManager.internalGetString(this.KEY_EFFECT_VOLUME, "1"));
  }
  
  saveSfxVolumeToStorage(volume: number): void {
    LocalStorageManager.internalSaveString(this.KEY_EFFECT_VOLUME, volume.toString());
  }
  //!SECTION
  
  
  public pauseAllEffects(): void {
    cc.audioEngine.pauseAllEffects();
  }

  public resumeAllEffects(): void {
    cc.audioEngine.resumeAllEffects();
  }

  onDestroy(){
    cc.audioEngine.stopAllEffects();
    
    delete SoundManager.instance;
    SoundManager.instance = null;
  }
}
