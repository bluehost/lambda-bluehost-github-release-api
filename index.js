const fetch = require('node-fetch');

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
    'Text Domain',
    'Version'
];

exports.handler = async function (event, context, callback) {

    let response;
    let vendorName = event.queryStringParameters.vendorName;
    let packageName = event.queryStringParameters.packageName;
    let pluginBasename = decodeURIComponent(event.queryStringParameters.pluginBasename);
    let [pluginSlug, pluginFile] = pluginBasename.split('/');

    const errorResponse = {
        "statusCode": 500,
        "headers": {},
        "body": "",
        "isBase64Encoded": false
    };

    response = await fetch(
        `https://api.github.com/repos/${vendorName}/${packageName}/releases/latest`,
        {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${process.env.GITHUB_USER}:${process.env.GITHUB_TOKEN}`).toString('base64')
            }
        }
    );
    if (response.status !== 200) {
        errorResponse.body = JSON.stringify(await response.json());
        return errorResponse;
    }
    let release = await response.json();

    response = await fetch(`https://raw.githubusercontent.com/${vendorName}/${packageName}/${release.tag_name}/${pluginFile}`);
    if (response.status !== 200) {
        if (response.status !== 200) {
            errorResponse.body = JSON.stringify(await response.json());
            return errorResponse;
        }
    }
    let fileContents = await response.text();

    const pluginHeaders = {};

    headers.forEach((header) => {
        let regex = new RegExp(header + ':(.*)', 'gm');
        let matches = regex.exec(fileContents);
        if (matches && matches.hasOwnProperty(1)) {
            pluginHeaders[header] = matches[1].trim();
        }
    });

    response = {
        'last_updated': release.published_at || '',
        'new_version': pluginHeaders['Version'] || '',
        'package': release.assets[0].browser_download_url || '',
        'plugin': pluginBasename || '',
        'requires_php': pluginHeaders['Requires PHP'] || '',
        'slug': pluginSlug || '',
        'tested': pluginHeaders['Requires at least'] || '',
        'url': pluginHeaders['Plugin URI'] || '',
    };

    return {
        "statusCode": 200,
        "headers": {},
        "body": JSON.stringify(response),
        "isBase64Encoded": false
    };

};