// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class ButtonEffectComp extends cc.Component {
    button: cc.Button = null;
    toggle: cc.Toggle = null;
    @property(cc.Node)
    target: cc.Node = null;
    onLoad () {
        this.button = this.node.getComponent(cc.Button);
        this.toggle = this.node.getComponent(cc.Toggle);
        if(this.target == null) this.target = this.node;
    }

    start () {
        this.registerEvent();
    }

    // update (dt) {}

    private registerEvent() {        
        this.node.on(cc.Node.EventType.TOUCH_START, this.onMouseEnter, this, true);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onMouseLeave, this, true);
    }
    
    private unregisterEvent() {        
        this.node.off(cc.Node.EventType.TOUCH_START, this.onMouseEnter, this, true);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onMouseLeave, this, true);        
    }
 
    onMouseEnter(_: cc.Event.EventTouch, __: any){
        if(this.button != null && this.button.interactable)
            this.target.scale = 1.05;

        if(this.toggle != null && this.toggle.interactable)
            this.target.scale = 1.05;
    }

    onMouseLeave(event: cc.Event.EventTouch, captureListeners: any){
        this.target.scale = 1;
    }

    onDestroy(){
        this.unregisterEvent();
    }
}
