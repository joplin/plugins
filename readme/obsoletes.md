# About obsolete plugins

Marking a plugin as obsolete means it will no longer show up in search results.

It is used for example to exclude:

- Plugins that no longer works;
- Test plugins that do not need to appear in search results;
- Plugins that are no longer maintained and may have too many bugs or security issues;
- Plugins that have been superseded by a different, better plugin.

## How to mark a plugin as obsolete

To mark a plugin as obsolete, please follow these steps:

- Find the plugin in `/manifests.json` in this repository.
- **Cut** the entire JSON block for this plugin (Make sure you actually delete that block, not just copy it)
- **Copy** it to `/manifestOverrides.json`.
- Add a new key `"_obsolete": true` to the JSON block.
- It's easy to forget a comma or a quote when manually editing JSON, and that would make the whole file invalid. So copy and paste `manifests.json` and `manifestOverrides.json` to https://jsonlint.com/ to ensure they are both valid.
- Create a pull request with the two modified files.

Once the pull request is merged, the plugin will be immediately removed from the application search results. In the future, users who have the plugin installed will also see a message to tell them that it's obsolete.
