var xhr = new XMLHttpRequest();
var method = "GET";
var s_url = url+"api/get_top_headlines";

xhr.open(method, s_url, true);
xhr.onreadystatechange = function () {
    // In local files, status is 0 upon success in Mozilla Firefox
    if(xhr.readyState === XMLHttpRequest.DONE) {
        var status = xhr.status;
        if (status === 0 || (200 >= status && status < 400)) {
            // The request has been completed successfully
            console.log(JSON.parse(xhr.response));
            display_images(JSON.parse(xhr.response));
        } else {
            alert(xhr.statusText);
        }
    }
};

try {
    xhr.send();
}

catch (Exception) {
    alert(Exception);
}

function display_images(headline_dict) {
    
    if (headline_dict.status === 'error') {
        var error_body = JSON.parse(headline_dict.content);
        alert(error_body.message);
        return false;
    }
    
    var article_arr = headline_dict.content;
    
    html_text = "";
    var i;
    for (i = 0; i < article_arr.length; i++) {
        html_text += "<a href='" + article_arr[i].url + "' target='_blank'>";
            html_text += "<img src='"+ article_arr[i].urlToImage +"' class='slide-img'></img>"
            html_text += "<div class='caption'>"
                html_text += "<div class='title'><h4>"+ article_arr[i].title +"</h4></div>"
                html_text += "<div class='description'><p>" +article_arr[i].description+ "</p></div>"
            html_text += "</div>";
        html_text += "</a>";
    }
    document.getElementById("head-slide").innerHTML = html_text;

    display_slide();

}

var order = 0;

function display_slide() {
    var i;
    var cls = document.getElementsByClassName("slide-img");
    var caps = document.getElementsByClassName("caption");

    for (i = 0; i < cls.length; i++) {
        cls[i].style.display = "none";  
        caps[i].style.display = "none";
    }

    ++order;
    if (order > cls.length) 
        order = 1;
    
    cls[order-1].style.display = "block";
    caps[order - 1].style.display = "inline";  
    
    setTimeout(display_slide, 4000); // Change image every 2 seconds
}