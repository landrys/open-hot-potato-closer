console.log('Loading event');
var closer = require('./openHotPotatoCloser');

exports.openHotPotatoes = function(event, context) {

    // Not using event info 
    console.log("Hello" + JSON.stringify(event, null, '  '));
    var store = event.store;
    closer.openHotPotatoCloser('Braintree');
    closer.openHotPotatoCloser('Boston');
    closer.openHotPotatoCloser('Natick');
    closer.openHotPotatoCloser('Newton');
    closer.openHotPotatoCloser('Norwood');
    closer.openHotPotatoCloser('Westboro');
    closer.openHotPotatoCloser('Worcester');

}
