/**
 * Created by arno.chauveau on 3/16/2016.
 */
(function menu(){

    var EventEmmiter = require('events');
    module.exports = new EventEmmiter();

    var menu = $('#menu');

    attachClickEvents();

    function attachClickEvents() {
        //menu.find('#explore_barco').on('click', onExploreBarcoClicked);
        menu.find('#registration').on('click', onRegistrationClicked);
    }
    function detachClickEvents() {
        menu.find('#explore_barco').off('click');
        menu.find('#registration').off('click');
    }

    function onExploreBarcoClicked() {
        module.exports.emit('exploreBarcoClicked');
        hideMenu();
    }
    function onRegistrationClicked() {
        module.exports.emit('registrationClicked');
        hideMenu();
    }
    function hideMenu(){
        menu.addClass('page_hidden');
    }
    function showMenu(){
        $('.container').addClass('container_hidden');
        detachClickEvents();
        menu.removeClass('page_hidden');
        menu.find('#registration').addClass('out');
        attachClickEvents();

    }
    module.exports.showMenu = showMenu;
})();