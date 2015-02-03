$(document).ready( function() {
  'use strict';

  $.material.init();

  $('#site').dropdown();

  $('#date .input-daterange').datepicker({
    format: "yyyy-mm-dd",
    endDate: "today"
  });

  // create the globe
  var globeObject = document.getElementById('globe');
  var color = function() {
    var c = new THREE.Color('rgb(244,67,54)');
    return c;
  };
  var globe = new DAT.Globe(globeObject, { colorFn: color, imgDir: './third-party/' });
  globe.animate();

  // global index for data naming
  var index = 0;
  var url, token;

  // demo checkbox
  var piwikDemo = {url: document.location.protocol + '//demo.piwik.org/', token: 'anonymous'};
  $('#useDemo input:checkbox').change( function() {
    if ($('#useDemo input:checkbox').prop('checked')) {
      $('#url, #token').prop('disabled', true);
      $('#url').val(piwikDemo.url);
      $('#token').val(piwikDemo.token);
    } else {
      $('#url, #token').prop('disabled', false).val('');
    }
  });

  // add data menu
  $('#addDataButton').click( function() {
    url = $('#url').val();
    token = $('#token').val();
    if (url && token) {
      url += '?callback=?';
      checkSite(url, token);
    }
  });

  // update when input changed
  $('#site, #startdate, #enddate').change( function() {
    var idSite = $('#site option:selected').val();
    var startdate = $('#startdate').val();
    var enddate = $('#enddate').val();

    console.log(idSite);
    console.log(startdate);
    console.log(enddate);

    if (idSite && startdate && enddate) {
      updateGlobe(url, token, idSite, startdate + ',' + enddate);
    }
  });

  // calls a 'getSitesWithAtLeastViewAccess' command to get all sites
  function checkSite(url, token) {
    var params = {
      module: 'API',
      method:'SitesManager.getSitesWithAtLeastViewAccess',
      format: 'JSON',
      token_auth: token
    };

    $.getJSON(url, params)
      .done(function(data) {
        // do a simple check
        if (data[0].name.length >= 1) {
          $.each(data, function(i, site) {
            $('#site').append( new Option(site.name, site.idsite) );
          });

          $("#addDataToggle").prop('disabled', true);
          $("#changeSiteToggle, #changeTimeToggle").prop('disabled', false).addClass('animated flash');

          $('#addData').modal('hide');
          swal({
            title: 'Yay!',
            text: 'Now you only have to select the site and date range...',
            type: 'success',
            confirmButtonText: 'Start!'
          });
        } else {
          swal({
            title: 'Failed to connect to the site!',
            text: 'Please try it with another Token or URL...',
            type: 'error',
            confirmButtonText: 'Try again!'
          });
        }
      })
      .fail(function() {
        swal({
          title: 'Failed to connect to the site!',
          text: 'Please try it with another Token or URL...',
          type: 'error',
          confirmButtonText: 'Try again!'
        });
    });
  }

  function updateGlobe(url, token, idSite, date) {
      var params = {
      module: 'API',
      method:'UserCountry.getCity',
      idSite: idSite,
      period: 'range',
      date: date,
      format: 'JSON',
      token_auth: token
    };

    $.getJSON(url, params)
      .done(function(data) {
        var globeData = [];
        $.each(data, function(i, city){
          if(city.lat && city.long && city.nb_visits){
            globeData.push(city.lat, city.long, city.nb_visits);
          }
        });
        console.log(globeData);
        if(globeData.lenght < 3) {
          swal({
            title: 'Data error!',
            text: 'The anwer from the server does not look  nice...',
            type: 'error',
            confirmButtonText: 'Okay'
          }, function(){ document.location.href = './error.html'; });
        }
        globe.addData(globeData, {format: 'magnitude', name: index, animated: true});
        globe.createPoints();
        globe.animate();
        index += 1;
      })
      .fail(function() {
        swal({
          title: 'Oh no!',
          text: 'Failed to update the globe. Maybe bad parameters?',
          type: 'error',
          confirmButtonText: 'Try again!'
        }, function(){ document.location.href = './error.html'; });
    });
  }
});
