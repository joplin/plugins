# Blocking a compromised plugin

Blocking disables a plugin version known to be malicious, for example after a plugin author's npm account has been hijacked. Blocked versions are disabled on users' devices (desktop restarts the app if the plugin is running) and can no longer be installed or updated to.

## How to block a plugin version

Add `_blocked_versions` to the plugin's entry in `/manifestOverrides.json`:

```json
"com.example.SomePlugin": {
	"_blocked_versions": [">=1.2.3"]
}
```

Each item can be `"*"`, an exact version such as `"1.2.3"`, or a semver range such as `">=1.2.3"`. Running apps pick up the block within about an hour.

While the author's account may still be compromised, use a range like `">=1.2.3"` so that any further version the attacker publishes is blocked too. Once a clean version is out, narrow it down to the bad versions, e.g. `["1.2.3", "1.2.4"]`. Never remove the entry, as that would re-enable the bad versions where they're still installed.
