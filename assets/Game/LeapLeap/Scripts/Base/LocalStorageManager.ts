// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class LocalStorageManager {
  public static internalGetString(key: string, defaultValue: string = ""): string {
    const isValue = cc.sys.localStorage.getItem(key);

    return isValue == undefined ? defaultValue : isValue;
  }

  public static internalSaveString(key: string, strValue: string = ""): void {
    if (strValue == undefined) {
      cc.sys.localStorage.removeItem(key);
    } else {
      cc.sys.localStorage.setItem(key, strValue);
    }
  }

  public static internalSaveBoolean(key: string, defaultValue: boolean = true): void {
    if (defaultValue == undefined) {
      cc.sys.localStorage.removeItem(key);
    } else {
      cc.sys.localStorage.setItem(key, defaultValue);
    }
  }

  public static internalGetBoolean(key: string, defaultValue: boolean = true): boolean {
    let isValue = cc.sys.localStorage.getItem(key);
    if (isValue == undefined) {
      isValue = defaultValue;
    }
    if (typeof isValue === "string") {
      return isValue === "true";
    } else {
      return isValue;
    }
  }
}
