package org.cocos2dx.javascript;
import android.app.Activity;
import android.content.ClipData;
import android.content.ComponentName;
import android.content.Context;
import android.content.ClipboardManager;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.VibrationEffect;
import android.util.Log;
import java.net.URI;
import java.net.URISyntaxException;
import android.os.Vibrator;

public class AndroidNativeUtils {
    private static AppActivity mainActivity;

    public static void setMainActivity(AppActivity activity){
        AndroidNativeUtils.mainActivity = activity;
    }

    public static void createWebSocketClient(String url,String token ) {
        Log.e("createWebSocketClient ", url + " " + token);
        NativeWebSocketClient.createWebSocketClient(url,token);
    }
    public static void vibrate(){
        Log.e("vibrate","vibrate");
        Vibrator v = (Vibrator)AppActivity.getContext().getSystemService(Context.VIBRATOR_SERVICE);
        // Vibrate for 500 milliseconds
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            v.vibrate(VibrationEffect.createOneShot(200, VibrationEffect.DEFAULT_AMPLITUDE));
        } else {
             //deprecated in API 26
        v.vibrate(500);
        }
    }
    public static void copyToClipBoard(String text){
        Log.e("copyToClipBoard", text);
        ClipboardManager clipboard = (ClipboardManager)AppActivity.getContext().getSystemService(Context.CLIPBOARD_SERVICE);
        ClipData clip = ClipData.newPlainText("Copied Text", text);
        clipboard.setPrimaryClip(clip);
    }

    public static void passClipboard(){
        Log.e("passClipboard","passCkipboard");
        ClipboardManager clipboard = (ClipboardManager)AppActivity.getContext().getSystemService(Context.CLIPBOARD_SERVICE);
        ClipData pData = clipboard.getPrimaryClip();
        ClipData.Item item = pData.getItemAt(0);
        String txtpaste = item.getText().toString();
        Log.e("passClipboard 1 ",txtpaste);
        JavascriptJavaBridge.call("pass_clip_board", txtpaste);
    }

    public static void initFacebook(){
        AndroidNativeUtils.mainActivity.initFacebook();
    }

    public static void loginFacebook(){
        AndroidNativeUtils.mainActivity.loginFacebook();
    }

    public static void shareFacebook(String link){ AndroidNativeUtils.mainActivity.shareFacebook(link);}

    public static String getFacebookAccessToken(){return AndroidNativeUtils.mainActivity.getFacebookAccessToken();}


    public static void logoutFacebook(){
        AndroidNativeUtils.mainActivity.logoutFacebook();
    }
	
    public static void initZalo(){
        AndroidNativeUtils.mainActivity.initZalo();
    }

    public static void loginZalo(){
        AndroidNativeUtils.mainActivity.loginZalo();
    }

    public static void shareZalo(String link){ AndroidNativeUtils.mainActivity.shareZalo(link);}

    public static void getZaloAccessTokenRequest(){AndroidNativeUtils.mainActivity.getZaloAccessTokenRequest();}

    public static String getZaloAccessToken(){return AndroidNativeUtils.mainActivity.getZaloAccessToken();}
	
	public static void initTelegram(){
        AndroidNativeUtils.mainActivity.initTelegram();
    }

    public static void shareTelegram(String link){ AndroidNativeUtils.mainActivity.shareTelegram(link);}

    public  static String getAppVersion(){return  AndroidNativeUtils.mainActivity.getAppVersion();}
    public  static void getDeviceName(){
        String deviceName = Build.MANUFACTURER + " " + Build.MODEL;
        JavascriptJavaBridge.call("event_getDeviceName", deviceName);
    }

    public  static void saveQR(String name, String imgWidth, String imgHeight, String qrData){
        AndroidNativeUtils.mainActivity.saveQR(name, Integer.valueOf(imgWidth), Integer.valueOf(imgHeight), qrData);
    }

    public static void changeAppIcon(boolean isNewIcon) {
        Log.e("changeAppIcon", "=================== " + isNewIcon);
        PackageManager pm = AppActivity.getContext().getApplicationContext().getPackageManager();
        if (isNewIcon == true) {
            pm.setComponentEnabledSetting(
                    new ComponentName(AppActivity.getContext(),
                            "aliasTwo"), //com.example.dummy will be your package
                    PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
                    PackageManager.DONT_KILL_APP);

            pm.setComponentEnabledSetting(
                    new ComponentName(AppActivity.getContext(),
                            "aliasOne"),
                    PackageManager.COMPONENT_ENABLED_STATE_ENABLED,
                    PackageManager.DONT_KILL_APP);
        } else {
            pm.setComponentEnabledSetting(
                    new ComponentName(AppActivity.getContext(),
                            "aliasTwo"),
                    PackageManager.COMPONENT_ENABLED_STATE_ENABLED,
                    PackageManager.DONT_KILL_APP);

            pm.setComponentEnabledSetting(
                    new ComponentName(AppActivity.getContext(),
                            "aliasOne"),
                    PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
                    PackageManager.DONT_KILL_APP);
        }
    }
	
	 public  static  void getConnectionStatus(){
        AndroidNativeUtils.mainActivity.getConnectionStatus();
    }
}