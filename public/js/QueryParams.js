function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
        	// regex to replace + with space BEFORE decoding
            return decodeURIComponent(pair[1].replace(/\+/g, " "));
        }
    }
    
    return undefined;
}