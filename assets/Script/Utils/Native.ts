const { ccclass, property } = cc._decorator;

/**
 * 
 * Native Caller
 * bool/string/number/string/function
    android -> org.cocos2dx.javascript.Native.SayHello(String helloString, String cbName);
    ios    -> Native.SayHello : (NSString*) helloString
                         arg1 : (NSString*) cbName;
 * native.call("SayHello", "hello world", (ok) => { })
 * native.callClz("Native", "SayHello", "hello world", (ok) => { })
 * let str = native.getStr("Native", "someArg")
*/
declare global {
  interface Window {
    js_native_cb: any;
  }
}
@ccclass
export default class Native {
  private static instance: Native;
  static getInstance(): Native {
    if (Native.instance == null) {
      Native.instance = new Native();
    }
    return Native.instance;
  }

  private DEFAULT_PACKAGE_NAME: string = "org/cocos2dx/javascript/";

  constructor() {
    Native.instance = this;
  }
  /**
   * call jsb with class name is default on native
   * @param arg
   */
  call(...arg) {
    let args = Array.prototype.slice.call(arguments);
    if (cc.sys.os == cc.sys.OS_ANDROID) {
      args.splice(0, 0, "AndroidNativeUtils");
    } else if (cc.sys.os == cc.sys.OS_IOS) {
      args.splice(0, 0, "IOSNativeUtils");
    } else {
      return;
    }

    this.callClz.apply(this, args);
  }
  /**
   * call jsb with class name is clz
   * @param clz
   * @param funcName
   * @param arg
   */
  callClz(clz, funcName, ...arg) {
    cc.log("callClz clz:", clz);
    let args = Array.prototype.slice.call(arguments);
    args.splice(2, 0, "V");
    return this._callClz.apply(this, args);
  }

  _callClz(clz, funcName, returnType) {
    cc.log("_callClz clz:", clz);
    let args = Array.prototype.slice.call(arguments);
    args.unshift(this.DEFAULT_PACKAGE_NAME);
    return this.callClzWithPackage.apply(this, args);
  }

  callClzWithPackage(pkg, clz, funcName, returnType) {
    let args = Array.prototype.slice.call(arguments);
    args.splice(0, 4);
    let real_args = [clz, funcName];

    cc.log("clz:", clz);
    cc.log("funcName:", funcName);

    if (cc.sys.os == cc.sys.OS_ANDROID) {
      real_args[0] = pkg + clz;
      real_args[2] = "()" + returnType;
      if (args.length > 0) {
        let sig = "";
        args.forEach((v) => {
          switch (typeof v) {
            case "boolean":
              sig += "Z";
              real_args.push(v);
              break;
            case "string":
              sig += "Ljava/lang/String;";
              real_args.push(v);
              break;
            case "number":
              sig += "D";
              real_args.push(v);
              break;
            case "function":
              sig += "Ljava/lang/String;";
              //   real_args.push(this._newCB(v));
              real_args.push(v);
              break;
          }
        });
        real_args[2] = "(" + sig + ")" + returnType;
      }
    } else if (cc.sys.os == cc.sys.OS_IOS) {
      if (args.length > 0) {
        for (let i = 0; i < args.length; i++) {
          let v = args[i];
          //   if (typeof v == "function") {
          //     real_args.push(this._newCB(v));
          //   } else {
          real_args.push(v);
          //   }
          if (i == 0) {
            funcName += ":";
          } else {
            funcName += "arg" + i + ":";
          }
        }

        real_args[1] = funcName;
      }
    } else {
      return;
    }
    cc.log("real_args:", real_args);
    return jsb.reflection.callStaticMethod.apply(jsb.reflection, real_args);
  }

  getStr(clz, funcName) {
    let args = Array.prototype.slice.call(arguments);
    args.splice(2, 0, "Ljava/lang/String;");
    return this._callClz.apply(this, args);
  }
}
