// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class FitWidthComp extends cc.Component {

    
    @property(cc.Node)
    Canvas: cc.Node = null;

    ScreenWidth: number = 0
    ScreenHeight: number = 0;

    // LIFE-CYCLE CALLBACKS:
    scaleX: number = 1;

    onLoad () 
    {
        this.scaleX = Math.max(1, this.Canvas.getContentSize().width/ this.node.getContentSize().width + 0.1)
        this.SetSizeAndPos();
        this.node.scaleX = this.scaleX;
    }

    public SetSizeAndPos()
    {
        this.ScreenWidth = this.Canvas.getContentSize().width;
        this.ScreenHeight = this.Canvas.getContentSize().height;
        this.node.setContentSize(this.ScreenWidth, this.ScreenHeight);
        this.node.setPosition(cc.v2(this.Canvas.getPosition()));
    }

    update (dt) 
    {
        if(this.Canvas.getContentSize().width != this.ScreenWidth ||
            this.Canvas.getContentSize().height != this.ScreenHeight)
        {
            this.SetSizeAndPos();
        }
    }

  

    // update (dt) {}
}
