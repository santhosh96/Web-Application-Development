function get_result_request(url, post_data) {
    request_str = "";
    for (let [key, value] of Object.entries(post_data)) {
        request_str += key + "=" + value + "&"
    }
    request_str = request_str.slice(0, -1);
    
    var xhr_fr = new XMLHttpRequest();
    var method = "GET";
    var s_url = url+'?'+request_str;
    
    console.log(s_url);

    xhr_fr.open(method, s_url, true);
    xhr_fr.onreadystatechange = function () {
        // In local files, status is 0 upon success in Mozilla Firefox
        if(xhr_fr.readyState === XMLHttpRequest.DONE) {
            var status = xhr_fr.status;
            if (status === 0 || (200 >= status && status < 400)) {
                // The request has been completed successfully
                show_search_cards(JSON.parse(xhr_fr.response));
                console.log(JSON.parse(xhr_fr.response));
            } else {
                alert(xhr_fr.statusText);
            }
        }
    };
    
    try {
        xhr_fr.send();
    }
    
    catch (Exception) {
        alert(Exception);
    }
}

function fetch_result() {
                
    var keyword = document.getElementById("keyword").value;
    var from_dt = document.getElementById("from").value;
    var to_dt = document.getElementById("to").value;
    var source = document.getElementById("source").value;
    
    var date_from = new Date(from_dt);
    var date_to = new Date(to_dt)
    
    if (date_from > date_to) {
        alert("Incorrect time");
        return false;
    }
    
    else if (keyword == "") 
        return false;
    
    else {
        var url_text = "api/get_result";
        var fetch_parameter = {
            "keyword" : keyword,
            "from_dt" : from_dt,
            "to_dt" : to_dt,
            "source" : source
        }   
        get_result_request(url+url_text, fetch_parameter);
    }
}

function show_search_cards(search_res) {

    if (search_res.status === 'error') {
        var error_body = JSON.parse(search_res.content);
        alert(error_body.message);
        return false;
    }
    
    else if (search_res.status === 'success' && search_res.content.length == 0) {
        reset_content();
        var para = document.createElement("p");
        para.style.textAlign = "center";
        var node = document.createTextNode("No results");
        para.appendChild(node);
        var element = document.getElementById("form-res");
        element.appendChild(para);
    }
    
    else {
        var show_more_button = document.getElementById("show-more");
        show_more_button.style.display = "none";
        var show_less_button = document.getElementById("show-less");
        show_less_button.style.display = "none";
        display_search_cards(search_res.content);
    }
}

function display_search_cards(search_res){

    html_text = "";
    for (var i = 0; i < search_res.length; i++) {
        
        var parent_card_id = "sc-"+i;
        var child_card_id = "sc-"+i+"-e";

        if (i == 0)
            html_text += "<div class='search-card' id='"+parent_card_id+"' style='display: block; margin-top:8px;' onclick='expand_card("+"\""+parent_card_id+"\""+")'>";
        else if (i < 5)
            html_text += "<div class='search-card' id='"+parent_card_id+"' style='display: block; margin-top:8px;' onclick='expand_card("+"\""+parent_card_id+"\""+")'>";
        else 
            html_text += "<div class='search-card' id='"+parent_card_id+"' style='display: none; margin-top:8px;' onclick='expand_card("+"\""+parent_card_id+"\""+")'>";
                
                html_text += "<div class='search-card-img'>";
                    html_text += "<img src="+search_res[i].urlToImage+" id='search-card-img'>";
                html_text += "</div>";
                
                html_text += "<ul class='search-text-content'>";
                    html_text += "<li id='list-data' class='search-text-title'>";
                        html_text += search_res[i].title;
                    html_text += "</li>";

                    html_text += "<li id='list-data' class='search-text-body'>";
                        html_text += search_res[i].description;
                    html_text == "<li>";
                html_text += "</ul>";

            html_text += "</div>";
			
			html_text += "<div id="+child_card_id+" class='search-card-expanded' style='display: none; margin-top: 8px;'>";
				html_text += "<button class='close' onclick='collapse_card("+"\""+child_card_id+"\""+")'>";
					html_text += "<span class='close-label'>&#10005;</span>";
				html_text += "</button>";

				html_text += "<div class='search-card-img'>";
					html_text += "<img src="+search_res[i].urlToImage+" id='search-card-img'>";
				html_text += "</div>";

				html_text += "<ul class='search-text-content-expanded'>";
					html_text += "<li id='list-data' class='search-text-title-expanded'>";
						html_text += search_res[i].title;
					html_text += "</li>";
					html_text += "<li id='list-data' class='search-text-body-expanded'>";
						html_text += '<span style="font-weight: bold;">Author: </span>'+search_res[i].author; 
					html_text += "</li>";
					html_text += "<li id='list-data' class='search-text-body-expanded'>";
						html_text += '<span style="font-weight: bold;">Source: </span>'+search_res[i].name;
					html_text += "</li>";
					html_text += "<li id='list-data' class='search-text-body-expanded'>";
						html_text += '<span style="font-weight: bold;">Date: </span>'+search_res[i].publishedAt;
					html_text += "</li>";
					html_text += "<li id='list-data' class='search-text-body-expanded'>";
						html_text += search_res[i].description;
					html_text += "</li>";
					html_text += "<li id='list-data' class='search-text-body-expanded'>";
						html_text += "<a class='source-link' href='"+search_res[i].url+"' target='_blank'>See Original Post</a>";
					html_text += "</li>";
				html_text += "</ul>";
			html_text += "</div>";
    }

    var show_more_button = document.getElementById("show-more");

    if (search_res.length > 5)
        show_more_button.style.display = "block";
    else
        show_more_button.style.display = "none";


    var search_div = document.getElementById("form-res");
    search_div.innerHTML = html_text;
}