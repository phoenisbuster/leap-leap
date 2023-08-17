import GameUtils from "./GameUtils";

export default class ConnectDefine {
  public static fbAppId = "";
  public static addressConfig: string[] = [];

  public static loadConfigJSON(callback = null) {
    let data = "";
    GameUtils.loadAsset("connectConfig", cc.JsonAsset, (jsonAsset: cc.JsonAsset) => {
      ConnectDefine.readConfig(jsonAsset.json, callback);
    });
  }

  private static readConfig(data, callback = null) {
    var config = require("json-configurator")(data, data["env"]);
    ConnectDefine.addressConfig = config.addressConfig;
    callback && callback();
  }
}
