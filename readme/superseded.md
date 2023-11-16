# About superseded NPM packages

Marking an NPM package as superseded means that it will no longer be used as an update source for plugins.

It can be used to change the NPM package that provides updates to a plugin.

## Changing the NPM package for a plugin

To change the update source for a plugin from one NPM package to another:
1. Add `"_superseded_package": "old_package_name_here"` to the plugin's section of `manifestOverrides.json`.
2. Change the `"_npm_package_name"` of the plugin to the new package name in `manifests.json`.

[A sample pull request that does this can be found here.](https://github.com/joplin/plugins/pull/13/files)

**Explanation**:

Changing `"_npm_package_name"` in `manifest.json` is the important part. It causes the plugin updater to check the new NPM package for updates, rather than the old.

Setting `"_superseded_package": "outdated_package"` in `manifestOverrides.json` causes `outdated_package` to be ignored as a source of plugin updates. While not required, it prevents warnings and provides a record of the change in maintenance.

