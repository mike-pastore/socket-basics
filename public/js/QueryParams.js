function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
        	// regex to replace + with space BEFORE decoding
            var result = decodeURIComponent(pair[1].replace(/\+/g, " "));
            // regex to strip script tags
            // result = result.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi);
            
            // BETTER mentioned by George: rebuild DOM, remove script tags
            return $.parseHTML(result);
        }
    }
    
    return undefined;
}