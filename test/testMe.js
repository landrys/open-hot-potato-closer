var myMailer = require('js-common');

run();
/* 
 * Will check if any  open hot pototoes need to be closed 
 */
 function run() {

     emailIt('fpiergen@landrys.com', 'Updated to closed', 'Closed these entries: \n\n');

 };

function emailIt(to, subject, body) {
    myMailer.mailIt(to, subject, body);
};

