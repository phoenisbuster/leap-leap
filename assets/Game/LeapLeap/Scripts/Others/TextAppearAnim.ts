const {ccclass, property} = cc._decorator;

@ccclass
export default class TextAppear extends cc.Component 
{
    start () 
    {
        let newY = this.node.getPosition().y;
        cc.tween(this.node).to(1,
        {
            opacity: 0,
            scale: 0,
            y: newY + 100
        }).call(()=>
        {
            this.node.destroy();
        }).start();
    }

    // update (dt) {}
}
