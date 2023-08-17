//import { _decorator, Component, Node, director, Root, game, find, log } from 'cc';
import { DropDownBox } from '../DropDown/DropDownBox';
import { Diffculty } from './Diffculty';
const { ccclass, property } = cc._decorator;

@ccclass
export class PlayButton extends cc.Component 
{
    @property({type: cc.Node})
    SelectedDifficulty: cc.Node | null = null;
    @property({type: cc.Node})
    RootNode: cc.Node | null = null;
    
    OnClickPlay()
    {
        cc.director.loadScene("Main");
    }
    start() 
    {
        
    }

    // update(deltaTime: number) 
    // {
        
    // }
}

