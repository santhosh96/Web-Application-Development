var xhr_c_cnn = new XMLHttpRequest();
var method = "GET";
var s_url = url+"api/get_cnn_headlines";

xhr_c_cnn.open(method, s_url, true);
xhr_c_cnn.onreadystatechange = function () {
    // In local files, status is 0 upon success in Mozilla Firefox
    if(xhr_c_cnn.readyState === XMLHttpRequest.DONE) {
        var status = xhr_c_cnn.status;
        if (status === 0 || (200 >= status && status < 400)) {
            // The request has been completed successfully
            console.log(JSON.parse(xhr_c_cnn.response));
            display_cards_cnn(JSON.parse(xhr_c_cnn.response));
        } else {
            alert(xhr_c_cnn.statusText);
        }
    }
};

try {
    xhr_c_cnn.send();
}

catch (Exception) {
    alert(Exception);
}

function display_cards_cnn(headline_dict) {

    if (headline_dict.status === 'error') {
        var error_body = JSON.parse(headline_dict.content);
        alert(error_body.message);
        return false;
    }

    var article_arr = headline_dict.content;

    html_text = "";
    var i;
    for (i = 0; i < article_arr.length; i++) {

        html_text += "<a href='" + article_arr[i].url + "' class='news-card' target='_blank'>";
            html_text += "<img src='"+ article_arr[i].urlToImage +"' class='card-img'></img>";
            html_text += "<div class='card-content'>";
                html_text += "<div class='card-title'><h5>"+ article_arr[i].title +"</h5></div>";
                html_text += "<div class='card-description'><p>" +article_arr[i].description+ "</p></div>";
            html_text += "</div>";
        html_text += "</a>";
    }
    
    document.getElementById("cnn-head-row").innerHTML = html_text;

}