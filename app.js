$('document').ready(function(){
	//get API





	$.ajax({

    url: 'https://represent.opennorth.ca/candidates',
     data: {
      format: 'json',
      limit: 150
   },

    type: 'GET',
    crossDomain: true,
    dataType: 'jsonp',
    success: function(data) { console.log(data);},
    error: function() { alert('Failed!'); },
});

	




	//get value in postal code field.
	//use it to determine the correct riding.
	//get all candidates in the riding








});