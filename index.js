const fetch = require('node-fetch');
const {getPluginHeaders, getResponse} = require('./functions');

exports.handler = async function (event, context, callback) {

	let release, response;

	// Get data from request
	let vendorName = event.queryStringParameters.vendorName;
	let packageName = event.queryStringParameters.packageName;
	let pluginBasename = decodeURIComponent(event.queryStringParameters.pluginBasename);
	let [pluginSlug, pluginFile] = pluginBasename.split('/');

	// Fetch releases
	response = await fetch(
		`https://api.github.com/repos/${ vendorName }/${ packageName }/releases`,
		{
			method: 'GET',
			headers: {
				'Authorization': 'Basic ' + Buffer.from(`${ process.env.GITHUB_USER }:${ process.env.GITHUB_TOKEN }`).toString('base64')
			}
		}
	);

	// Proxy error response
	if (response.status !== 200) {
		return getResponse({
			statusCode: response.status,
			body: await response.json(),
		});
	}

	let releases = await response.json();

	// Return 404 if a release isn't found
	if (!releases || !Array.isArray(releases)) {
		return getResponse({
			statusCode: 404,
			body: 'No releases available!',
		});
	}

	for (release of releases) {
		if (release.assets.length) {
			// Skip over releases without release assets.
			break;
		}
	}

	// Return 404 if no release asset is found.
	if (!release.assets.length) {
		return getResponse({
			statusCode: 404,
			body: 'No release asset found!',
		});
	}

	// Get plugin file
	response = await fetch(`https://raw.githubusercontent.com/${ vendorName }/${ packageName }/${ release.tag_name }/${ pluginFile }`);

	// Unable to read plugin file
	if (response.status !== 200) {
		return getResponse({
			statusCode: 500,
			body: 'Unable to fetch plugin file!',
		});
	}

	// Get plugin headers
	const pluginHeaders = getPluginHeaders(await response.text());

	// Return response
	return getResponse({
		body: {
			'last_updated': release.published_at || '',
			'new_version': pluginHeaders['Version'] || '',
			'package': release.assets[0].browser_download_url,
			'plugin': pluginBasename || '',
			'requires_php': pluginHeaders['Requires PHP'] || '',
			'requires_wp': pluginHeaders['Requires at least'] || '',
			'slug': pluginSlug || '',
			'tested': pluginHeaders['Tested up to'] || '',
			'url': pluginHeaders['Plugin URI'] || '',
		}
	})

}
