# How to use the docker image

## Prerequisites
* Run `npm install`
* You need to install docker and docker-compose!

## Run app
```
docker-compose up
visit https://localhost:5001/
```

# Protractor tests

## Prerequisites
```
sudo npm install -g protractor
install JDK
sudo webdriver-manager update
sudo webdriver-manager start
npm start
```

* Ahead of runtime isn't working yet (because of Polymer integration).

## Integration tests
```
docker-compose -f docker-compose.yml -f docker-compose.test.yml up
```
