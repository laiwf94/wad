
# Movie API Provider

Movie Provider running the API below endpoints:

##### Movies:
* `/api/{cinemaworld or filmworld}/movies` : This returns the movies that are available
* `/api/{cinemaworld or filmworld}/movie/{ID}`: This returns the details of a single movie
* `/api/{cinemaworld or filmworld}/movie`: Post a movie to the endpoint
For example: Get the Cheapest Movie

##### Token:
* `/api/token`: read your token 
* `/api/token/refresh` : refresh token

The Movie endpoints has the authentication middleware to verify if the token is provided and correctly match up with the token store in the database (JSON file in this case).

The Token endpoints need Okta(OIDC) login to view the token stored in the database (JSON file), and also to refresh the token.

### Params

These endpoints can take in 4 parameters endpoints:
* `page` - page of the result
* `size` - size of the result
* `sort` - target sort item
* `order` - order direction of the sort

With these params provideded, we can use it to do more filter on the movies object from the results.

Note: Because the JSON is acts as the database here. The filter is less effective here by simply doing `Array.filter()` or `Array.splice()`. Usually with Database or GraphQL, these parameters would be helping to get the result quicker and easier.

### Database

2 JSON files stored in datastore folde:
* `cinemaworld.json` - movie from cinemaworld
* `filmworld.json` - movie from filmworld
* `token.json` - token generated.

Assumption: 
* There is only one account, and token is being shared for everyone.
* `cinemaworld.json` and `filmworld.json` each represent different databases

## Logging

Using `Winston` to provide basic logging in the console

## Setup

```
npm start
```

For intial run, the token will be generated and store in the database in `datastore/token.json`, and you can also check it in the web browser - `/api/token` once login to Okta (OIDC)


4 environment variables needed to startup:

* `OKTA_CLIENTID` - Okta ClientID
* `OKTA_CLIENTSECRET` - Okta ClientSecret
* `OKTA_URL_BASE` - Okta BaseURL
* `OKTA_APP_BASE_URL` - APP URL as Return URL

you can set `ENABLE_OKTA` to false to bypass the setup on okta


Below is optional variables:

* `ENV` - current environment
* `FLAKY_API` - whether it is a flaky API

You should see logs in the console now ;)

