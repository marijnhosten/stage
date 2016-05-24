/**
 * Created by arno.chauveau on 2/15/2016.
 */
 var _userData = [
    {
        "id": 3,
        "unique_tag": "0108f8c9b6",
        "project_id": 4,
        "visitor_personal_information_id": 2,
        "time_in": "2016-01-21T00:00:00+0000",
        "time_out": "2016-01-21T00:00:00+0000",
        "parameter1": null,
        "parameter2": null,
        "visitor_personal_information": {
            "id": 2,
            "name": "Alain Van Damme",
            "email": null,
            "age": 24,
            "nationality": "BE",
            "language_id": 4,
            "language": {
                "id": 4,
                "code": "NL",
                "name": "Nederlands"
            }
        }
    },
    {
        "id": "0108f8c9b6",
        "visitor_id": 3,
        "bird_id": 3,
        "timestamp": "2016-01-12T07:56:13+0000",
        "bird": {
            "id": 9,
            "nameNL": "Kluut",
            "nameFR": null,
            "nameEN": null,
            "nameDE": null,
            "textNL": "",
            "textFR": null,
            "textEN": null,
            "textDE": null,
            "video": null,
            "image": null,
            "date_in": null,
            "date_out": null
        }
    }
];
var $screenSaver = $('.screensaver');
$screenSaver.off('click').on('click',function(){ onLoginCompleteHandler(_userData)});

function onGameOver() {


    $('.page').not('.screensaver').addClass('hidden');
    $('.hide').addClass('hidden');
    $('.menu').addClass('hidden');
    stopGlobalTimeOut();

    totalReset();
}