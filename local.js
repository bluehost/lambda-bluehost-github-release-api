var {handler} = require('./index');

process.env.GITHUB_USER = 'bhwpteam';
process.env.GITHUB_TOKEN = '';

handler({
    queryStringParameters: {
        vendorName: 'bluehost',
        packageName: 'bluehost-wordpress-plugin',
        pluginBasename: 'bluehost-wordpress-plugin/bluehost.php'
    }
})
    .then(response => console.log(response))
    .catch(error => console.error(error));