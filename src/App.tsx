import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import merge from "deepmerge";
import { AdMobInterstitial } from "expo-ads-admob";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import i18n from "i18n-js";
import React, { useContext, useEffect } from "react";
import { Alert, Platform } from "react-native";
import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { LanguageContext, ThemeContext } from "./contexts";
import { BottomTabRoutes } from "./routes";

const CombinedDefaultTheme = merge(PaperDefaultTheme, NavigationDefaultTheme);
const CombinedDarkTheme = merge(PaperDarkTheme, NavigationDarkTheme);

const interstitialID =
  Platform.select({
    ios: "ca-app-pub-3940256099942544/4411468910",
    android: "ca-app-pub-3940256099942544/1033173712",
  }) || "";

export function App() {
  const { darkTheme, loadTheme } = useContext(ThemeContext);
  const { loadLanguage } = useContext(LanguageContext);

  useEffect(() => {
    const preLoad = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        loadLanguage();
        loadTheme();
        await Font.loadAsync({
          ...MaterialCommunityIcons.font,
          ...Ionicons.font,
        });
      } catch {
        Alert.alert(
          i18n.t("settings.notLoaded"),
          i18n.t("settings.notLoadedSettings"),
          [
            { text: i18n.t("settings.cancel"), onPress: () => {} },
            { text: i18n.t("settings.ok"), onPress: () => {} },
          ]
        );
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    const showInterstitialAd = async () => {
      try {
        await AdMobInterstitial.setAdUnitID(interstitialID);
        await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
        await AdMobInterstitial.showAdAsync();
      } catch (error) {
        console.log(error);
      }
    };

    preLoad();
    showInterstitialAd();
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider
        theme={darkTheme ? CombinedDarkTheme : CombinedDefaultTheme}
      >
        <NavigationContainer
          theme={darkTheme ? CombinedDarkTheme : CombinedDefaultTheme}
        >
          <BottomTabRoutes />
          {darkTheme ? <StatusBar style="light" /> : <StatusBar style="dark" />}
          <Toast ref={(ref) => Toast.setRef(ref)} />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
