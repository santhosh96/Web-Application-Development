# News Bulletin with Python backend

A simple news bulletin application having backend written with Flask and frontend written with HTML, CSS and JavaScript. The application has two sections :
* __News section__: Consists of news headline carousel, most frequent news topic word cloud and news article displayed as cards
* __Search section__: Enables user to search article with specific user mentioned topic

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

* Python (3.7 or greater)
* Flask (1.1.2 or greater)
* [Google News API Key](https://newsapi.org/register)

### Installation

#### Creating an environment variable file
* [Register](https://newsapi.org/register) for getting a News API Key
* Replace the <environment_key> with your environment key
```
echo 'NEWS_API_KEY=<environment_key>' > .env 
```

#### Docker way

```
./deploy_setup.sh
```

#### Virtual environment way

* Creating a virtual environment
```
python3 -m venv flask-server
```
* Initializing the environment
```
source flask-server/bin/activate
```
* Installing the required packages
```
pip3 install -r requirements.txt
```
* Staring the application
```
python3 application.py
```
