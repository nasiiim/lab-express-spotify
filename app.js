require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


hbs.registerPartials(__dirname + "/views/partials")
// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:
app.get('/',(req, res) =>{
    console.log("Home Page")
    res.render("index")
})

app.get("/artist-search", (req, res) =>{
    console.log(req.query)
    spotifyApi
    .searchArtists(req.query.artist)
    .then(data => { 
      console.log('The received data from the API: ', data.body.artists.items[0].images[0].url);
      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artist-search-results", {artists : data.body.artists.items})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
    // .getArtistAlbums() code goes here
    const artist = req.params.artistId
  
    spotifyApi.getArtistAlbums(artist)
    .then((data)=>{
        
        res.render("albums", { artist: data.body.items })
    })
  });


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
