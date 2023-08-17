//import { _decorator, Component, Vec3, input, Input, EventMouse, Animation, CCInteger, SkeletalAnimation } from 'cc';
//import { DEBUG } from 'cc/env';
import { TouchInput } from './TouchInput';
const { ccclass, property } = cc._decorator;

@ccclass
export class PlayerController extends cc.Component 
{
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    @property({type: cc.Animation})
    public BodyAnim: cc.Animation | null = null;
    @property({type: cc.SkeletonAnimation})
    public CocosAnim: cc.SkeletonAnimation | null = null;
    @property({type: cc.Integer})
    MoveIndex = 0;
    @property({type: TouchInput})
    InputSignal: TouchInput | null = null;

    // for fake tween
    private _startJump: boolean = false;
    private _jumpStep: number = 0;
    private _curJumpTime: number = 0;
    private _jumpTime: number = 0.1;
    private _curJumpSpeed: number = 0;
    private _curPos: cc.Vec3 = new cc.Vec3();
    private _deltaPos: cc.Vec3 = new cc.Vec3(0, 0, 0);
    private _targetPos: cc.Vec3 = new cc.Vec3();
    private _isMoving = false;
    public isActive = false;

    start () 
    {
        // Your initialization goes here.
        //input.on(Input.EventType.MOUSE_DOWN, this.onMouseUp, this);
        this.BodyAnim = this.node.getComponentInChildren(cc.Animation);
        this.node.emit('JumpStart');
        this.setInputActive(true);
    }

    setInputActive(active: boolean)
    {
        this.isActive = active;
        if(active)
        {
            this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onMouseUp, this);
            this.InputSignal?.node.on('JumpInput', this.jump1Step, this);
        }
        else
        {
            this.node.off(cc.Node.EventType.MOUSE_DOWN, this.onMouseUp, this);
        }
    }

    onMouseUp(event) 
    {
        if (event.getButton() === 0) 
        {
            this.jumpByStep(1);
        } 
        else if (event.getButton() === 2) 
        {
            this.jumpByStep(2);
        }
    }

    jump1Step()
    {
        this.jumpByStep(1);
    }
    jump2Step()
    {
        this.jumpByStep(2);
    }

    jumpByStep(step: number) 
    {
        if (this._isMoving) 
        {
            return;
        }
        this._startJump = true;
        this._jumpStep = step;
        this._curJumpTime = 0;
        this._curJumpSpeed = this._jumpStep / this._jumpTime;
        this.node.getPosition(this._curPos);
        cc.Vec3.add(this._targetPos, this._curPos, new cc.Vec3(this._jumpStep, 0, 0));
        
        if(this.CocosAnim)
        {
            this.CocosAnim.getAnimationState('cocos_anim_jump').speed = 3.5;
            this.CocosAnim.play('cocos_anim_jump');
        }
        
        if(this.BodyAnim)
        {
            if (step === 1) 
            {
                this.BodyAnim.play('OneStep');
                console.log("OneStep");
            } 
            else if (step === 2) 
            {
                this.BodyAnim.play('TwoStep');
                console.log("2Step");
            }
        }
        this.MoveIndex += step;

        this._isMoving = true;
        this.node.emit('JumpStart');
    }

    onOnceJumpEnd() 
    {
        this._isMoving = false;
        if(this.CocosAnim)
        {
            this.CocosAnim.play('cocos_anim_idle');
        }
        this.node.emit('JumpEnd', this.MoveIndex);
    }

    update (deltaTime: number) 
    {
        if(this._startJump) 
        {
            this._curJumpTime += deltaTime;
            if (this._curJumpTime > this._jumpTime) 
            {
                // end
                this.node.setPosition(this._targetPos);
                this._startJump = false;
                this.onOnceJumpEnd();
            } 
            else 
            {
                // tween
                this.node.getPosition(this._curPos);
                this._deltaPos.x = this._curJumpSpeed * deltaTime;
                cc.Vec3.add(this._curPos, this._curPos, this._deltaPos);
                this.node.setPosition(this._curPos);
            }
        }
    }
}

