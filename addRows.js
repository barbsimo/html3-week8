/*  Adds hive status to local storage. B Simonsen */

(function() {
'use strict';
  
var SETTINGS_KEY = 'LSS_Settings';
var numb = 1000;
//var settings = getSettings();
var hives = [];
getSettings();
showHives( );

$('#status').on( 'click', addHive );
$('#beeHives').on( 'click', '.edit', editAHive );
$('#beeHives').on( 'click', '.delete', askDeleteHive ); 
  
function getSettings() {
  try {
    var x, len;
    var settingsString = localStorage[ SETTINGS_KEY];
    if (settingsString) {
      //return JSON.parse(settingsString);
      hives = JSON.parse(settingsString);
      for (x=0, len=hives.length;x<len;++x) {
        console.log('hives:'+hives[x]._id+hives[x].hive+hives[x].notes+hives[x].dateChecked);
        //console.log('id:'+hives[x]._id)
      }
      numb = incrmNumb();
    }
  } catch (excptn) {
    console.error('Error getting data');
  }
  function incrmNumb() {
    var maxNumb = 1000;
    hives.forEach (function(hive) {
      if (hive._id > maxNumb) {
        maxNumb = +hive._id;
      }
    });
    return maxNumb + 1;
  }
 
}
  
//function saveSettings( ) {
//    localStorage[ SETTINGS_KEY ] = JSON.stringify( hives );
//}
  
//function newStatus( ) {
//    $('#hive').val( '' );
//    $('#dateChecked').val( '' );
//    $('#notes').val('');

//    $('#submit').one( 'click', addHive );
//    $('#cancel').one( 'click', showHives );

//    $('#hiveList').hide();
//    $('#addStatus').show();

//    function addHive( obj ) {
//        var oneHive = {
//            hive: $('#hive').val(),
//            dateChecked: $('#dateChecked').val(),
//            notes: $('#notes').val()
//        };
//        hives.push( oneHive );
//        saveSettings ();
//        obj.preventDefault( );
//        showHives( );
//    }
//}

function showHives( ) {
    var tr, td, beeHive, i, len, button;
    $('#beeHives').empty();
    //getSettings();
    for (i=0,len=hives.length; i<len; ++i) {
        beeHive = hives[ i ];

        tr = $( '<tr data-id="' + beeHive._id + '">' );

        td = $( '<td>' );
        td.text( beeHive.hive );
        tr.append( td );

        td = $( '<td>' );
        td.text( beeHive.dateChecked );
        tr.append( td );
      
        td = $( '<td>' );
        td.text( beeHive.notes );
        tr.append( td );

        td = $( '<td>' );
        button = $( '<button type="button" class="edit">' );
        button.text( 'Edit' );
        td.append( button );
        button = $( '<button type="button" class="delete">' );
        button.text( 'Delete' );
        td.append( button );
        tr.append( td );

        $('#beeHives').append( tr );
    }

    $('#hiveList').show();
    $('#addStatus').hide();
}
  
  function addHive() {
    editHive();
  }
  
  function editAHive(evt) {
    var i = indexOfHive(evt);
    if (i >= 0) {
      console.log('hives index:'+i)
      editHive(hives[i]);
    }
  }
  
  function askDeleteHive(evt) {
    var i = indexOfHive(evt);
    if (i >= 0) {
      if (window.confirm('Are you sure you want to delete this inspection record?')) {
        deleteHive(i);
        showHives();
      }
    }
  
    function deleteHive(j) {
      hives.splice(j,1);
      localStorage[ SETTINGS_KEY ] = JSON.stringify( hives );
    }
  
  }
  
  function indexOfHive(evt) {
    var button = evt.target;
    var tr = $(button).closest('tr');
    var id = tr.attr('data-id');
    var i, len;
    for (i=0,len=hives.length; i<len;++i) {
      if(hives[i]._id===id) {
        return i;
      }
    }
    return -1;
  }
  
  function editHive(beeHive) {
    if (beeHive) {
      $('#hive').val(beeHive.hive);
      $('#dateChecked').val(beeHive.dateChecked );
      $('#notes').val(beeHive.notes );
    } else {
        $('#hive').val('');
        $('#dateChecked').val('' );
        $('#notes').val('' );
    }
    $('#submit').one( 'click', changeHive );
    $('#cancel').one( 'click', showHives );
    $('#hiveList').hide();
    $('#addStatus').show();
  
    function changeHive(evt) {
      var newHive;
      evt.preventDefault ();
      if (beeHive) {
        beeHive.hive = $('#hive').val();
        beeHive.dateChecked = $('#dateChecked').val();
        beeHive.notes = $('#notes').val();
      } else {
          newHive = {
            _id: (numb++).toString(),
            hive: $('#hive').val(),
            dateChecked: $('#dateChecked').val(),
            notes: $('#notes').val()        
          };
        hives.push(newHive);
      }
      localStorage[SETTINGS_KEY] = JSON.stringify(hives);
      showHives();
    }
  }

})();