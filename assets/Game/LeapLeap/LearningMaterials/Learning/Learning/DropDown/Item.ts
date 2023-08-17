//import { _decorator, Component, Node, Label, Button, input, Input, EventMouse, find } from 'cc';
import { DropDownBox } from './DropDownBox';
const { ccclass, property } = cc._decorator;

@ccclass
export class Item extends cc.Component 
{
    DropDown: DropDownBox | null = null;
    //@property({type: cc.Label})
    //Descript: cc.Node | null = null;

    initContent(dropdown: DropDownBox)
    {
        this.DropDown = dropdown;
    }

    itemBtn()
    {
        this.DropDown.SelectLabel.string = this.node.children[0].getComponent(cc.Label).string;
        this.DropDown.onClick();
        //this.Descript.active = false;
    }
    
    // onMouseEnter()
    // {
    //     switch(this.node.children[0].getComponent(cc.Label).string)
    //     {
    //         case "Easy":
    //             this.Descript.getComponent(cc.Label).string = "50 blocks, limit time 2 seconds per jump";
    //             break;
    //         case "Normal":
    //             this.Descript.getComponent(cc.Label).string = "100 blocks, limit time 1 seconds per jump";
    //             break;
    //         case "Hard":
    //             this.Descript.getComponent(cc.Label).string = "150 blocks, limit time 0.66 seconds per jump";
    //             break;
    //     }
    //     this.Descript.active = true;
    // }

    // onMouseLeave()
    // {
    //     this.Descript.active = false;
    // }

    start() 
    {
        // this.Descript = cc.find("Canvas/Description");
        // this.node.on(cc.Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
        // this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
    }

    update(deltaTime: number) 
    {
        
    }
}

