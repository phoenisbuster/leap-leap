const {ccclass, property} = cc._decorator;

const Canvas: string = "ScreenGame";

@ccclass
export default class Responsive extends cc.Component {

    @property(cc.Node)
    Canvas: cc.Node = null;

    ScreenWidth: number = 0
    ScreenHeight: number = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        if(!this.Canvas)
        {
            this.Canvas = cc.find(Canvas);
        }
    }

    start () 
    {
        try
        {
            if(this.Canvas)
            {
                this.SetSizeAndPos();
            }
            else
            {
                throw new Error("The main Canvas was not found");
            }
        }
        catch(e)
        {
            cc.error(e.msg);
        }
    }

    public SetSizeAndPos()
    {
        this.ScreenWidth = this.Canvas.getContentSize().width;
        this.ScreenHeight = this.Canvas.getContentSize().height;
        this.node.setContentSize(this.ScreenWidth, this.ScreenHeight);
        this.node.setAnchorPoint(0,0);
        this.node.setPosition(cc.Vec2.ZERO);
    }

    update (dt) 
    {
        if(this.Canvas.getContentSize().width != this.ScreenWidth ||
            this.Canvas.getContentSize().height != this.ScreenHeight)
        {
            this.SetSizeAndPos();
        }
    }
}
