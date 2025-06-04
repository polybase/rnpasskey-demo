const fs = require('fs')
const path = require('path')
const {
  withDangerousMod,
  withAndroidManifest,
  withStringsXml,
} = require('@expo/config-plugins')

// === Top-level helpers ===
function escapeXml(str) {
  return str.replace(/"/g, '\\"')
}

const isDev =
  process.env.NODE_ENV !== 'production' ||
  process.env.EAS_BUILD_PROFILE === 'development'

const withAndroidAssetStatements = (config, props) => {
  const { site, packageName, sha256 } = props

  // Step 1: Add asset_statements.json to res/raw
  config = withDangerousMod(config, [
    'android',
    async (config) => {
      const rawDir = path.join(
        config.modRequest.platformProjectRoot,
        'app/src/main/res/raw'
      )

      fs.mkdirSync(rawDir, { recursive: true })

      const assetStatements = [
        {
          relation: ['delegate_permission/common.get_login_creds'],
          target: {
            namespace: 'web',
            site,
          },
        },
      ]

      fs.writeFileSync(
        path.join(rawDir, 'asset_statements.json'),
        JSON.stringify(assetStatements, null, 2)
      )

      return config
    },
  ])

  // Step 2: Inject meta-data into AndroidManifest.xml
  config = withAndroidManifest(config, (config) => {
    const application = config.modResults.manifest.application[0]
    const alreadyPresent = application['meta-data']?.some(
      (meta) => meta.$['android:name'] === 'asset_statements'
    )

    if (!alreadyPresent) {
      application['meta-data'] = application['meta-data'] || []
      application['meta-data'].push({
        $: {
          'android:name': 'asset_statements',
          'android:resource': '@string/asset_statements',
        },
      })
    }

    return config
  })

  // Step 3: Inject strings.xml
  config = withStringsXml(config, (config) => {
    const existing = config.modResults.resources.string || []

    const assetStatements = isDev
      ? JSON.stringify([
          {
            relation: ['delegate_permission/common.get_login_creds'],
            target: {
              namespace: 'android_app',
              package_name: packageName,
              sha256_cert_fingerprints: [sha256],
            },
          },
          {
            relation: ['delegate_permission/common.get_login_creds'],
            target: {
              namespace: 'web',
              site,
            },
          },
        ])
      : JSON.stringify([
          {
            include: `${site}/.well-known/assetlinks.json`,
          },
        ])

    const escapedJson = escapeXml(assetStatements)

    const alreadyExists = existing.find(
      (entry) => entry.$.name === 'asset_statements'
    )

    if (alreadyExists) {
      alreadyExists._ = escapedJson
    } else {
      existing.push({
        $: {
          name: 'asset_statements',
          translatable: 'false',
        },
        _: escapedJson,
      })
    }

    config.modResults.resources.string = existing
    return config
  })

  return config
}

module.exports = withAndroidAssetStatements
