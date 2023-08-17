// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
export interface InfiniteScrollViewInterface{
    createItem: (index: number) => cc.Node;
    destroyItem: (itemNode: cc.Node) => void;
    refreshItem: (itemNode: cc.Node, index: number) => void;
}

@ccclass
export default class InfiniteScrollViewComp extends cc.Component {
    @property(cc.ScrollView)
    private scrollView: cc.ScrollView = null;

    @property(cc.Node)
    private view: cc.Node = null;

    @property(cc.Node)
    private content: cc.Node = null;

    @property()
    private itemSpacing: number = 100;

    @property()
    private threshold: number = 200;
    
    private visibleStartY: number = 0;
    private maxItemCanbeLoaded: number = 0;
    private totalItem: number = 0;

    private lastItemIndexes: number[] = [];

    private nodeArray: cc.Node[] = [];
    private interfaceInstance: InfiniteScrollViewInterface = null;
   
    setNumberOfItem(num: number, firstCreated: boolean = false){
        this.content.height = this.itemSpacing * num;
        this.totalItem = num;

        this.clearAll();
        this.nodeArray = new Array(this.totalItem);
        if(!firstCreated){   
            this.checkAutoScrollToEnd();
            // this.checkScrollViewItem();
        }
    }
     

    init(interfaceInstance: InfiniteScrollViewInterface = null, totalItem: number) {
        var scrollViewEventHandler = new cc.Component.EventHandler();
        scrollViewEventHandler.target = this.node; // This node is the node to which your event handler code component belongs
        scrollViewEventHandler.component = "InfiniteScrollViewComp"; // This is the code file name
        scrollViewEventHandler.handler = "callback";
        // scrollViewEventHandler.customEventData = "";        
        this.scrollView.scrollEvents.push(scrollViewEventHandler);
        
        this.visibleStartY = this.content.y;
        this.maxItemCanbeLoaded = Math.ceil((this.view.height + this.threshold * 2) / this.itemSpacing);

        this.interfaceInstance = interfaceInstance;

        this.setNumberOfItem(totalItem, true);
        this.checkScrollViewItem();
    }

    private firstLoad(){
        let start = 0;
        let end = Math.min(start + this.maxItemCanbeLoaded, this.totalItem - 1);
        let arr = Array.from({length: end + 1 - start}, (_, i) => i + start);

        this.lastItemIndexes = arr;
        for (let n = 0; n < this.lastItemIndexes.length; n++) {
            let i = this.lastItemIndexes[n];
            if(this.nodeArray[i]==null && this.interfaceInstance){
                let node = this.interfaceInstance.createItem(i);
                this.setItemPosInScrollView(node, i);
                this.nodeArray[i] = node;          
            }
        }
    }

    callback(scrollView: cc.ScrollView, eventType: cc.ScrollView.EventType, customEventData) {    
        switch (eventType) {//baka mitai
            case cc.ScrollView.EventType.SCROLLING:            
                this.checkScrollViewItem();
                ////cc.log("zzzz", this.content.childrenCount);
                break;

            case cc.ScrollView.EventType.SCROLL_TO_BOTTOM:            
            case cc.ScrollView.EventType.SCROLL_TO_TOP:            
                this.checkScrollViewItem();
                break;         
        }
    }

    checkScrollViewItem(isRefresh: boolean = false){
        if(this.interfaceInstance == null) return;

        let newItemIndexes = this.getItemsToLoad();
        //delete node not in newItemIndexes
        let deleteIndexes = this.lastItemIndexes.filter((o1) => !newItemIndexes.some((o2) => o2 === o1));//find element in arr1 not in arr 2
        for (let d = 0; d < deleteIndexes.length; d++) {
            let i = deleteIndexes[d];
            if(this.nodeArray[i]!=null)
                this.interfaceInstance.destroyItem(this.nodeArray[i]);
            this.nodeArray[i] = null;          
        }

        this.lastItemIndexes = newItemIndexes;
        for (let n = 0; n < newItemIndexes.length; n++) {
            let i = newItemIndexes[n];

            if(this.nodeArray[i]==null){
                let node = this.interfaceInstance.createItem(i);
                this.setItemPosInScrollView(node, i);
                this.nodeArray[i] = node;          
            }else{
                if(isRefresh){
                    this.interfaceInstance.refreshItem(this.nodeArray[i], i);
                }
            }
        }
    }

    // refresh(){
    //     for (let n = 0; n < this.lastItemIndexes.length; n++) {
    //         let i = this.lastItemIndexes[n];
    //         if(this.nodeArray[i] !=null && this.interfaceInstance){
    //             this.interfaceInstance.refreshItem(this.nodeArray[i], i);
    //         }
    //     }
    // }

    checkAutoScrollToEnd(){
        if(this.totalItem <= this.maxItemCanbeLoaded){
            this.scrollView.scrollToTop(0.5);
            return;
        }

        let needScroll: boolean = false;
        let y = this.content.y - this.content.height;
        let yBot = this.visibleStartY - this.view.height;
        needScroll = y > yBot;

        if(needScroll)
            this.scrollView.scrollToBottom(0.5);
        else{
            this.checkScrollViewItem();
        }
    }

    setItemPosInScrollView(item: cc.Node, index: number){
        item.y = -index * this.itemSpacing;
    }
    

    getItemsToLoad():number[]{
        let currentY = this.content.y;
        let start = (currentY - this.threshold - this.visibleStartY) / this.itemSpacing;
        start = Math.floor(Math.max(0, start));
        let end = Math.min(start + this.maxItemCanbeLoaded, this.totalItem - 1);

        let arr = Array.from({length: end + 1 - start}, (_, i) => i + start);
        return arr;
    }

    clearAll(){
        for (let i = 0; i < this.nodeArray.length; i++) {
            if(this.nodeArray[i]!=null && this.interfaceInstance.destroyItem)
                this.interfaceInstance.destroyItem(this.nodeArray[i]);
            this.nodeArray[i] = null;
        }
    }
}
