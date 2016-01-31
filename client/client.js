if (window.location.protocol != "https:" &&  window.location.href.indexOf('localhost')==-1)
    window.location.href = "https:" + window.location.href.substring(window.location.protocol.length);

$(document).ready(function(){ $.cookieBar(); });


