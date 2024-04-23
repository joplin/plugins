# Default manifest properties

It's possible change default property values for different plugin manifests using `manifestDefaults.json`. This allows setting a manifest property until it is overriden by the plugin author.

## Marking a plugin as supporting only a single platform

If a plugin author hasn't set the `platforms` field on a plugin, a default value for this field can be set using `manifestDefaults.json`. This value will apply until a new version of the plugin is published that includes a `platforms` key in its manifest.

For example, to mark `joplin.plugin.benji.favorites` as desktop-only,
1. Add a new entry in `manifestDefaults.json`:
   ```json
   ...
   "joplin.plugin.benji.favorites": {
      "platforms": ["desktop"]
   }
   ...
   ```
2. To apply the change immediately, rather than waiting for the repository update script to update a plugin, also add `"platforms": ["desktop"]` to the plugin's manifest in `"manifests.json"`.
