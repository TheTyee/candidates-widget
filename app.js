$('document').ready(function(){
	
	var postalCode; //user-inputted postal code
	var riding; //riding name
	var party; 	//party name
	var name;   //candidate name
	var social; //object with social media links

	$('button').click(function(){
		
		//clear any cruft on each click
		$('#candidates_info').empty();
		$('#riding_info').empty();
		
		//get the postal code
		postalCode = $('#riding_pc').val();
		//capitalize it
		postalCode = postalCode.toUpperCase();
		//feed it to the API
		$.ajax({
			//get API
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


		    jQuery.each(data.boundaries_concordance, function(key, value){
				console.log(value.name + ' ' + key);
				$('#riding_info').append(value.name);
			
			});
			
			jQuery.each(data.candidates_centroid, function(key, value){
				console.log(value.name + ' ' + key);
				$('#candidates_info').append( '<div class="candidate"><p><img src="' + value.photo_url+  '"/><p>' + value.name  + ' (' + value.party_name +')</p><p>Email: '+value.email+'</p><p>Website: ' +value.personal_url+'</p></div>');
				social = value.extra;
				$('#candidates')

				//$('#candidates_social').append('<p>'+ value.extra.twitter+'</p>');
			
			});
		   },
		error: function() { alert('Failed!'); },
	});	
});



	//use it to determine the correct riding.
	//get all candidates in the riding








});