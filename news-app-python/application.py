from flask import Flask, request, jsonify
from newsapi import NewsApiClient
from collections import Counter
import json

application = Flask(__name__)

newsapi = NewsApiClient(api_key='25b752081b804f05a3793450a93ab0c6')

# api route for fetching top headlines
@application.route("/api/get_top_headlines", methods=['GET'])
def get_top_headlines():
	
	req_keys = ['title', 'description', 'url', 'urlToImage']
	
	try:
		news = newsapi.get_top_headlines(language='en')
		news = get_top_n(news, req_keys, 5)
		result = {
			"status": "success",
			"content": news
		}
		return jsonify(result)

	except Exception as e:
		exception = str(e).replace("\'","\"") 
		result = {
			"status": "error",
			"content": exception
		}
		return jsonify(result)


# api route for fetching cnn headlines
@application.route("/api/get_cnn_headlines", methods=['GET'])
def get_cnn_headlines():

	req_keys = ['title', 'description', 'url', 'urlToImage']
	
	try:
		news = newsapi.get_top_headlines(sources='cnn')
		news = get_top_n(news, req_keys, 4)
		result = {
			"status": "success",
			"content": news
		}
		# print(result)
		return jsonify(result)

	except Exception as e:
		exception = str(e).replace("\'","\"") 
		result = {
			"status": "error",
			"content": exception
		}
		return jsonify(result)


# api route for fetching fox-news headlines
@application.route("/api/get_fox_headlines", methods=['GET'])
def get_fox_headlines():
	
	req_keys = ['title', 'description', 'url', 'urlToImage']
	
	try:
		news = newsapi.get_top_headlines(sources='fox-news')
		news = get_top_n(news, req_keys, 4)
		result = {
			"status": "success",
			"content": news
		}
		# print(result)
		return jsonify(result)
	
	except Exception as e:
		exception = str(e).replace("\'","\"")   
		result = {
			"status": "error",
			"content": exception
		}
		return jsonify(result)


# api route for fetching news articles based on keyword, from date, to date, categroy and source, maximum 15
@application.route("/api/get_result", methods=['GET'])
def get_result():
	
	query_param = request.args

	keyword = query_param.get('keyword')
	from_dt = query_param.get('from_dt')
	to_dt = query_param.get('to_dt')
	source = query_param.get('source')
	
	req_keys = ['author', 'title', 'description', 'url', 'urlToImage', 'publishedAt', 'name']
	
	try:
		if source == 'all':
			news = newsapi.get_everything(q=keyword, from_param=from_dt ,to=to_dt, language='en', page_size=30, sort_by='publishedAt')
		else:
			news = newsapi.get_everything(q=keyword, sources=source, from_param=from_dt ,to=to_dt, language='en', page_size=30, sort_by='publishedAt')

		news = get_top_n(news, req_keys, 15)

		result = {
			"status": "success",
			"content": news
		}

		return jsonify(result)
	
	except Exception as e:
		exception = str(e).replace("\'","\"")
		
		result = {
			"status": "error",
			"content": exception
		}

		return jsonify(result)


# api route for fetching sources of news based on category, language and country
@application.route("/api/get_sources", methods=['GET'])
def get_sources():
	
	query_param = request.args

	category = query_param.get('category')
	country = query_param.get('country')
	language = query_param.get('language')

	data = []
	count = 0

	try:

		if category == 'all':
			source_list = newsapi.get_sources(language=language,
											country=country)['sources']
		else:
			source_list = newsapi.get_sources(category=category, language=language,
											country=country)['sources']

		for source in source_list:
			if count == 10:
				break
			if source['name'] != '':
				data.append({source['id']:source['name']})
				count += 1

		result = {
			"status": "success",
			"content": data
		}    

	except Exception as e:
		exception = str(e).replace("\'","\"")
		
		result = {
			"status": "error",
			"content": exception
		}    

	return jsonify(result)


# api route for processing frequent words for word cloud
@application.route("/api/get_word_cloud", methods=['GET'])
def fetch_headline_wordcloud():
	
	headline_arr = []

	try:

		for p in range(1,6):
			headline = newsapi.get_top_headlines(language='en', page=p)
			headline_arr.extend(headline['articles'])

		wordlist = get_words(headline_arr)
		processed_words = pre_process_words(wordlist, 'stopwords_en.txt')
		wordmap = Counter(processed_words)
		top_n = sorted(wordmap.items(), key = lambda x : -x[1])[:30]
		data = []

		for ele in top_n:
			data.append({"word":ele[0], "size":ele[1]})

		result = {
			"status": "success",
			"content": data
		}    

	except Exception as e:
		exception = str(e).replace("\'","\"")
		
		result = {
			"status": "error",
			"content": exception
		}

	return jsonify(result)


# route for rendering the home page (either by index.html or just the url)
@application.route("/index", methods=['GET'])
@application.route("/", methods=['GET'])
def home():
	return application.send_static_file("index.html")


# function for extracting the words from headlines
def get_words(headlines):
	words = []
	for headline in headlines:
		word = headline['title'].split(" ")
		words.extend(word)
	
	for word in words:
		word.strip("\'").strip("\"")

	return words


# function for pre-processing the word cloud words, removing the stop words
def pre_process_words(words, file_path):
	with open(file_path, 'r') as f:
		s_words = f.read().splitlines()
	
	rem_stpw = [word for word in words if word and word.lower() not in s_words]
	rem_punc = [word.strip(";").strip(":").split("\'")[0] for word in rem_stpw]
	rem_dup = []
	punctuation = ['\"',';',':',',','.']

	similar_dict = {}
	for word in rem_punc:
		if len(word) == 0 or word in punctuation:
			continue
		cur_word = word.lower()
		if cur_word in similar_dict.keys():
			rem_dup.append(similar_dict[cur_word])
		else:
			similar_dict[cur_word] = word

	return rem_dup


# helper method for getting top n headlines, compliant to the check_validity method
def get_top_n(headline, req_keys, n):

	# check keys for data validation
	outer_keys = ['source', 'author', 'title', 'description', 'url', 'urlToImage', 'publishedAt', 'content']
	source_keys = ['id', 'name']

	count = 0
	headline_list = []
	for data in headline['articles']:
		if count == n:
			break
		if check_validity(data, outer_keys, source_keys):
			data_dict = {}
			for key in req_keys:
				if key == 'name':
					data_dict['name'] = data['source']['name']
				elif key == 'publishedAt':
					date = data[key].split("T")[0]
					date_l = date.split('-')
					date = date_l[1] + '/' + date_l[2] + '/' + date_l[0]
					data_dict[key] = str(date)
				else:
					data_dict[key] = str(data[key])


			headline_list.append(data_dict)
			count += 1

	return headline_list


# validation helper method for checking if necessary keys and the corresponding values are present
def check_validity(data, outer_keys, source_keys):
	
	for key in outer_keys:
		if key in list(data) and data[key] != "" and data[key] != None and data[key] != "null":
			continue
		else:
			return False

	source_data = data['source']
	
	for key in source_keys:
		if key in list(source_data) and source_data[key] != "" and source_data[key] != None and source_data[key] != "null":
			continue
		else:
			return False

	return True


if __name__ == "__main__":
	application.debug = True
	application.run(port=9000)