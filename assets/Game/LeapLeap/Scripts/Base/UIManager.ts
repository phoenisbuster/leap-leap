// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import PopUpInstance from "./PopUpInstance";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIManager extends cc.Component {
    private static _instance: UIManager = null;

    // public static LeaderBoardPopup: string = "LeaderBoardPopup";
    // public static InforPopup: string = "InforPopup";
    // public static BetHistoryPopup: string = "BetHistoryPopup";
    // public static BetHistoryDetailPopup: string = "BetHistoryDetailPopup";
    // public static JackpotHistoryPopup: string = "JackpotHistoryPopup";
    // public static JackpotHistoryDetailPopup: string = "JackpotHistoryDetailPopup";
    // public static KickPopup: string = "KickPopup";
    // public static OtherUserListPopup: string = "OtherUserListPopup";
    // public static CannotJoinPopup: string = "CannotJoinPopup";
    @property(cc.Node)
    popupRoot: cc.Node = null;

    @property([cc.Prefab])
    popupPrefabs: cc.Prefab[] = [];

    private popupMap: Map<string, cc.Prefab> = new Map<string, cc.Prefab>();
    
    private _popupInstances: Map<string, PopUpInstance> = new Map<string, PopUpInstance>();
    private _currentPopup: PopUpInstance;
    private _currentPopupName: string;


    static getInstance(): UIManager {
        return UIManager._instance;
    }

    onLoad(){
        this.init();
    }

    init(){
      UIManager._instance = this;
      this.popupPrefabs.forEach(popupPrefab => {
          this.popupMap.set(popupPrefab.name, popupPrefab);
        });
    }

    public openPopup(
        type: typeof PopUpInstance,
        name: string,
        data = null,
        onComplete: (instance: PopUpInstance) => void = null,
        parent: cc.Node = null
      ) {
        let self = UIManager._instance;
        parent = parent ? parent : self.popupRoot;
        if (name == self._currentPopupName && self._currentPopup.node) {
          if (onComplete) onComplete(self._currentPopup);
          return;
        }
        self._currentPopupName = name;
        self.getPopupInstance(
          type,
          name,
          (instance) => {
            if (self._currentPopup == instance) {
              if (onComplete) onComplete(self._currentPopup);
              return;
            }
            self._currentPopup = instance;
            instance.open(data);
            instance._close = () => {
              self._currentPopup = null;
              self._currentPopupName = "";
            };
            if (onComplete) onComplete(self._currentPopup);
          },
          parent
        );
    }

    public getPopupInstance(type: typeof PopUpInstance, name: string, onComplete: (instance: PopUpInstance) => void, parent: cc.Node = null) {
        let self = UIManager._instance;
        const _parent = parent == null ? this.node : parent;
        if (self._popupInstances.has(name)) {
            let popup = self._popupInstances.get(name);
            popup.node.parent = null;
            _parent.addChild(popup.node);
            onComplete(popup);
        } else {
            this.loadPopUpPrefab(type, name, onComplete, _parent);
        }
    }

    private loadPopUpPrefab(type: typeof PopUpInstance, name: string, onComplete: (instance: PopUpInstance) => void, parent: cc.Node = null) {
        let self = UIManager._instance;
        let prefab = this.popupMap.get(name);
        const newNode = (cc.instantiate(prefab) as unknown) as cc.Node;
        const instance = newNode.getComponent(type);
        parent.addChild(newNode);
        self._popupInstances.set(name, instance);
        onComplete(instance);
    }

    onDestroy(){
        delete UIManager._instance;
        UIManager._instance = null;
    }
}
