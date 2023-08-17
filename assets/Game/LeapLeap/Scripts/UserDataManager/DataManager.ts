const {ccclass, property} = cc._decorator;

@ccclass
export default class BaseDataManager 
{
    public static internalSaveString(key: string, strValue: string = ""): void 
    {
        if (strValue == undefined) 
        {
            cc.sys.localStorage.removeItem(key);
        } 
        else 
        {
            cc.sys.localStorage.setItem(key, strValue);
        }
    }

    public static internalGetString(key: string, defaultValue: string = ""): string 
    {
        const isValue = cc.sys.localStorage.getItem(key);
        return isValue == undefined ? defaultValue : isValue;
    }

    public static internalSaveBoolean(key: string, defaultValue: boolean = true): void 
    {
        if (defaultValue == undefined) 
        {
            cc.sys.localStorage.removeItem(key);
        } 
        else 
        {
            cc.sys.localStorage.setItem(key, defaultValue);
        }
    }

    public static internalGetBoolean(key: string, defaultValue: boolean = true): boolean 
    {
        let isValue = cc.sys.localStorage.getItem(key);
        if (isValue == undefined) 
        {
            isValue = defaultValue;
        }
        if (typeof isValue === "string") 
        {
            return isValue === "true";
        } 
        else 
        {
            return isValue;
        }
    }

    public static internalSaveNum(key: string, numValue: number = 0): void
    {
        if (numValue == undefined) 
        {
            cc.sys.localStorage.removeItem(key);
        } 
        else 
        {
            cc.sys.localStorage.setItem(key, numValue);
        }
    }

    public static internalGetNum(key: string, defaultValue: number = 0): number
    {
        let isValue = cc.sys.localStorage.getItem(key);
        if (isValue == undefined) 
        {
            isValue = defaultValue;
        }
        if (typeof isValue === "string") 
        {
            return +isValue;
        } 
        else 
        {
            return isValue;
        }
    }

    public static internalSaveUserData(key: string, userData): void
    {
        if (userData == undefined) 
        {
            cc.sys.localStorage.removeItem(key);
        } 
        else 
        {
            let userSaveData = JSON.stringify(userData);
            cc.sys.localStorage.setItem(key, userSaveData);
        }
    }

    public static internalGetUserData(key: string, userData = null)
    {
        let isValue = JSON.parse(cc.sys.localStorage.getItem(key));
        if (isValue == undefined) 
        {
            isValue = userData;
        }
        else 
        {
            return isValue;
        }
    }
}
