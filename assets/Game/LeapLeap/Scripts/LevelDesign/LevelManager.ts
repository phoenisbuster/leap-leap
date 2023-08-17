import Score from "../PlayerScore/Score";
import LevelData from "./LevelData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LevelManager extends cc.Component {

    @property(cc.Node)
    PageDifficulty: cc.Node = null;
    @property(cc.Toggle)
    ToogleDifficulty: cc.Toggle = null;

    @property(cc.Node)
    PageBackground: cc.Node = null;
    @property(cc.Toggle)
    ToogleBG: cc.Toggle = null;

    @property(cc.Node)
    PagePlatform: cc.Node = null;
    @property(cc.Toggle)
    TooglePlat: cc.Toggle = null;

    @property(cc.Label)
    Announce: cc.Label = null;

    BG_List_No: cc.Node[] = [];
    TranBG_List_No: cc.Node[] = [];

    // LIFE-CYCLE CALLBACKS:
    InitLevelManager()
    {
        if(!this.ToogleDifficulty.isChecked)
        {
            for(let i = 0; i < this.PageDifficulty.childrenCount; i++)
            {
                if(i != 0)
                {
                    this.PageDifficulty.children[i].active = this.ToogleDifficulty.isChecked;
                }
            }
        }
        if(!this.ToogleBG.isChecked)
        {
            for(let i = 0; i < this.PageBackground.childrenCount; i++)
            {
                if(i != 0)
                {
                    this.PageBackground.children[i].active = this.ToogleBG.isChecked;
                }
            }
        }
        if(!this.TooglePlat.isChecked)
        {
            for(let i = 0; i < this.PagePlatform.childrenCount; i++)
            {
                if(i != 0)
                {
                    this.PagePlatform.children[i].active = this.TooglePlat.isChecked;
                }
            }
        }
    }

    ToogleDiffPage()
    {
        for(let i = 0; i < this.PageDifficulty.childrenCount; i++)
        {
            if(i != 0)
            {
                this.PageDifficulty.children[i].active = this.ToogleDifficulty.isChecked;
            }
        }
    }

    ToogleBGPage()
    {
        for(let i = 0; i < this.PageBackground.childrenCount; i++)
        {
            if(i != 0)
            {
                this.PageBackground.children[i].active = this.ToogleBG.isChecked;
            }
        }
    }

    TooglePlatPage()
    {
        for(let i = 0; i < this.PagePlatform.childrenCount; i++)
        {
            if(i != 0)
            {
                this.PagePlatform.children[i].active = this.TooglePlat.isChecked;
            }
        }
    }

    ConfirmDiificulty()
    {
        for(let i = 1; i < this.PageDifficulty.childrenCount-1; i++)
        {
            if(this.PageDifficulty.children[i].getComponent(cc.EditBox).string == "")
            {
                this.CallAnnounce();
                return;
            }
            let value = +this.PageDifficulty.children[i].getComponent(cc.EditBox).string;
            if(Number.isNaN(value))
            {
                this.CallAnnounce();
                return;
            }
            switch(i)
            {
                case 1:
                    LevelData.initTime = value;
                    break;
                case 2:
                    LevelData.allowClockAt = value;
                    break;
                case 3:
                    LevelData.ClockAppearCount = value;
                    break;
                case 4:
                    LevelData.ClockAppearInterval = value;
                    break;
                case 5:
                    LevelData.DifficultyUpEvery = value;
                    break;
                case 6:
                    LevelData.ClockAppearCountUp = value;
                    break;
                case 7:
                    LevelData.ClockAppearIntervalUp = value;
                    break;
            }
            this.PageDifficulty.children[i].getComponent(cc.EditBox).placeholder = this.PageDifficulty.children[i].getComponent(cc.EditBox).placeholder + " : " + value.toString();
            this.PageDifficulty.children[i].getComponent(cc.EditBox).string = "";
            if(i == this.PageDifficulty.childrenCount-2)
            {
                LevelData.usedDifficulty = true;
            }
        }   
    }

    ConfirmBG()
    {
        if(this.PageBackground.childrenCount <= 3)
        {
            this.CallAnnounce("Not enough param");
            return;
        }

        for(let i = 3; i < this.PageBackground.childrenCount;)
        {
            if(this.PageBackground.children[i].getComponent(cc.EditBox).string == "" ||
                this.PageBackground.children[i+1].getComponent(cc.EditBox).string == "")
            {
                this.CallAnnounce();
                return;
            }
            
            let value1 = +this.PageBackground.children[i].getComponent(cc.EditBox).string;
            let value2 = +this.PageBackground.children[i+1].getComponent(cc.EditBox).string;
            if(Number.isNaN(value1) || Number.isNaN(value2))
            {
                this.CallAnnounce();
                return;
            }
            LevelData.BG_List.push(value1);
            LevelData.TranBG_List.push(value2);
            this.PageBackground.children[i].getComponent(cc.EditBox).string = "";
            this.PageBackground.children[i+1].getComponent(cc.EditBox).string = "";
            this.PageBackground.children[i].getComponent(cc.EditBox).placeholder = this.PageBackground.children[i].getComponent(cc.EditBox).placeholder + " : " + value1.toString();
            this.PageBackground.children[i+1].getComponent(cc.EditBox).placeholder = this.PageBackground.children[i+1].getComponent(cc.EditBox).placeholder + " : " + value2.toString();
            if(i+1 == this.PageBackground.childrenCount-1)
            {
                LevelData.useBG = true;
            }
            i = i/1 + 2;
        }
    }

    ConfirmPlat()
    {
        for(let i = 1; i < this.PagePlatform.childrenCount-1; i++)
        {
            if(this.PagePlatform.children[i].getComponent(cc.EditBox).string == "")
            {
                this.CallAnnounce();
                return;
            }
            let value = +this.PagePlatform.children[i].getComponent(cc.EditBox).string;
            if(Number.isNaN(value))
            {
                this.CallAnnounce();
                return;
            }
            switch(i)
            {
                case 1:
                    LevelData.MaximumRow = value;
                    break;
                case 2:
                    LevelData.MaximumPlatsPerRow = value;
                    break;
            }
            this.PagePlatform.children[i].getComponent(cc.EditBox).placeholder = this.PagePlatform.children[i].getComponent(cc.EditBox).placeholder + " : " + value.toString();
            this.PagePlatform.children[i].getComponent(cc.EditBox).string = "";
            
            if(i == this.PagePlatform.childrenCount-2)
            {
                LevelData.usedPlat = true;
            }
        }
    }

    InitBackgoundParams()
    {
        if(this.PageBackground.children[1].getComponent(cc.EditBox).string == "")
        {
            this.CallAnnounce();
            return;
        }
        else
        {
            this.BG_List_No.forEach(ele=>
            {
                ele.destroy();
            });
            this.TranBG_List_No.forEach(ele=>
            {
                ele.destroy();
            });
        }

        this.BG_List_No = [];
        this.TranBG_List_No = [];
        let value = +this.PageBackground.children[1].getComponent(cc.EditBox).string;
        if(Number.isNaN(value))
        {
            this.CallAnnounce();
            return;
        }
        this.PageBackground.children[1].getComponent(cc.EditBox).placeholder = this.PageBackground.children[1].getComponent(cc.EditBox).placeholder + ", Current is " + value.toString();
        this.PageBackground.children[1].getComponent(cc.EditBox).string = "";
        let y = this.PageBackground.children[1].getPosition().y;
        for(let i = 0; i < value; i++)
        {
            let BG = cc.instantiate(this.PageBackground.children[1]);
            BG.name = "BG number " + (i+1);
            BG.removeComponent(cc.Widget);
            BG.getComponent(cc.EditBox).string = "";
            BG.getComponent(cc.EditBox).placeholder = "No of plat to start transition BG, should be divisible to 12";
            BG.parent = this.PageBackground;
            BG.setPosition(cc.v2(-425, y - 80*(i+1)));
            

            let TranBG = cc.instantiate(this.PageBackground.children[1]);
            TranBG.name = "TranBG number " + (i+1);
            TranBG.removeComponent(cc.Widget);
            TranBG.getComponent(cc.EditBox).string = "";
            TranBG.getComponent(cc.EditBox).placeholder = "No of plat to complete transition BG, shound be 4";
            TranBG.parent = this.PageBackground;
            TranBG.setPosition(cc.v2(425, y - 80*(i+1)));

            this.BG_List_No.push(BG);
            this.TranBG_List_No.push(TranBG);
        }
    }

    CallAnnounce(text: string = "Incorrect format")
    {
        this.Announce.string = text;
        this.scheduleOnce(()=>
        {
            this.Announce.string = "Announce display here";
        }, 2);
    }

    OnClickPlay()
    {
        cc.director.loadScene("Main");
    }

    onLoad() 
    {
        
    }

    start() 
    {
        this.InitLevelManager();
    }

    update(dt) 
    {

    }
}
