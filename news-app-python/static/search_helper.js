// function for resetting the result area (where the cards are rendered) of the search result
function reset_content() {
    var content = document.getElementById("form-res"); 
    content.innerHTML = ""; 
    var show_more_button = document.getElementById("show-more");
    show_more_button.style.display = "none";
    var show_less_button = document.getElementById("show-less");
    show_less_button.style.display = "none";
}

// function for resetting the search form
function clear_form() {
    document.getElementById("search-form").reset();
}  

// function for displaying the news section when the news navigation is clicked
function news(obj) {
    news_status = document.getElementById(obj);
    search_status = document.getElementById("search-section");
    news_button = document.getElementById("news");
    search_button = document.getElementById("search");
    if (news_status.style.display === "none" || news_status.style.display === "") {
        news_status.style.display = "block";
        search_status.style.display = "none";
        news_button.classList.add("active");
        search_button.classList.remove("active");
    }
}

// function for displaying the search section when the search navigation is clicked
function search(obj) {
    search_status = document.getElementById(obj);
    news_status = document.getElementById("news-section");
    news_button = document.getElementById("news");
    search_button = document.getElementById("search");
    if (search_status.style.display === "none" || search_status.style.display === "") {
        search_status.style.display = "block";
        news_status.style.display = "none";
        search_button.classList.add("active");
        news_button.classList.remove("active");
    }
}

// function defining the action when show more button is clicked (if there are more than 5 articles rendered)
function show_more_news() {
    var search_card_arr = document.getElementById("form-res").querySelectorAll(".search-card");
    for (var i = 5; i < search_card_arr.length; i++) {
        search_card_arr[i].style.display = "block";
    }
    var show_more_button = document.getElementById("show-more");
    show_more_button.style.display = "none";
    var show_less_button = document.getElementById("show-less");
    show_less_button.style.display = "block";
} 

// function defining the action for show less button (hiding the extra cards rendered when show more is clicked)
function show_less_news() {
    var search_card_arr = document.getElementById("form-res").querySelectorAll(".search-card");
    var search_card_expanded_arr = document.getElementById("form-res").querySelectorAll(".search-card-expanded");
    for (var i = 5; i < search_card_arr.length; i++) {
        search_card_arr[i].style.display = "none";
        search_card_expanded_arr[i].style.display = "none";
    }
    var show_more_button = document.getElementById("show-more");
    show_more_button.style.display = "block";
    var show_less_button = document.getElementById("show-less");
    show_less_button.style.display = "none";
}

// function defining the action when a collapsed card (default view) is clicked and the detailed card is rendered
function expand_card(card_id) {
    var parent_card = document.getElementById(card_id);
    var child_card = document.getElementById(card_id+"-e");
    parent_card.style.display = "none";
    child_card.style.display = "block";
}

// function defining the action when a expanded card is clicked and collapsed card is rendered
function collapse_card(card_id) {
    var child_card = document.getElementById(card_id);
    var parent_card = document.getElementById(card_id.slice(0,-2));
    child_card.style.display = "none";
    parent_card.style.display = "block";
}

// function for setting the current date (as default) in the search form
function from_date_set() {
    var field = document.querySelector('#from');
    var date = new Date();
    date.setDate(date.getDate() - 7);
    // Set the date
    field.defaultValue = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) + 
        '-' + date.getDate().toString().padStart(2, 0);
}

// function for setting the to date (7 days after the from date)
function to_date_set() {
    var field = document.querySelector('#to');
    var date = new Date();
    date.setDate(date.getDate());
    // Set the date
    field.defaultValue = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) + 
        '-' + date.getDate().toString().padStart(2, 0);
}