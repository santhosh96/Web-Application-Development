#!/bin/bash

FILE=.env

if [ -f "$FILE" ]; then
	printf "\n\n========================== Building the docker image ==========================\n\n"
	docker image build -t news-app .
	printf "\n\n========================== Running the application ==========================\n\n"
    docker run -ti -p 9000:9000 --name news_app_container news-app
else 
    printf "$FILE does not exist, please refer Readme for creating an environment file.\n"
fi

