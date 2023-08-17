//import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = cc._decorator;

@ccclass
export class TouchInput extends cc.Component 
{
    onTouch()
    {
        this.node.emit('JumpInput');
    }
    
    start() 
    {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouch, this);
    }

    update(deltaTime: number) 
    {
        
    }
}

