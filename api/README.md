# Movie API

This is the movie api server consume the API from 2 movie providers, and combine the results into one.

### Target Provider API
* `/api/{cinemaworld or filmworld}/movies : This returns the movies that are available`
* `/api/{cinemaworld or filmworld}/movie/{ID}: This returns the details of a single movie`

These 2 providers are built differently in the serverless to provide more functionality including generate token and refresh token.


## API Endpoint

This Server only provide 2 endpoints:
* `GET` `/api/movies` for all movies
* `GET` `/api/exportmovies`  for exporting bulk csv

Note: The token can be obtained in movie provider app, and must be set in the .env

### params

These endpoints can take in 4 parameters as the same to the providers endpoints:
* `page` - page of the result
* `size` - size of the result
* `sort` - target sort item
* `order` - order direction of the sort

With these params provideded, we can use it to do more filter on the movies object from the results.

## Queuing Machanism

The application has two version of Queues implemented to achieve the purpose of safe-order and retry with delay `QUEUE_DELAY` in milliseconds and limited retry times `RETRY TIMES`.

##### Redis Bull Queue

You can setup to use redis bull queue, as long as you have redis server setup, and simply provide the redis parameters (`REDIS_PORT`, `REDIS_HOST`, `REDIS_PASSWORD`) into the `.env`, and also set the `USE_REDIS` to true to start using the Redis Queue.

##### Custom Queue

For the situation of local development where you don't have Redis Bull Queue, you can simply use the Custom Queue implemented using object with `jobId` and concat the results later by `jobId`



## Effectiveness

As the API endpoint is provided by third party, it would be make more sense to preload the data into database/cache (Redis) to increase the effectiveness and lower the affect of flaky API.

Reason of not doing that: need more time to build redis service and cache the data.

## Logging

Using `Winston` to provide basic logging in the console

## Setup

```
npm start
```

4 environment variables needed to startup:

* `API_BASE_UR` - API endpoint base url
* `API_CINEMAWORLD_MOVIES_PATH` - Path to the cinemaworld movies
* `API_FILMWORLD_MOVIES_PATH` - Path to the filmworld movies
* `API_TOKEN` - token generate in providers apps

You should see logs in the console now ;)