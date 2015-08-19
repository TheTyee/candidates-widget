//Candidate Finder v1.0
//Built with love by @sallypoulsen for the Tyee Solutions Society
//Uses the Open North Represent API @ https://represent.opennorth.ca/api/
//August 2015


$('document').ready(function(){

	var postalCode; //user-inputted postal code
	var riding; //riding name
	var party; 	//party name
	var name;   //candidate name
	var social; //object with social media links
	var inputLength; //for validation
	var Exp = /((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i; //alphanumeric checker

	//if request loads from an external source, retrieve the postal code parameters form the URL
	function GetURLParameter(sParam){
		//get the URL
	    var sPageURL = window.location.search.substring(1);
	   	//split it up
	    var sURLVariables = sPageURL.split('&');
	    for (var i = 0; i < sURLVariables.length; i++){
	        var sParameterName = sURLVariables[i].split('=');
	       // if it matches the desired parameter, dump it into the function
	        if (sParameterName[0] == sParam){
	            return sParameterName[1];
			}
		}
	}

	//put the postal code in a variable
	riding = GetURLParameter('riding');


	// feed the Postal Code into the API
	function getRidingInfo(postalCode){	
			//riding = GetURLParameter('riding');
			//if riding has a value, rename to be postal code

			//make it upper case
			postalCode = postalCode.toUpperCase();
			//strip the spaces
			postalCode = postalCode.replace(/\s/g, '');
			
			//API request
			$.ajax({
				//find the endpoint for the request postal code
				url: 'https://represent.opennorth.ca/postcodes/'+ postalCode+ '/',
			     data: {
			      format: 'json'
			     // limit: 150
			   },
			    type: 'GET',
			    crossDomain: true,
			    dataType: 'jsonp',
			    success: function(data) { 
			    console.log(data);

			    //print riding name
			    jQuery.each(data.boundaries_concordance, function(key, value){
					//console.log(value.name + ' ' + key);
					$('#riding_info').append(value.name);
				});
				
				//print indidivual candidate info
				jQuery.each(data.candidates_centroid, function(key, value){
					//console.log(value.name + ' ' + key);
					
					social = value.extra;
					twitter = '';
					facebook = '';
					//if twitter is included, print it
					if (typeof social.twitter != 'undefined'){
						twitter = '<p><a href=">'+ value.extra.twitter +'">' +value.extra.twitter+'</a></p>';
					}

					//if facebook is included, print it
					if (typeof social.facebook != 'undefined'){
						facebook = '<p><a href=">'+ value.extra.facebook +'">' +value.extra.facebook+'</a></p>';
					}


					$('#candidates_info').append( '<div class="candidate"><p><img src="' + value.photo_url+  '"/><p>' + value.name  + ' (' + value.party_name +')</p><p>Email: <a href="mailto:'+ value.email + '">' + value.email+'</a></p><p>Website: <a target="_blank" href="'+value.personal_url + '">' +value.personal_url+'</a></p><p>'+twitter+'</p><p>'+facebook+'</p></div>');
				

					
				});
			   },
			error: function() { 
			//alert('Failed!'); 
		},
		});	
	}






//IF THE USER HITS THE PAGE DIRECTLY, OR HAS PUT A POSTAL CODE INTO THE WIDGET
//check to see if user is hitting the candidate page directly
if (typeof riding != 'undefined'){
	//if there's a parameter getting pulled from the URL, rename it postalCode
	if (typeof riding != ''){
		postalCode = riding;
	}
	getRidingInfo(postalCode);
}

//IF THE USER SEARCHES DIRECTLY ON THE PAGE, with a click
	$('button').click(function(){	
		//Validation
		
		postalCode = $('#riding_pc').val();
		postalCode = postalCode.replace(/\s/g, '');
		inputLength = postalCode.length;
		
		if( inputLength > 6) {
			$('.has-error').remove();
			$('<div class="has-error">-Your code is too long.</div>').insertBefore('.btn');
		} 
		if (!postalCode.match(Exp)){
			$('.has-error').remove();
				$('<div class="has-error">-Contains invalid characters</div>').insertBefore('.btn');
				event.preventDefault();
		}

		if (inputLength < 5){
			$('.has-error').remove();
				$('<div class="has-error">-Your code is too short</div>').insertBefore('.btn');
				event.preventDefault();
		}		

			//clear any cruft
			$('#candidates_info').empty();
			$('#riding_info').empty();	
			


			getRidingInfo(postalCode);






	});

//IF THE USER SEARCHES DIRECTLY ON THE PAGE, by hitting enter
	 $('#riding_pc').keypress(function(e){
        if(e.which == 13){//Enter key pressed
          		//clear any cruft
		$('#candidates_info').empty();
		$('#riding_info').empty();	
		postalCode = $('#riding_pc').val();
		getRidingInfo(postalCode);
        }
    });




});