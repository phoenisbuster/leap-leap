const {ccclass, property} = cc._decorator;

const Canvas: string = "ScreenGame";

@ccclass
export default class WigetCanvas extends cc.Component {

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
            this.SetSizeAndPos();
        }
    }

    start () 
    {
        // try
        // {
        //     if(this.Canvas)
        //     {
        //         this.SetSizeAndPos();
        //     }
        //     else
        //     {
        //         throw new Error("The main Canvas was not found");
        //     }
        // }
        // catch(e)
        // {
        //     cc.error(e.msg);
        // }
    
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
}
