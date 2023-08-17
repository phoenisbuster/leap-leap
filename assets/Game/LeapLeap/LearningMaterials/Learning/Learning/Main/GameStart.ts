//import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = cc._decorator;

@ccclass
export class GameStart extends cc.Component 
{
    @property({type: cc.Node})
    DifficultySetting: cc.Node | null = null;

    start() 
    {
        
    }

    update(deltaTime: number) {
        
    }
}

