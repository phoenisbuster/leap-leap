import { PlayerController } from "../../LearningMaterials/Learning/Learning/Main/PlayerContrller";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Platform extends cc.Component {

    @property(cc.Integer)
    Tag: number = 0;

    @property([cc.SpriteFrame])
    TexttureList: cc.SpriteFrame[] = [];

    BoxCollierComp: cc.BoxCollider = null;
    private isHit = false;

    @property(cc.Prefab)
    DestroyAnim: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    onCollisionEnter(other: cc.Collider, self: cc.Collider) 
    {
    
    }

    onCollisionStay(other: cc.Collider, self: cc.Collider) 
    {
        
    }

    onCollisionExit(other: cc.Collider, self: cc.Collider) 
    {
        
    }

    DestroyObj()
    {
        if(!this.DestroyAnim)
        {
            return;
        }
        this.node.getComponent(cc.Sprite).enabled = false;
        let anim = cc.instantiate(this.DestroyAnim);
        anim.parent = this.node;
        anim.setPosition(0, 0);
    }

    onLoad () 
    {
        if(this.TexttureList.length > 0)
        {
            this.node.getComponent(cc.Sprite).spriteFrame = this.TexttureList[0];
        }
        this.BoxCollierComp = this.node.getComponent(cc.BoxCollider);
    }

    start () 
    {
        this.BoxCollierComp.size = this.node.getContentSize();
    }

    update (dt) 
    {
        if(this.BoxCollierComp.size != this.node.getContentSize())
        {
            this.BoxCollierComp.size = this.node.getContentSize();
        }
    }
}
