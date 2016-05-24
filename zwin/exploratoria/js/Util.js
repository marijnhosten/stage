/**
 * Created by arno.chauveau on 10/12/2015.
 */

var util = (function(){
    return {
        reloadWithQueryStringVars: function  (queryStringVars) {
        var existingQueryVars = location.search ? location.search.substring(1).split("&") : [],
            currentUrl = location.search ? location.href.replace(location.search,"") : location.href,
            newQueryVars = {},
            newUrl = currentUrl + "?";
        if(queryStringVars) {
            for (var queryStringVar in queryStringVars) {
                newQueryVars[queryStringVar] = queryStringVars[queryStringVar];
            }
        }
        if(newQueryVars) {
            for (var newQueryVar in newQueryVars) {
                newUrl += newQueryVar + "=" + newQueryVars[newQueryVar] + "&";
            }
            newUrl = newUrl.substring(0, newUrl.length-1);
            window.location.href = newUrl;
        } else {
            window.location.href = currentUrl;
        }
    },
        getQueryParameterByName: function(name){
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        },
        mapToRange : function (value, low1, high1, low2, high2) {
            return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
        },
        shuffleArray :function(array) {
            var m = array.length, t, i;
            while (m) {
                i = Math.floor(Math.random() * m--);
                t = array[m];
                array[m] = array[i];
                array[i] = t;
            }
            return array;
        }
    }
})();