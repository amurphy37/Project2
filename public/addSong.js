$(document).ready(function() {
    //sets max amount of songs that can be added to playlist. Set to 25.
    var max_fields = 25;
    //sets the field for inputs
    var wrapper = $(".input_fields_wrap");
    //sets id for add new song button
      var add_button = $(".add_field_button");
    
    // text box count
    var x = 1;
    //on click function to dynamically create artist and song fields
      $(add_button).click(function(e){ 
          e.preventDefault();
          if(x < max_fields){ 
        x++; 
              $(wrapper).prepend('<div class="newSongField"><input type="text" class="form-control songTitle" id="songTitle" class="remove_field" name="songTitleField" placeholder="Song Title"/><input type="text" class="form-control artistName" id="artistName" class="remove_field" name="artistNameField" placeholder="Artist Name"/><a href="#" class="remove_field">Remove Song From Playlist</a></div>'); //add input box
      }
      });
    
    //button click to remove the specific song and artist fields above it
      $(wrapper).on("click",".remove_field", function(e){ 
      e.preventDefault(); 
    $(this).parent('div.newSongField').remove();
      x--;
      })
  });