// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiResponseCacheTimeoutInMinutes: 5,
  enableResponseCacheProcessing: true,
  applicationVersion: "1.0.1",
  // apiBaseUrl: "http://reg-api.renosoftwares.com/",
  apiBaseUrl: "http://13.235.53.15:8081/api/v1",

  apiDefaultTimeout: 1,
  renoWebsiteDownloadPageLink:
    "https://renosoftwares.com/apps/download/boiler-plate",
  downloadAppURL: "https://renosoftwares.com/apps/download/boiler-plate", //update with your app url
  applicationName: "boiler plate",
  appIdentifierForBackend: "/boiler-plate",
  appID: "com.renosoftwares.boilerplate", // update with your app id
  companyCode: "Company_Code", // update with your company code
  indexedDBName: "boiler-plate", // update with your app name
  indexedDBVersion: 1,

  appStoreLink: "",
  playStoreLink: "",
  ExternalIntegrations: {
    Google: {
      clientIdForWeb:
        "189252447120-j52to7iveehh7sjcqsb3d1erishap5bb.apps.googleusercontent.com",
      // clientIdForAndroid:
      //   "189252447120-jj8fearcufb9mbd91fdk2leprtebfvkk.apps.googleusercontent.com",
      clientIdfoiOS:
        "719831808823-r5uh237fc2d6f27pg6p4spq5pce8rfc5.apps.googleusercontent.com",
      scopes: ["profile", "email"],
    },
    RenoInformation: {
      showRenoAds: true,
      adShuffleTime: 5000,
      // accessToken: "",
      apiUrl: "",
      anyOtherProp: "",
      roletype: "5",
      userName: "boiler_plate_Automation_Admin",
      password: "boilerPlatePwd",
      privacyUrl:
        "https://renosoftwares.com/products/boiler-plate/privacypolicy",
      aboutUrl: "https://renosoftwares.com/products/boiler-plate",
    },
    GoogleAds: {
      showAds: true,
      showAdMobBannerAds: true,
      showRewardedVideoAd: true,
      showInterstitialAd: true,
      adMobRewardVideoId: "ca-app-pub-3940256099942544/5224354917",
      admobAppId: "ca-app-pub-3940256099942544~9257395921",
      admobBannerAdUnitId: "ca-app-pub-3940256099942544/9214589741",
      admobInterstitialAdID: "ca-app-pub-3940256099942544/1033173712",
    },
    OtherIntegrations: {
      props: "",
    },
  },
  LoggingInfo: {
    LogLocation: "Console,File,Api",
    ExceptionLocation: "Console,File,Api",
    cacheLogs: true,
    localLogFilePath: "boiler-plate.log",
  },
  encryptionKey: "12345678",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
