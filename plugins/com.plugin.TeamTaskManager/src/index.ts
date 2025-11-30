import joplin from 'api';
import * as path from 'path';
import * as fs from 'fs';

joplin.plugins.register({
    onStart: async function () {

        const panel = await joplin.views.panels.create('myHtmlPanel');

        // Full path to your plugin installation folder
        const pluginDir = await joplin.plugins.installationDir();

        // Path to panel.html inside your plugin
        const htmlPath = path.join(pluginDir, 'ui', 'panel.html');

        // Read the HTML file as text
        const html = fs.readFileSync(htmlPath, 'utf8');

        // Set HTML into the panel
        await joplin.views.panels.setHtml(panel, html);
		await joplin.views.panels.addScript(panel, './ui/script.js');
// await joplin.views.panels.addScript(panel, path.join(pluginDir, 'ui/script.js'));

        console.info("My HTML plugin loaded!");
    },
});
