const {execSync} = require('child_process');
const fs = require('fs');
const path = require('path');

const lambda = path.basename(__dirname);

if (fs.existsSync(`./${lambda}.zip`)) {
    fs.unlinkSync(`${lambda}.zip`);
}

execSync(`zip -r ${lambda}.zip .`);
execSync(`aws lambda update-function-code --function-name ${lambda} --zip-file fileb://${lambda}.zip --profile bluehost`);