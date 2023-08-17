const {ccclass, property} = cc._decorator;

@ccclass
export default class MovingObjs extends cc.Component {

    screenWidth = 0;
    screenHeight = 0;

    speed = 50;

    curSpeed = 0;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    setScreenSize(w, h)
    {
        this.screenWidth = w;
        this.screenHeight = h;
    }

    start () 
    {
        if(this.node.getPosition().x < 0)
        {
            this.curSpeed = this.speed;
        }
        else
        {
            this.curSpeed = -this.speed;
        }
        //cc.warn("CHECK MOVING OBJ " + this.curSpeed);
    }

    update (dt)
    {
        let newX = this.node.getPosition().x + this.curSpeed*dt;
        this.node.setPosition(newX, this.node.getPosition().y);

        if(this.node.getPosition().x > (this.screenWidth/2 + this.node.getContentSize().width/2) + 100)
        {
            this.node.setPosition(-(this.screenWidth/2 + this.node.getContentSize().width/2), 
                                    this.node.getPosition().y);
        }
        else if(this.node.getPosition().x < -(this.screenWidth/2 + this.node.getContentSize().width/2) - 100)
        {
            this.node.setPosition(this.screenWidth/2 + this.node.getContentSize().width/2, 
                                    this.node.getPosition().y);
        }
    }
}
