const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');
const bodyParser = require('body-parser');

router.get('/', function(request, response){
  const sqlText = `SELECT track, artist, rank, published, track.id FROM track
JOIN artist on artist.id = track.id
JOIN rank on artist.id = rank.id
JOIN published on rank.id = published.id
ORDER BY track.id;`;
  pool.query(sqlText)
    // query was successful
    .then(function(result) {
      console.log('Get result:', result);
      response.send(result.rows);
    })
    // bad things could happen...
    .catch(function(error){
      console.log('Error on Get:', error);
      response.sendStatus(500);
    })
})

// Get a single song from /songs/5, where 5 is the id
router.get('/:id', (request, response) => {
  const id = request.params.id;
  const sqlText = `SELECT track, artist, rank, published, track.id FROM track
JOIN artist on artist.id = track.id
JOIN rank on artist.id = rank.id
JOIN published on rank.id = published.id
WHERE track.id = $1;`;
  pool.query(sqlText, [ id ])
    .then((result) => {
      console.log(`Getting song ${id}`);
      response.send(result.rows);
    })
    // bad things could happen...
    .catch(function(error){
      console.log(`Error on Get song ${id}:`, error);
      response.sendStatus(500);
    })
})

// Delete a single song from /songs/5, where 5 is the id
router.delete('/:id', (request, response) => {
  console.log('indelete');
  const id = request.params.id;
  const sqlText = `DELETE FROM artist WHERE id = ${id};
DELETE FROM track WHERE id = ${id};
DELETE FROM rank WHERE id = ${id};
DELETE FROM published WHERE id = ${id};`;
  pool.query(sqlText)
    .then((result) => {
      console.log(`Deleted song ${id}`);
      response.sendStatus(200);
    })
    // bad things could happen...
    .catch(function(error){
      console.log(`Error on Delete song ${id}:`, error);
      response.sendStatus(500);
    })
})

// Update the rating of a specific song
router.put('/:id', (request, response) => {
  const id = request.params.id;
  const editedSong = request.body;
  const sqlText = `UPDATE songs SET track=$1, artist=$2, rank=$3 WHERE id=$4`;




  pool.query(sqlText, [editedSong.track, editedSong.artist, editedSong.rank, id])
    .then((result) => {
      console.log(`Updated song ${id}`);
      response.sendStatus(200);
    })
    .catch( (error) => {
      console.log('Error on update song');
      response.sendStatus(500);
    })
})

router.post('/add', (request, response) => {
  const song = request.body;
  let track = request.body.track;
  let artist = request.body.artist;
  let published = request.body.published.substring(0,10);
  let rank = request.body.rank;
  console.log('Add song:', song);

  const sqlText = `INSERT INTO track (track)
                  VALUES (${track});
                  INSERT INTO artist (artist)
                  VALUES (${artist});
                  INSERT INTO published (published)
                  VALUES (${published});
                  INSERT INTO rank (rank)
                  VALUES (${rank});`;
  pool.query(sqlText)
    .then( (result) => {
      console.log('Added song:', result);
      response.sendStatus(201);
    })
    .catch( (error) => {
      console.log('Error adding song:', error);
      response.sendStatus(500);
    })
})

module.exports = router;
