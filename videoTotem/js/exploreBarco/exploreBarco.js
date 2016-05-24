/**
 * Created by arno.chauveau on 3/16/2016.
 */
(function exploreBarco() {
    var topicSelector = require('./topicSelector');

    function start() {
        $('#exploreBarcoContainer').removeClass('container_hidden');
        topicSelector.start();
    }

    module.exports.start = start;

})();