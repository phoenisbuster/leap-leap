//import { _decorator, Component, Node, input, Input, EventKeyboard, ProgressBar, KeyCode, macro, Tween, tween} from 'cc';
import { PlayerController } from './PlayerContrller';
const { ccclass, property } = cc._decorator;

@ccclass
export class InputForceBar extends cc.Component 
{
    @property
    Player: cc.Node = new cc.Node();

    @property
    _ProgressBar: cc.ProgressBar = new cc.ProgressBar();

    @property
    force = 0;

    @property
    isPress = false

    @property
    isProgressing = false;

    @property
    isIncreasing = false;

    
    start() 
    {
        this._ProgressBar = this.node.getComponent(cc.ProgressBar);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDestroy () 
    {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown(event)
    {
        if(event.keyCode == cc.macro.KEY.space)
        {
            this.isPress = true;
        }
    }

    onKeyUp(event)
    {
        if(event.keyCode == cc.macro.KEY.space)
        {
            console.log("Space Pressing")
            this.isPress = false;
            this._ProgressBar.progress = 0;
            this.isIncreasing = false;
            let value = this._ProgressBar.progress * 5;
            this.Player.getComponent(PlayerController).jumpByStep(value);
        }
    }

    IncreaseForceBar(value: boolean)
    {   
        let t = new cc.Tween();
        console.log("Start" + value);
        if(value)
        {
            console.log(1);
            t = cc.tween(this._ProgressBar.progress).to(5, 1,
            {
                progress()
                {
                    console.log(this._ProgressBar.progress);
                },
                onComplete()
                {
                    console.log("Complete");
                    this._ProgressBar.progress = 0;
                }
            }).repeatForever()
        }
        else
        {
            console.log(2);
            t.stop();
        }
    }

    update(deltaTime: number) 
    {
        if(this.isPress == true && this.isProgressing == false)
        {
            console.log("Increase Bar");
            this.isProgressing = true;
            this.IncreaseForceBar(true);
        }
        else if(this.isPress == false && this.isProgressing == true)
        {
            this.isProgressing = false;
            //this.unschedule(this.IncreaseForceBar());
            this.IncreaseForceBar(false);
        }
    }
}

