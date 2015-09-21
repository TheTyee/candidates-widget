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

	//not currently necessary, but am plannign ahead for adding options to the widget
	var retrieveResults;
	retrieveResults = 'http://thehousingfix.ca/candidates/';
	
	//generate jQuery widget
     widget_markup = '<aside class="widget-credit">Powered by <a href="http://opennorth.ca" target="_blank"><img src="http://dev.housingfix.tyeesolutions.org/images/logos/open_north_rev.png"/></a></aside>';
     widget_markup = widget_markup + '<div class="widget-inputs">';
     widget_markup = widget_markup + '<h3>Find federal candidates in your riding</h3>';
     widget_markup = widget_markup +  '<form id="home-form" name="home-form">'; 
     widget_markup = widget_markup +  '<input id="riding_pc" name="riding" type="text" class="widget_field form-control" placeholder="Enter your Postal Code">';
     widget_markup = widget_markup + '<input id="btn" type="submit" value="Submit" formaction="'+ retrieveResults+'" /></form></div>';

  	$('.find-a-candidate').html(widget_markup);


	//Validation
	jQuery.validator.addMethod("cdnPostal", function(postal, element) {
	    return this.optional(element) || 
	    postal.match(/[a-zA-Z][0-9][a-zA-Z](-| |)[0-9][a-zA-Z][0-9]/);
	}, "Please specify a valid postal code.");

	$("#home-form").validate({
	        rules: {
	            riding: {
	              required: true,
	              cdnPostal: true
	          }
	        },
	        messages: {
	            riding: "Please enter a valid postal code"

	        }
	    });


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
		postalCode = GetURLParameter('riding');
		//console.log(riding);
		//URL-ify the postal code
		function urlify( withSpaces ){
			var str = withSpaces;
			str = str.replace(/\s+/g, '-').toLowerCase();
			return str;
		}

		
		//clear any cruft on each click
		$('#candidates_info').empty();
		$('#riding_info').empty();

		// feed the Postal Code into the API
		function getRidingInfo(postalCode){	
			//make it upper case
			postalCode = postalCode.toUpperCase();
			//strip the spaces
			postalCode = postalCode.replace('+', '');
			//console.log(postalCode);
			//API request
			$.ajax({
				//find the endpoint for the request postal code
				url: 'https://represent.opennorth.ca/postcodes/'+ postalCode+ '/',
			     data: {
			      format: 'json'
			   },
			    type: 'GET',
			    crossDomain: true,
			    dataType: 'jsonp',
			    success: function(data) { 
			    console.log(data);
			   //check to see if riding name has already been rendered; if not, print it
			  	var alreadyPrinted;
			  	alreadyPrinted = false;
			    jQuery.each(data.boundaries_centroid, function(key, value){
					if (value.boundary_set_name == "Federal electoral district"){
						if (alreadyPrinted == false){
							$('#riding_info').append('Your Candidates for ' + value.name);
							alreadyPrinted = true;
						}
					}
				});
				
				//print individual candidate info
				jQuery.each(data.candidates_centroid, function(key, value){
					switch(value.party_name) {
				    case 'NDP':
				        logo = '<img height="20" alt="'+value.party_name+'" src="/images/widget_logos/NDP-white.png"/>';
				        break;
				    case 'Conservative':
				         logo = '<img height="20" alt="'+value.party_name+'" src="/images/widget_logos/cons-white.png"/>';
				        break;
				    case 'Green Party':
				        logo = '<img height="20" alt="'+value.party_name+'" src="/images/widget_logos/green-white.png"/>';
				        break;
				    case 'Liberal':
				        logo = '<img height="20" alt="'+value.party_name+'" src="/images/widget_logos/liberal-white.png"/>';
				        break;
				    default:
				    	logo = value.party_name;
				    	break;	      
					}

					var candidateContents;
					candidateContents =	'<div class="individual candidate-'+ key +'">';
					candidateContents =	candidateContents + '<div class="candidate-top ' + urlify(value.party_name) +'">';
				    candidateContents =	candidateContents + '<div class="party-logo">'+ logo +'</div>';
				    if (value.incumbent == true){
				    	candidateContents = candidateContents + '<div class="incumbent"><span>Incumbent</span></div>';
				    }
				    candidateContents =	candidateContents + '<img class="candidate-image" src="' + value.photo_url+  '"/>';
				    candidateContents =	candidateContents + '<h4>' +value.name+ '</h4>';

				    candidateContents =	candidateContents + '</div>';
				    candidateContents =	candidateContents + '<div class="candidate-bottom">'
				    candidateContents =	candidateContents + '<ul>';
				    if (value.personal_url != ""){
				    	website = value.personal_url;
				    	candidateContents =	candidateContents + '<li><a target="_blank" href="'+ website + '">Website</a></li>';
				    }
				    
				    if (value.email !=""){
				    	email = value.email;
				    	candidateContents =	candidateContents + '<li><a href="mailto:'+ email + '">Email</a></li>';
				    }

				    if (typeof value.extra != 'undefined'){
					    if (typeof value.extra.twitter != 'undefined'){
					    	twitter = value.extra.twitter;
					    	candidateContents =	candidateContents + '<li><a href="' + twitter+ '">Twitter</a></li>';
					    }
					    if (typeof value.extra.facebook != 'undefined'){
					    	facebook = value.extra.facebook;
					    	candidateContents =	candidateContents + '<li><a href="' + facebook+ '">Facebook</a></li>';
					    }
					}
				    candidateContents =	candidateContents + '</ul>';
				    candidateContents =	candidateContents + '</div>';
				    console.log(candidateContents);

				    if (key ==3){
				    	console.log(key %3);
				    	candidateContents = candidateContents + '</div><div class="row">';
				    }
				    //if candidate key is == 3, then throw in a </div><div class="row">
					$('#candidates_info').append(candidateContents);


					});
				   },
				error: function() { 
					$('.riding_content').append('Sorry, there was an error with your submission. Please try again.'); 
				},


			});	
		}
	if(typeof postalCode !== "undefined")	{
	getRidingInfo(postalCode);
}
});