/****************************************************************************
Copyright (c) 2015-2016 Chukong Technologies Inc.
Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/
package org.cocos2dx.javascript;

import android.Manifest;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.content.res.Configuration;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.media.MediaScannerConnection;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.util.Base64;
import android.util.Log;
import android.view.WindowManager;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;

import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.dynamiclinks.FirebaseDynamicLinks;
import com.google.firebase.dynamiclinks.PendingDynamicLinkData;
import com.treebo.internetavailabilitychecker.InternetAvailabilityChecker;
import com.treebo.internetavailabilitychecker.InternetConnectivityListener;

import org.cocos2dx.lib.Cocos2dxGLSurfaceView;

import java.io.File;
import java.io.FileOutputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

//\jsb-link\frameworks\runtime-src\proj.android-studio\app\src\org\cocos2dx\javascript
public class AppActivity extends com.sdkbox.plugin.SDKBoxActivity implements InternetConnectivityListener {
    private static String deepLink = "";
    final int PERMISSION_REQUEST_CODE = 999;

    private InternetAvailabilityChecker mInternetAvailabilityChecker;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        AndroidNativeUtils.setMainActivity(this);
        // Workaround in
        // https://stackoverflow.com/questions/16283079/re-launch-of-activity-on-home-button-but-only-the-first-time/16447508
        if (!isTaskRoot()) {
            // Android launched another instance of the root activity into an existing task
            // so just quietly finish and go away, dropping the user back into the activity
            // at the top of the stack (ie: the last state of this task)
            // Don't need to finish it again since it's finished in super.onCreate .
            return;
        }
        // DO OTHER INITIALIZATION BELOW
        SDKWrapper.getInstance().init(this);
        final AppActivity app = this;
        NativeWebSocketClient.OnOpenFunction = new OnOpenFunction() {
            @Override
            public void run() {
                JavascriptJavaBridge.call("WSClient_Android_open", "");
            }
        };

        NativeWebSocketClient.OnMessageFunction = new OnMessageFunction() {
            @Override
            public void run(final byte[] data) {
                String base64_str = Base64.encodeToString(data, Base64.DEFAULT);
                base64_str = base64_str.replace("\n", "");
                JavascriptJavaBridge.call("WSClient_Android_message", base64_str);
            }
        };

        NativeWebSocketClient.OnErrorFunction = new OnErrorFunction() {
            @Override
            public void run(String msg) {
                JavascriptJavaBridge.call("WSClient_Android_error", msg);
            }

        };

        NativeWebSocketClient.OnCloseFunction = new OnCloseFunction() {
            @Override
            public void run(int code, String reason) {
                JavascriptJavaBridge.call("WSClient_Android_close", code, reason);
            }
        };
        this.getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        checkDynamicLink();
        setupNotification();

        printKeyHash();
        initConnectionCheck();

    }

    private  void  initConnectionCheck(){
        InternetAvailabilityChecker.init(this);
        mInternetAvailabilityChecker = InternetAvailabilityChecker.getInstance();
        mInternetAvailabilityChecker.addInternetConnectivityListener(this);
    }

    public void getConnectionStatus(){
        boolean isConnected = mInternetAvailabilityChecker.getCurrentInternetAvailabilityStatus();
        JavascriptJavaBridge.call("ON_NETWORK_STATUS_CHANGED", isConnected);
    }

    private void printKeyHash() {
        try {
            PackageInfo info = getPackageManager().getPackageInfo(
                    this.getPackageName(),
                    PackageManager.GET_SIGNATURES);
            for (Signature signature : info.signatures) {
                MessageDigest md = MessageDigest.getInstance("SHA");
                md.update(signature.toByteArray());
                Log.d("KH:", Base64.encodeToString(md.digest(), Base64.DEFAULT));
            }
        } catch (PackageManager.NameNotFoundException e) {

        } catch (NoSuchAlgorithmException e) {

        }
    }

    @Override
    public void onInternetConnectivityChanged(boolean isConnected) {
        JavascriptJavaBridge.call("ON_NETWORK_STATUS_CHANGED", isConnected);
    }


    private void setupNotification() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            // Create channel to show notifications.
            String channelId  = "Messages";
            String channelName = "Messages";
            NotificationManager notificationManager =
                    getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(new NotificationChannel(channelId,
                    channelName, NotificationManager.IMPORTANCE_LOW));
        }
    }

    private void checkDynamicLink() {
        FirebaseDynamicLinks.getInstance().getDynamicLink(getIntent())
                .addOnSuccessListener(this, new OnSuccessListener<PendingDynamicLinkData>() {
                    @Override
                    public void onSuccess(PendingDynamicLinkData pendingDynamicLinkData) {
                        // Get deep link from result (may be null if no link is found)
                        // Uri deepLinkUri = null;
                        if (pendingDynamicLinkData != null) {
                            Log.w("Cocos", "getDynamicLink:onSuccess");
                            deepLink = pendingDynamicLinkData.getLink().toString();
                            JavascriptJavaBridge.call("FireBaseDynamicLinkHandleComp_handleDynamicLinkFireBase",
                                    deepLink);
                        }

                        // Handle the deep link. For example, open the linked
                        // content, or apply promotional credit to the user's
                        // account.
                        // ...

                        // ...
                    }
                }).addOnFailureListener(this, new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        Log.w("Cocos", "getDynamicLink:onFailure", e);
                    }
                });
    }

    public static String getDeepLink() {
        return deepLink;
    }

    @Override
    public Cocos2dxGLSurfaceView onCreateView() {
        Cocos2dxGLSurfaceView glSurfaceView = new Cocos2dxGLSurfaceView(this);
        // TestCpp should create stencil buffer
        glSurfaceView.setEGLConfigChooser(5, 6, 5, 0, 16, 8);
        SDKWrapper.getInstance().setGLSurfaceView(glSurfaceView, this);

        return glSurfaceView;
    }

    @Override
    protected void onResume() {
        super.onResume();
        SDKWrapper.getInstance().onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
        SDKWrapper.getInstance().onPause();

    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        // Workaround in
        // https://stackoverflow.com/questions/16283079/re-launch-of-activity-on-home-button-but-only-the-first-time/16447508
        if (!isTaskRoot()) {
            return;
        }

        SDKWrapper.getInstance().onDestroy();

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        SDKWrapper.getInstance().onActivityResult(requestCode, resultCode, data);

        facebook.onActivityResult(this, requestCode, resultCode, data);
        zalo.onActivityResult(this, requestCode, resultCode, data);
    }


    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        SDKWrapper.getInstance().onNewIntent(intent);
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        SDKWrapper.getInstance().onRestart();
    }

    @Override
    protected void onStop() {
        super.onStop();
        SDKWrapper.getInstance().onStop();
    }

    @Override
    public void onBackPressed() {
        SDKWrapper.getInstance().onBackPressed();
        super.onBackPressed();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        SDKWrapper.getInstance().onConfigurationChanged(newConfig);
        super.onConfigurationChanged(newConfig);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        SDKWrapper.getInstance().onRestoreInstanceState(savedInstanceState);
        super.onRestoreInstanceState(savedInstanceState);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        SDKWrapper.getInstance().onSaveInstanceState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onStart() {
        SDKWrapper.getInstance().onStart();
        super.onStart();
        checkDynamicLink();
    }

    /*SOCIAL ------------------------------------------------------------*/
    private GameZalo zalo = new GameZalo();
    private GameFacebook facebook = new GameFacebook();
	private GameTelegram telegram = new GameTelegram();

    /*FACEBOOK-------*/
    public void initFacebook(){
        facebook.initFacebook(this);
    }

    public void loginFacebook(){
        facebook.loginFacebook();
    }

    public void shareFacebook(String link){
        facebook.share(link);
    }

    public String getFacebookAccessToken(){
        return  facebook.getAccessToken();
    }
	
	
    public void logoutFacebook(){facebook.logout();}

    /*ZALO-------*/
    public void initZalo(){
        zalo.init(this);
    }

    public void loginZalo(){
        zalo.login();
    }

    public void shareZalo(String link){
        zalo.share(link);
    }

    public String getZaloAccessToken(){
        return zalo.getAccessToken();
    }

    public void getZaloAccessTokenRequest(){
        zalo.getAccessTokenRequest();
    }
	
	/*TELEGRAM-------*/
    public void initTelegram(){
        telegram.init(this);
    }

    public void shareTelegram(String link){
        telegram.share(link);
    }
    /*END SOCIAL ------------------------------------------------------------*/

     public String getAppVersion(){
        try {
            PackageInfo info = getPackageManager().getPackageInfo(
                    this.getPackageName(),
                    PackageManager.GET_ACTIVITIES);
            return info.versionName;
        } catch (PackageManager.NameNotFoundException e) {
        }
        return "";
    }

    private void _saveQR(String imageName, int width, int height, String qrData){
       if(qrData.length()<=0) return;
         //Create bitmap image
        int resolutionIncrease = 5;
        Bitmap bmp = Bitmap.createBitmap(width * resolutionIncrease, width * resolutionIncrease, Bitmap.Config.RGB_565);
        for (int row = 0; row < width; row++) {
            for (int col = 0; col < width; col++) {
                int color = qrData.charAt(row * width + col)=='1'? Color.BLACK : Color.WHITE;
                for (int xRes = 0; xRes < resolutionIncrease; xRes++) {
                    for (int yRes = 0; yRes < resolutionIncrease; yRes++) {
                        bmp.setPixel(col * resolutionIncrease + yRes, row * resolutionIncrease + xRes, color);
                    }
                }
            }
        }


        ///SAVE IMAGE
        String root = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DCIM).toString()+ "/Camera/QR";
        File myDir = new File(root);
        myDir.mkdirs();
        String fname = imageName + ".png";
        File file = new File(myDir, fname);
        System.out.println(file.getAbsolutePath());
        if (file.exists()) file.delete();
        Log.i("LOAD", root + fname);
        try {
            FileOutputStream out = new FileOutputStream(file);
            bmp.compress(Bitmap.CompressFormat.PNG, 90, out);
            out.flush();
            out.close();
            JavascriptJavaBridge.call("SAVE_QR_CALLBACK", fname);
        } catch (Exception e) {
            e.printStackTrace();
            JavascriptJavaBridge.call("SAVE_QR_CALLBACK", "");
        }

        MediaScannerConnection.scanFile(this, new String[]{file.getPath()}, new String[]{"image/jpeg"}, null);  
    }

    String qrImageName; int qrWidth; int qrHeight; String qrData;

    public void saveQR(String imageName, int width, int height, String qrData) {
        String TAG = "Storage Permission";
        if (Build.VERSION.SDK_INT >= 23) {
            if (this.checkSelfPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE)
                    == PackageManager.PERMISSION_GRANTED) {
                Log.v(TAG, "Permission is granted");
               _saveQR(imageName, width, height, qrData);
            } else {
                Log.v(TAG, "Permission is revoked");
                qrImageName = imageName;
                qrWidth = width;
                qrHeight = height;
                this.qrData = qrData;
                ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, PERMISSION_REQUEST_CODE);
            }
        }
        else { //permission is automatically granted on sdk<23 upon installation
            Log.v(TAG,"Permission is granted");
            _saveQR(imageName, width, height, qrData);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        switch (requestCode) {
            case PERMISSION_REQUEST_CODE: {
                if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    _saveQR(qrImageName, qrWidth, qrHeight, qrData);
                } else {
                    JavascriptJavaBridge.call("SAVE_QR_CALLBACK", "");
                }
            }
        }
    }
}
