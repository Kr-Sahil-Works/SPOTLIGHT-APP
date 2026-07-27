const fs = require('fs');
const path = require('path');
const { withAndroidManifest, withDangerousMod } = require('@expo/config-plugins');

// 1. Mod to copy physical image files to the Android build directory
function withDynamicIconAssets(config, { icons = {} } = {}) {
  return withDangerousMod(config, [
    "android",
    (config) => {
      const resPath = path.join(
        config.modRequest.platformProjectRoot,
        "app/src/main/res"
      );

      const mipmapFolders = [
        "mipmap-mdpi",
        "mipmap-hdpi",
        "mipmap-xhdpi",
        "mipmap-xxhdpi",
        "mipmap-xxxhdpi",
      ];

      for (const folder of mipmapFolders) {
        const mipmapPath = path.join(
          resPath,
          folder
        );

        if (!fs.existsSync(mipmapPath)) {
          fs.mkdirSync(mipmapPath, {
            recursive: true,
          });
        }

        for (const [
          iconName,
          iconConfig,
        ] of Object.entries(icons)) {
          if (!iconConfig.image)
            continue;

          const sourcePath =
            path.resolve(
              config.modRequest.projectRoot,
              iconConfig.image
            );

          const destPath =
            path.join(
              mipmapPath,
              `${iconName}.png`
            );

          if (
            fs.existsSync(sourcePath)
          ) {
            fs.copyFileSync(
              sourcePath,
              destPath
            );
          } else {
            console.warn(
              `[my-dynamic-icons] WARNING: Icon image not found: ${sourcePath}`
            );
          }
        }
      }

      return config;
    },
  ]);
}

// 2. Main Config Plugin
function withDynamicIcons(config, { icons = [] } = {}) {
  // Normalize icons to handle both legacy array format and new object format
  const isArray = Array.isArray(icons);
  const iconNames = isArray ? icons : Object.keys(icons);

  // Inject the AndroidManifest activity-alias tags
  config = withAndroidManifest(config, (config) => {
    const mainApplication = config.modResults.manifest.application[0];
    const mainActivity = mainApplication.activity.find(
      (a) => a['$']['android:name'] === '.MainActivity'
    );

    if (!mainActivity) {
      console.warn("Could not find .MainActivity in AndroidManifest.xml");
      return config;
    }

    // Ensure activity-alias array exists
    if (!mainApplication['activity-alias']) {
      mainApplication['activity-alias'] = [];
    }

    iconNames.forEach((iconName) => {
      const aliasName = `.MainActivity${iconName}`;
      
      // Check if alias already exists to avoid duplicates
      const exists = mainApplication['activity-alias'].find(
        (a) => a['$']['android:name'] === aliasName
      );

      if (!exists) {
        mainApplication['activity-alias'].push({
          '$': {
            'android:name': aliasName,
            'android:targetActivity': '.MainActivity',
            'android:enabled': 'false', // Default disabled, enabled via native code
            'android:exported': 'true',
            'android:icon': `@mipmap/${iconName}`,
            'android:roundIcon': `@mipmap/${iconName}`,
          },
          'intent-filter': [
            {
              action: [{ '$': { 'android:name': 'android.intent.action.MAIN' } }],
              category: [{ '$': { 'android:name': 'android.intent.category.LAUNCHER' } }],
            },
          ],
        });
      }
    });

    return config;
  });

  // If the user provided the object format { icons: { orange: { image: './assets/orange.png' } } }
  // we chain the dangerous mod to copy the images!
  if (!isArray) {
    config = withDynamicIconAssets(config, { icons });
  }
``
  return config;
}

module.exports = withDynamicIcons;
