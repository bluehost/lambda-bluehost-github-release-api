/**
 * Get response object.
 *
 * @param {number} statusCode
 * @param {object}headers
 * @param {*} body
 * @param {boolean} isBase64Encoded
 * @returns {{headers: {}, isBase64Encoded: boolean, body: string, statusCode: number}}
 */
function getResponse(
	{
		statusCode = 200,
		headers = {
			'Content-Type': 'application/json',
		},
		body = '',
		isBase64Encoded = false
	}
) {
	return {
		statusCode,
		headers,
		body: JSON.stringify(body),
		isBase64Encoded,
	}
}

/**
 * Get plugin headers.
 *
 * @param {string} fileContents
 * @returns {{}}
 */
function getPluginHeaders(fileContents) {

	const headers = [
		'Author',
		'Author URI',
		'Description',
		'Domain Path',
		'License',
		'License URI',
		'Plugin Name',
		'Plugin URI',
		'Requires at least',
		'Requires PHP',
		'Tested up to',
		'Text Domain',
		'Version'
	];

	const pluginHeaders = {};

	headers.forEach((header) => {
		let regex = new RegExp(header + ':(.*)', 'gm');
		let matches = regex.exec(fileContents);
		if (matches && matches.hasOwnProperty(1)) {
			pluginHeaders[header] = matches[1].trim();
		}
	});

	return pluginHeaders;
}

module.exports = {
	getPluginHeaders,
	getResponse,
}
