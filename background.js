var callback = function(details) {

 // Check though all the response headers
    for (var i = 0; i < details.responseHeaders.length; i++) {
      var header = details.responseHeaders[i];
      if (header.name.toLowerCase() == 'content-security-policy') {
        // Individual policies are separated with ;
        var policies = header.value.split(';');
        for (var j = 0; j < policies.length; j++) {
          // Terms of the policy are separated with spaces
          var terms = policies[j].trim().split(' ');
          // Add the MathJax CDN to script-src and font-src
          if (terms[0].trim().toLowerCase() == 'script-src') {
            terms.push('https://cdnjs.cloudflare.com');
          }
          else if (terms[0].trim().toLowerCase() == 'font-src') {
            terms.push('https://cdnjs.cloudflare.com');
          }
          policies[j] = terms.join(' ');
        }
        header.value = policies.join('; ');
        return {responseHeaders: details.responseHeaders};
      }
    }
} ;


var filter = {
  urls: ["*://*/*"],
  types: ["main_frame", "sub_frame"]
};

chrome.webRequest.onHeadersReceived.addListener(callback, filter, ["blocking", "responseHeaders"]);

