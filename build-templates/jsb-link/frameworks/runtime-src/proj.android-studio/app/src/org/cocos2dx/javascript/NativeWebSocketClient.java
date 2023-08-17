package org.cocos2dx.javascript;

import android.util.Log;

import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.TimeUnit;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.WebSocket;
import okhttp3.WebSocketListener;
import okio.ByteString;

interface OnOpenFunction {
    void run();
}

interface OnMessageFunction {
    void run(byte[] msg);
}

interface OnCloseFunction {
    void run(int code, String reason);
}

interface OnErrorFunction {
    void run(String msg);
}
public class NativeWebSocketClient {
    public static OnOpenFunction OnOpenFunction;
    public static OnMessageFunction OnMessageFunction;
    public static OnCloseFunction OnCloseFunction;
    public static OnErrorFunction OnErrorFunction;
    private static String TAG = "NativeWebSocketClientV2";
    private  static WebSocket webSocketClient = null;
    private static OkHttpClient clientCoinPrice = new OkHttpClient.Builder()
            .connectTimeout(10, TimeUnit.SECONDS)
            .readTimeout(60,TimeUnit.SECONDS)
            .retryOnConnectionFailure(true)
            .build();

    private  static WebSocketListener webSocketListenerCoinPrice = new WebSocketListener() {
        @Override
        public void onOpen(WebSocket webSocket, Response response) {
            webSocketClient = webSocket;
            Log.e(TAG, "onOpen");
            NativeWebSocketClient.OnOpenFunction.run();
        }

        @Override
        public void onMessage(WebSocket webSocket, String text) {
            Log.e(TAG, "MESSAGE: " + text);
        }

        @Override
        public void onMessage(WebSocket webSocket, ByteString bytes) {
            Log.e(TAG, "MESSAGE: " + bytes.hex());
            NativeWebSocketClient.OnMessageFunction.run(bytes.toByteArray());
        }

        @Override
        public void onClosing(WebSocket webSocket, int code, String reason) {
            webSocket.close(1000, null);
            webSocket.cancel();
            Log.e(TAG, "CLOSE: " + code + " " + reason);
        }

        @Override
        public void onClosed(WebSocket webSocket, int code, String reason) {
            //TODO: stuff
            Log.e(TAG, "onClosed: " + code + " " + reason);
            webSocketClient = null;
            NativeWebSocketClient.OnCloseFunction.run(code, reason);
        }

        @Override
        public void onFailure(WebSocket webSocket, Throwable t, Response response) {
            //TODO: stuff
            Log.e(TAG, "onFailure: ");
            NativeWebSocketClient.OnErrorFunction.run("error");

        }
    };
    public static void createWebSocketClient(String url,String token) {
        Log.d("NativeWebSocketClient",url + "," + token);
        Request requestCoinPrice = new Request.Builder().addHeader("sec-websocket-protocol",token).url(url).build();
        clientCoinPrice.newWebSocket(requestCoinPrice, webSocketListenerCoinPrice);
//            clientCoinPrice.dispatcher().executorService().shutdown();
    }



    public static void send(String data){
        byte[] bytes = android.util.Base64.decode(data,android.util.Base64.DEFAULT);
        okio.ByteString byteString = okio.ByteString.of(bytes);
        webSocketClient.send(byteString);
    }

    public static void close(){
        webSocketClient.close(1000,"");
    }
}
