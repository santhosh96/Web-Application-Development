function get_source_request(url) {
    var xhr_fs = new XMLHttpRequest();
    var method = "GET";
    var s_url = url;
    
    console.log(s_url);

    xhr_fs.open(method, s_url, true);
    xhr_fs.onreadystatechange = function () {
        // In local files, status is 0 upon success in Mozilla Firefox
        if(xhr_fs.readyState === XMLHttpRequest.DONE) {
            var status = xhr_fs.status;
            if (status === 0 || (200 >= status && status < 400)) {
                // The request has been completed successfully
                display_source(JSON.parse(xhr_fs.response));
            } else {
                alert(xhr_fs.statusText);
            }
        }
    };
    
    try {
        xhr_fs.send();
    }
    
    catch (Exception) {
        alert(Exception);
    }
}

function fetch_source() {     
    category = document.getElementById("category").value;
    var language = 'en';
    var country = 'us';
    f_url = url + 'api/get_sources?category='+category+'&language='+language+'&country='+country
    get_source_request(f_url);
}

function display_source(source_data) {
    
    console.log(source_data);

    if (source_data.status === 'error') {
        var error_body = JSON.parse(news_data.content);
        alert(error_body.message);
        return false;
    }

    source_list = source_data.content;

    source_option = document.getElementById("source")
    source_option.options.length = 0;
    for (var i = 0; i < source_list.length; i++) {
        if (i == 0) 
            source_option[i] = new Option("all", "all", true);
        source_option[i+1] = new Option(Object.entries(source_list[i])[0][1], Object.entries(source_list[i])[0][0]);
    }
}