var xhr_w = new XMLHttpRequest();
var method = "GET";
var s_url = url + "api/get_word_cloud";

xhr_w.open(method, s_url, true);
xhr_w.onreadystatechange = function () {
	// In local files, status is 0 upon success in Mozilla Firefox
	if (xhr_w.readyState === XMLHttpRequest.DONE) {
		var status = xhr_w.status;
		if (status === 0 || (200 >= status && status < 400)) {
			// The request has been completed successfully
			create_word_cloud(JSON.parse(xhr_w.response));
		} else {
			alert(xhr_w.statusText);
		}
	}
};

try {
	xhr_w.send();
} catch (Exception) {
	alert(Exception);
}

var svg, layout;

function create_word_cloud(word_data) {
	if (word_data.status === "error") {
		var error_body = JSON.parse(word_data.content);
		alert(error_body.message);
		return false;
	}

	word_list = word_data.content;

	console.log(word_list);

	var margin = {
			top: 2.5,
			right: 2.5,
			bottom: 2.5,
			left: 2.5,
		},
		width = 263 - margin.left - margin.right,
		height = 225 - margin.top - margin.bottom;

	// svg variable, setting the canvas area for displaying the word cloud
	svg = d3
		.select("#cloud_viz")
		.style("background-color", "#eee")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
	// Wordcloud features that are different from one word to the other must be here
	layout = d3.layout
		.cloud()
		.size([width, height])
		.words(
			word_list.map(function (d) {
				return {
					text: d.word,
					size: d.size,
				};
			})
		)
		.padding(4) //space between words
		.rotate(function () {
			return ~~(Math.random() * 2) * 90;
		})
		.fontSize(function (d) {
			if (d.size > 30) return 30;
			if (d.size < 5) return d.size * 5;
			else if (d.size < 10 && d.size >= 5) return d.size * 3;
			else if (d.size < 20 && d.size >= 10) return d.size * 1.5;
			return d.size;
		}) // font size of words
		.on("end", draw);
	layout.start();
}

// This function takes the output of 'layout' above and draw the words
// Wordcloud features that are THE SAME from one word to the other can be here
function draw(words) {
	svg.append("g")
		.attr(
			"transform",
			"translate(" +
				layout.size()[0] / 2 +
				"," +
				layout.size()[1] / 2 +
				")"
		)
		.selectAll("text")
		.data(words)
		.enter()
		.append("text")
		.style("font-size", function (d) {
			return d.size + "px";
		})
		.style("fill", "black")
		.attr("text-anchor", "middle")
		.style("font-family", "Impact")
		.attr("transform", function (d) {
			return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
		})
		.text(function (d) {
			return d.text;
		});
}
