//import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = cc._decorator;

@ccclass
export class FollowPlayer extends cc.Component 
{
    @property
    Player: cc.Node = new cc.Node();

    start() 
    {

    }

    update(deltaTime: number) 
    {
        this.node.setPosition(new cc.Vec3(this.Player.position.x, 3, 10));
    }
}

