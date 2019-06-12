'use strict';

const NPS_API_KEY = "86cNbVBVGi2tT4Qbqoh3IMraTbMhEfk7hnxtrOCs";
const PARK_SEARCH_URL = "https://developer.nps.gov/api/v1/parks";

function displayResults(responseJson) {
    console.log(responseJson);

    $('.search-header').empty();
    $('.search-header').append("Search Results");
    $('.park-list').empty();

    if (responseJson.total == 0) {
        $('.park-list').append("<li>No results</li>");
        return;
    }

    for (let i=0; i< responseJson.data.length; i++) {

        // opening tag
        let listItem = "<li>";

        // Full Name
        listItem += `<h2 class="park-name">${responseJson.data[i].fullName}</h2>`;

        // Website

        listItem += `<a class="park-url" href="${responseJson.data[i].url}">${responseJson.data[i].url}</a>`;

        // Address 

        listItem += `<p class="address">${responseJson.data[i].addresses[0].line1}</p>`;
        listItem += `<p class="address">${responseJson.data[i].addresses[0].line2}</p>`;
        listItem += `<p class="address">${responseJson.data[i].addresses[0].city}, `+
            `${responseJson.data[i].addresses[0].stateCode} ${responseJson.data[i].addresses[0].postalCode}</p>`;

        // Description

        listItem += `<p class="park-desc">${responseJson.data[i].description}</p>`;

        // end tag

        listItem  += "</li>"

        $('.park-list').append(listItem);
    }
}

function buildSearchURL() {

    let url = PARK_SEARCH_URL + "?";

    // add the api key

    url += `api_key=${NPS_API_KEY}`;

    // add the state list

    url += "&stateCode=";
    url += encodeURIComponent($('#state-list').val());

    // add the limit
    // WEIRD ALERT! - The search limit is 0 based so subtract 1

    url += "&limit=";
    url += $('#search-limit').val() - 1;

    // we want the response to include the addresses field

    url += "&fields=addresses";

    return url;
}

function handleStateList() {
    
    $('form').submit(e => {

        e.preventDefault();

        // build the options object with headers

/*        let options = buildHeader();
        for (let i of options.headers.values())
            console.log(i); */

        // build the url

        let url = buildSearchURL();

        fetch(url)
            .then(response => {
                if (response.ok)
                    return response.json();
                throw new Error(response.statusText);
            })
            .then (responseJson => displayResults(responseJson))
            .catch (err => {
                $('.search-results').empty();
                $('.park-list').empty();
                $('.park-list').append(`<li>${err}</li>`);
            });


    });
}

$(handleStateList);