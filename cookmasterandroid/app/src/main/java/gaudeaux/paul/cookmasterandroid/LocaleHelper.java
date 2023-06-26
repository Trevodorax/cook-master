package gaudeaux.paul.cookmasterandroid;

import android.content.Context;
import android.content.res.Configuration;
import android.content.res.Resources;
import java.util.Locale;
import java.util.Random;

public class LocaleHelper {

    private static final String[] SUPPORTED_LANGUAGES = {"fr", "en", "it", "es", "pt", "de"};

    public static void setLocale(Context context, String languageCode) {
        Locale locale = new Locale(languageCode);
        Locale.setDefault(locale);

        Resources resources = context.getResources();
        Configuration configuration = resources.getConfiguration();
        configuration.setLocale(locale);
        resources.updateConfiguration(configuration, resources.getDisplayMetrics());
    }

    public static void switchLanguageRandomly(Context context) {
        Random random = new Random();
        int randomIndex = random.nextInt(SUPPORTED_LANGUAGES.length);
        String randomLanguageCode = SUPPORTED_LANGUAGES[randomIndex];
        setLocale(context, randomLanguageCode);
    }
}
