package org.cocos2dx.javascript;

import android.util.Log;
import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

/*
* Khi gọi từ Java sang Javascript,nên thông qua việc gọi event = cc.systemEvent.emit
* B1 : Trong javascript đăng kí event : cc.systemEvent.on("Event name",()=>{ DO_SOMETHING_HERE});
* B2 : Từ Java : JavascriptJavaBridge.call("Event name","params1","params2");
*/
public class JavascriptJavaBridge {
    private static String COMMAND = "cc.systemEvent.emit(\"%s\",%s);";

    static private Cocos2dxActivity getCtx() {
        return (Cocos2dxActivity) Cocos2dxActivity.getContext();
    }
    public static void call(String eventName,Object... params){
        String par = "";
        for(int i = 0 ; i < params.length;i++){
            par += "\"" + params[i] + "\"";
            if(i < params.length - 1){
                par += ",";
            }
        }
        final String cmd = String.format(COMMAND, eventName,par);
        Log.d("JavascriptJavaBridge ", cmd);
        getCtx().runOnGLThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxJavascriptJavaBridge.evalString(cmd);
            }
        });
    }
}
