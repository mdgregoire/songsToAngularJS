const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');
const bodyParser = require('body-parser');

router.get('/', function(request, response){
  const sqlText = `SELECT * FROM songs
                    ORDER BY id;`;
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
  const sqlText = `SELECT * FROM songs
WHERE id = $1;`;
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
  const sqlText = `DELETE FROM songs WHERE id = ${id};`;
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
  console.log(editedSong.published, 'EDITED SONG PUBLISHED');
  let date = editedSong.published.substring(0,10);
  console.log(date, 'EDITED SONG DATE');
  const sqlText = `UPDATE songs SET track=$1, artist=$2, rank=$3, published=$4 WHERE id=$5`;
  pool.query(sqlText, [editedSong.track, editedSong.artist, editedSong.rank, date, id])
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

  const sqlText = `INSERT INTO songs (track, artist, published, rank)
                    VALUES ($1, $2, $3, $4);`;
  pool.query(sqlText, [track, artist, published, rank])
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
