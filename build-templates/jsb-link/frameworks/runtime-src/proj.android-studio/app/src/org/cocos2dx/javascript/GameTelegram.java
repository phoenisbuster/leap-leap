package org.cocos2dx.javascript;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;

public class GameTelegram {
    final String appLink = "https://play.google.com/store/apps/details?id=org.telegram.messenger";
    final String appName = "org.telegram.messenger";
    final String shareLink = "tg:msg_url?url=";
    Activity activity;
    public void init(Activity activity){
        this.activity = activity;
    }

    public void share(String link){

        final boolean isAppInstalled = isAppInstalled(activity.getApplicationContext(), appName);

        if (isAppInstalled)
        {
            activity.startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(shareLink + link)));
        }
        else
        {
            activity.startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(appLink)));
        }
    }

    boolean isAppInstalled(Context context, String packageName) {
        try {
            context.getPackageManager().getApplicationInfo(appName, PackageManager.GET_META_DATA);
            return true;
        }
        catch (PackageManager.NameNotFoundException e) {
            return false;
        }
    }


}
