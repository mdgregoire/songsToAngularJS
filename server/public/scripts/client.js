const app = angular.module('myApp', [])

const SongController = app.controller('SongController', ['$http', function($http){
  console.log('Hello, inside SongController');
  let self = this;
  self.newSong = {};
  self.songArray= [];


  self.getAllSongs = function() {
    $http({
      method: 'GET',
      url: '/songs'
    })
    .then(function(response){
      console.log('Getting all songs:', response);
      self.songArray = response.data;
      // displaySongs(response);
    })
    .catch(function(error){
      console.log(error);
    })
  }
  self.getAllSongs();
  // function getNewSong() {
  //   const song = {
  //     track: $('#in-track').val(),
  //     artist: $('#in-artist').val(),
  //     published: $('#in-date').val(),
  //     rank: $('#in-rank').val(),
  //   }
  //   return song;
  // }

  // function clearAddForm() {
  //   $('#in-track').val('');
  //   $('#in-artist').val('');
  //   $('#in-date').val('');
  //   $('#in-rank').val('');
  // }

self.addSong = function(song) {
  console.log(song, 'song in .addSong');
    $http({
      method: 'POST',
      url: '/songs/add',
      data: song
    })
    .then(function(response){
      console.log('Added song:', song);
      // clearAddForm();
      self.getAllSongs();
    })
    .catch(function(error){
      console.log(error, 'error in .addSong');
    })
  }

  function updateSongRating(id, newRating) {
    $.ajax({
      type: 'PUT',
      url: `/songs/${id}`,
      data: { rating: newRating }
    })
    .done(function (response) {
      console.log('Updated song rating');
      getAllSongs();
    })
    .fail(function (error){
      console.log(error);
    })
  }

  function deleteSong(id){
    $.ajax({
      type: 'DELETE',
      url: `songs/${id}`,
    })
    .done(function (response){
      console.log('Deleted song');
      getAllSongs();
    })
    .fail(function(error) {
      console.log(error);
    })
  }

  function displaySongs(songs) {
    for (let song of songs) {
      $('#out-songs').append(`<tr><td>${song.track}</td>
        <td>${song.artist}</td><td>${formatDate(song.published)}</td>
        <td>${song.rank}</td></tr>`);
    }
  }

self.formatDate = function(isoDateStr) {
    let result = ''
    if (isoDateStr != null) {
      let date = new Date(isoDateStr);
      result = date.toLocaleDateString();
    }
    return result;
  }
}



]);//end song controller
