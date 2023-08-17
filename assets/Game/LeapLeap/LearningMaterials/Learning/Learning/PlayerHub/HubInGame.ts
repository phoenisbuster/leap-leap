//import { _decorator, Component, Node, SpriteFrame, Sprite, AudioSource, input, Input, EventKeyboard, KeyCode } from 'cc';
import { PlayerController } from '../Main/PlayerContrller';
import { SettingPanel } from './SettingPanel';
const { ccclass, property } = cc._decorator;

@ccclass
export class HubInGame extends cc.Component 
{
    @property({type: cc.SpriteFrame})
    public SoundOn: cc.SpriteFrame | null = null;
    @property({type: cc.SpriteFrame})
    public SoundOff: cc.SpriteFrame | null = null;
    @property({type: cc.AudioSource})
    public BG_Music: cc.AudioSource | null = null;

    @property({type: cc.Node})
    public ReturnPanel: cc.Node | null = null;
    @property({type: cc.Node})
    public SettingPanel: cc.Node | null = null;
    @property({type: cc.Node})
    public Menu: cc.Node | null = null;

    @property({type: PlayerController})
    public playerCtrl: PlayerController = null;

    isSoundOn = true;
    isSetting = false;
    isReturn = false;
    old_volume = 0;

    ToggleSound()
    {
        this.node.getChildByName("ToggleSound").getComponent(cc.Sprite).spriteFrame = this.isSoundOn? this.SoundOff : this.SoundOn;
        if(this.isSoundOn)
        {
            this.old_volume = this.BG_Music.volume;
            this.BG_Music.volume = 0;
            this.SettingPanel.getComponent(SettingPanel).SoundSetting.progress = 0;
        }
        else
        {
            this.BG_Music.volume = this.old_volume;
            this.SettingPanel.getComponent(SettingPanel).SoundSetting.progress = this.old_volume;
        }
        this.isSoundOn = !this.isSoundOn;
    }

    onSettingClick()
    {
        if(this.isReturn && this.ReturnPanel)
        {
            this.OnClickResume();
        }
        if(!this.isSetting)
        {
            if(this.ReturnPanel)
            {
                this.ReturnPanel.active = false;
            }            
            this.SettingPanel.active = true;
            if(this.Menu)
            {
                this.Menu.active = false;
            }
            if(this.playerCtrl)
            {
                this.playerCtrl.setInputActive(false);
            }           
            this.isSetting = true;
            this.isReturn = false; 
        }
        else
        {
            this.OnClickResume();
        }    
    }

    onLeaveClick()
    {
        if(this.isSetting)
        {
            this.OnClickResume();
        }
        if(!this.isReturn)
        {
            if(this.ReturnPanel)
            {
                this.ReturnPanel.active = true;
            }  
            this.SettingPanel.active = false;
            if(this.Menu)
            {
                this.Menu.active = false;
            }
            if(this.playerCtrl)
            {
                this.playerCtrl.setInputActive(false);
            }  
            this.isReturn = true;
            this.isSetting = false;
        }
        else
        {
            this.OnClickResume();
        }
    }

    OnClickResume()
    {
        if(this.ReturnPanel)
        {
            this.ReturnPanel.active = false;
        }  
        this.SettingPanel.active = false;
        if(this.Menu)
        {
            this.Menu.active = true;
        }
        if(this.playerCtrl)
        {
            this.playerCtrl.setInputActive(true);
        }  
        this.isReturn = false;
        this.isSetting = false;
    }
    
    start() 
    {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.OnClickKey, this);
    }

    OnClickKey(e)
    {
        if(e.keyCode == cc.macro.KEY.p)
        {
            this.ToggleSound();
        }
        if(e.keyCode == cc.macro.KEY.escape && this.ReturnPanel)
        {
            this.onLeaveClick();
        }
        if(e.keyCode == cc.macro.KEY.tab && this.SettingPanel)
        {
            this.onSettingClick();
        }
    }

    update(deltaTime: number) 
    {
        
    }
}

