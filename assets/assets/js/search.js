jQuery('#search-home-page, #search-page-form').submit(function(e) {
    e.preventDefault();
    var data = jQuery(this).serializeArray();
    var objData = {
        cat: []
    };
    for (var i =0; i < data.length; i++) {
        if (data[i].name == 'cat') {
            objData.cat.push(data[i].value);
        } else if (data[i].value) {
            objData[data[i].name] = data[i].value;
        }
    }

    if (!objData.cat.length) {
        delete objData.cat;
    } else {
        objData.cat = objData.cat.join('-');
    }

    window.location = rootURL+'jobs?' + jQuery.param(objData);
});