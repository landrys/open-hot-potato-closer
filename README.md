# open-hot-potato-closer
Checks OpenHotPotato Dynamo table for closed hot potatoes and updates accordingly.

### Installation
PRIVACY
Need to include credentials to the mailer before deploying.

NPM

```sh
npm install
rm dist/*.zip
npm run build-aws-zip
#If have no function on AWS
npm run create-aws-function
#if created already
npm run update-aws-function
```
