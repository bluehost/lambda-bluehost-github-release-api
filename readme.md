# AWS Lambda - Bluehost GitHub Release API

![Deploy to Lambda](https://github.com/bluehost/lambda-bluehost-github-release-api/workflows/Deploy%20to%20Lambda/badge.svg)

An AWS Lambda function that pulls information from GitHub about tagged releases to facilitate the update of WordPress plugins.

## Usage

Replace the placeholder values below and visit the URL:

```
https://bluehost-wp-release.com/v1/?vendorName=:vendorName&packageName=:packageName&pluginBasename=:pluginBasename
```

For example, to fetch the latest release data for the Bluehost WordPress Plugin:

```
https://bluehost-wp-release.com/v1/?vendorName=bluehost&packageName=bluehost-wordpress-plugin&pluginBasename=bluehost-wordpress-plugin/bluehost-wordpress-plugin.php
```

## Install

- Run `npm install`

## Local Testing

- Run `node local.js`

## Deployment

By default, this repository is setup to auto-deploy when a new commit is made.

However, if you wish to push changes from your local machine while testing, you can simply run the `npm run deploy` command. 

In order for local deployments to actually work, you will need to:

- Install the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) tool.
- Create a [named profile](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html) named `bluehost`. 
