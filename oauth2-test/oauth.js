'use strict';
var oauth = require('oauth');
var OAuth2 = oauth.OAuth2;

var twitterConsumerKey = process.env.NODE_TWITTER_CONSUMER_KEY || '';
var twitterConsumerSecret = process.env.NODE_TWITTER_CONSUMER_SECRET || '';

if (!(twitterConsumerKey && twitterConsumerSecret)) {
  throw new Error('please set api key or api secret');
}

var oauth2 = new OAuth2(twitterConsumerKey, twitterConsumerSecret, 'https://api.twitter.com/', null, 'oauth2/token', null);

oauth2.getOAuthAccessToken('', {'grant_type': 'client_credentials'}, function (e, access_token, refresh_token) {
  if (e) {
    console.log(e);
    process.exit(1);
  }
  console.log('bearer: ', access_token);
});

