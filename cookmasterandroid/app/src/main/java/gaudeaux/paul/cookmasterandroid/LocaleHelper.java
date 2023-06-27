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
        // Get the current locale
        Locale currentLocale = getResourcesLocale(context.getResources());

        Random random = new Random();
        String randomLanguageCode;

        do {
            // Generate a random index and select a random language code
            int randomIndex = random.nextInt(SUPPORTED_LANGUAGES.length);
            randomLanguageCode = SUPPORTED_LANGUAGES[randomIndex];
        } while (currentLocale.getLanguage().equals(randomLanguageCode)); // make sure the locale changes each time

        setLocale(context, randomLanguageCode);
    }

    public static Locale getResourcesLocale(Resources resources) {
        Configuration config = resources.getConfiguration();
        return config.getLocales().get(0);
    }

}
