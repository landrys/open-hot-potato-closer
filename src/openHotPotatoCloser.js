var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var docClient = new AWS.DynamoDB.DocumentClient();

var jsJoda = require('js-joda').use(require('js-joda-timezone'));
var LocalDateTime = jsJoda.LocalDateTime;
var ZonedDateTime = jsJoda.ZonedDateTime;
var ZoneId = jsJoda.ZoneId;
var Duration = jsJoda.Duration;

var myMailer = require('js-common'); 

/* 
 * Will check if any  open hot pototoes need to be closed 
 * change
 */
module.exports.openHotPotatoCloser = function(store) {

	let params = {
		ExpressionAttributeValues: {
			':s': {S:store}
		},
		KeyConditionExpression: 'sstore = :s',
		FilterExpression: 'attribute_not_exists(closed)',
		TableName: 'OpenHotPotato'
	};

	dynamodb.query(params, function(err, data) {
		var hpsToClose = [];
		if (err) { 
			console.log(err, err.stack) // an error occurred
		} else { 

			/*
			 * Need to check if hours old is less than hours elapsed from created date to now
			 * if so update it to closed with now.
			 *
			 * Do this for each store every hour on the 55 minute.
                         *
			 */

			data.Items.forEach(function(element) {
				if ( needToClose(element.created.S, element.hours.N, element.id.N)  )
					hpsToClose.push(element);
			});

			hpsToClose.forEach(function(element) {
				console.log("Close: " + JSON.stringify(element.id.N));
                                closeIt(element);
			});

                        if (hpsToClose.length > 0)
                            emailIt('fpiergen@landrys.com', 'Updated to closed', 'Closed these entries: \n\n' + JSON.stringify(hpsToClose));
		}
	});

};

function closeIt(element) {
    var now = ZonedDateTime.now(ZoneId.of('America/New_York'));
    var store = element.sstore.S;
    var id = element.id.N;
    var params = {
        TableName: 'OpenHotPotato',
        Key: {
            "sstore": store,
            "id": Number(id) 
        },
        UpdateExpression: "set closed = :cl",
        ExpressionAttributeValues: {
            ":cl": now.toString()
        },
        ReturnValues: "UPDATED_NEW"
    };

    docClient.update(params, function(err, data) {
        if (err) {
            console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
        }
    });
}


function emailIt(to, subject, body) {
    myMailer.mailIt(to, subject, body);
}

function needToClose(created, hours, id) {

    created = created.replace(" ", "T");

    // Put in the same timezone
    var then = LocalDateTime
        .parse(created)
        .atZone(ZoneId.of('America/New_York'));
    var now = ZonedDateTime.now(ZoneId.of('America/New_York'));

    var d = Duration.between(then, now);
    var diffMinCreatedToNow = (d._seconds / 60);
    var diffMinFromHours = hours * 60;

    // Hours are incremented for every check of open HP every hour
    // If the time difference from when the HP was created to now is
    // greater than the hours then it is no longer open and we need to close it
    if (diffMinCreatedToNow > diffMinFromHours) {
        return true;
    } else {
        return false;
    }
}
