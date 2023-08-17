
export default class GameUtils {
  

  public static isPlatformIOS() {
    return cc.sys.platform == cc.sys.IPHONE || cc.sys.platform == cc.sys.IPAD;
  }

  public static isBrowser() {
    return cc.sys.isBrowser;
  }

  public static isNative() {
    return cc.sys.isNative;
  }

  public static isNullOrUndefined(object) {
    return object == null || object == undefined;
  }

  public static loadAsset(path: string, type: typeof cc.Asset, onComplete: (image) => void = null) {
    cc.resources.load(path, type, function (err, sprite) {
      if (err) {
        cc.log(err);
        return;
      }
      if (onComplete) onComplete(sprite);
    });
  }

  public static convertToOtherNode(fromNode: cc.Node, targetNode: cc.Node, pos: cc.Vec3 = null) {
    let parent = fromNode;
    if (fromNode.parent) parent = fromNode.parent;
    let worldSpace = parent.convertToWorldSpaceAR(fromNode.position);
    if (pos) {
      worldSpace = fromNode.convertToWorldSpaceAR(pos);
    }
    return targetNode.convertToNodeSpaceAR(worldSpace);
  }

  public static createItemFromNode<T>(item: new () => T, node: cc.Node, parentNode: cc.Node = null, insert: boolean = false): T {
    if (!node) return null;
    let parent = parentNode ? parentNode : node.parent;
    let newNode = cc.instantiate(node);

    if (insert) {
      parent.insertChild(newNode, 0);
    } else {
      parent.addChild(newNode);
    }
    let newItem = newNode.getComponent(item);
    newItem.node.active = true;
    node.active = false;
    return newItem;
  }

  public static cloneItemFromNode<T>(item: new () => T, node: cc.Node): T {
    if (!node) return null;
    let newNode = cc.instantiate(node);

    let newItem = newNode.getComponent(item);
    newItem.node.active = true;
    node.active = false;
    return newItem;
  }

  public static createItemFromPrefab<T>(item: new () => T, prefab: cc.Prefab, parentNode: cc.Node): T {
    if (!prefab) return null;
    let node = cc.instantiate(prefab);
    parentNode.addChild(node);
    let newItem = node.getComponent(item);
    newItem.node.active = true;
    return newItem;
  }

  public static createNodeFromPrefab<T>(prefab: cc.Prefab, parentNode: cc.Node): cc.Node {
    if (!prefab) return null;
    let node = cc.instantiate(prefab);
    parentNode.addChild(node);
    return node;
  }

  public static formatDate(date: Date, format: string): string {
    format = format.replace("%Y", date.getFullYear().toString());
    format = format.replace("%m", date.getMonth().toString().length < 2 ? "0" + date.getMonth().toString() : date.getMonth().toString());
    format = format.replace("%d", date.getDay().toString().length < 2 ? "0" + date.getDay().toString() : date.getDay().toString());
    format = format.replace("%h", date.getHours().toString().length < 2 ? "0" + date.getHours().toString() : date.getHours().toString());
    format = format.replace("%m", date.getMinutes().toString().length < 2 ? "0" + date.getMinutes().toString() : date.getMinutes().toString());
    format = format.replace("%s", date.getSeconds().toString().length < 2 ? "0" + date.getSeconds().toString() : date.getSeconds().toString());
    return format;
  }

  public static formatMoneyNumberMyUser(money: number): string {
    let s = "$ " + this.numberWithCommas(money);
    return s;
  }

  public static formatMoneyNumberMyUserNotIcon(money: number): string {
    return this.numberWithCommas(money);
  }

  public static formatMoneyNumberUser(money: number): string {
    let s = "$ " + this.formatMoneyNumber(money);
    return s;
  }
  public static formatMoneyNumber(money: number): string {
    let sign = 1;
    let value = money;
    if (money < 0) {
      sign = -1;
      value = value * -1;
    }

    var format = "";
    if (value >= 1000000000.0) {
      value /= 1000000000.0;
      format = "B";
    } else if (value >= 1000000.0) {
      value /= 1000000.0;
      format = "M";
    } else if (value >= 1000.0) {
      value /= 1000.0;
      format = "K";
    }

    value = (Math.floor(value * 100 + 0.00000001) / 100) * sign;
    return value + format;
  }

  public static formatMoneyNumber_v2(money: number): string {
    let sign = 1;
    let value = money;
    if (money < 0) {
      sign = -1;
      value = value * -1;
    }

    var format = "";
    if (value >= 1000000000.0) {
      value /= 1000000000.0;
      format = " Tỉ";
    } else if (value >= 1000000.0) {
      value /= 1000000.0;
      format = " Triệu";
    } else if (value >= 1000.0) {
      value /= 1000.0;
      format = " Ngàn";
    }

    value = (Math.floor(value * 100 + 0.00000001) / 100) * sign;
    return value + format;
  }

  public static numberWithCommasMoney(number) {
    let s = "$ " + this.numberWithCommas(number);
    return s;
  }

  public static numberWithCommas(number) {
    if (number) {
      var result = (number = parseFloat(number)).toFixed(2).toString().split(".");
      result[0] = result[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      return result[1] !== "00" ? result.join(",") : result[0];
    }
    return "0";
  }

  public static numberWithCommasV2(number) {
    if (number) {
      var result = (number = parseFloat(number)).toFixed(2).toString().split(".");
      result[0] = result[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");

      return result[1] !== "00" ? result.join(",") : result[0];
    }
    return "0";
  }

  public static numberWithDot(number) {
    if (number) {
      var result = (number = parseFloat(number)).toFixed(2).toString().split(".");
      result[0] = result[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");

      return result[1] !== "00" ? result.join(",") : result[0];
    }
    return "0";
  }

  public static formatMoneyWithRange(money: number, shortenStart: number = 100000000): string {
    let rs = "";
    if (money >= shortenStart) rs = GameUtils.formatMoneyNumber(money);
    else rs = GameUtils.numberWithCommas(money);
    return rs;
  }

  public static roundNumber(num: number, roundMin: number = 1000): number {
    let temp = parseInt((num / roundMin).toString());
    if (num % roundMin != 0) temp += 1;
    return temp * roundMin;
  }

  public static getRandomInt(max: number, min: number = 0): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  public static randomInsideCircle(R: number = 1): cc.Vec2 {
    let r = R * Math.sqrt(Math.random());
    let theta = Math.random() * 2 * Math.PI;
    let x = r * Math.cos(theta);
    let y = r * Math.sin(theta);
    return new cc.Vec2(x, y);
  }

  public static getRandomFloat(max) {
    return Math.random() * max;
  }

  public static sum(array: number[]) {
    if (array.length <= 0) return 0;
    return array.reduce((total, val) => total + val);
  }

  public static FormatString(str: string, ...val: any[]) {
    for (let index = 0; index < val.length; index++) {
      str = str.replace(`{${index}}`, val[index].toString());
    }
    return str;
  }

}
