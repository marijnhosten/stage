(function barcoApi() {

    var topicSelector = require('../exploreBarco/topicSelector.js');
    var onecampustotemclient = null, _assets = [], _extra = [];

    var start = function () {

        $.getScript('https://rna.barco.com:55522/clients/8b11cc54-4fbb-4da1-897a-813e9e767cc5/barco.onecampustotem.client.js').done(function () {
            onecampustotemclient = new x2o.Epoxy.oneCampusTotem.Client(new x2o.Epoxy());
            onecampustotemclient.connect('https://rna.barco.com:55522').done(function () {
            });

        });

        $.when(updateAssets()).then(function () {
            topicSelector.showData(_assets, _extra);
        });

        function updateAssets() {
            //https://rna.barco.com/XManagerWeb/Xynco/handlers/assets.ashx?method=selectmd&nid=101
            //./js/BarcoAPI/barcoData.json
            var done = $.Deferred();
            $.getJSON('/XManagerWeb/Xynco/handlers/assets.ashx?method=selectmd&nid=101')
                .done(function (assets) {
                    filter(assets);
                    done.resolve();
                })
                .fail(function () {
                    console.log('Failed to retrieve assets info');
                    done.reject();
                });
            return done.promise();
        }

        function filter(assets) {

            assets.forEach(function (item, index) {

                if ((item.Type === 'Image' || item.Type === 'Video') && item.Category.toLowerCase() === 'items'
                    && item.Name.toLowerCase().endsWith('_tn') &&
                    new Date(item.GoLive) <= new Date() && new Date(item.Expire) >= new Date()
                    && item.Status === 'Approved') {
                    _assets.push(item);

                } else if ((item.Type === 'Image' || item.Type === 'Video') && item.Name.toLowerCase().endsWith('_1')
                    && new Date(item.GoLive) <= new Date() && new Date(item.Expire) >= new Date() && item.Status === 'Approved') {
                    _extra.push(item);
                }
            });
        }

    };


    var connectTotem = function (jsonItem) {
        onecampustotemclient.showAsset(jsonItem);
    };


    module.exports.start = start;
    module.exports.connectTotem = connectTotem;
})();

