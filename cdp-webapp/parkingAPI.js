// ------------------------------ get user info ---------------------------------------------------------
// jQuery.ajax({
// 	url: "http://10.10.20.6/apigw/devnetlabapi/cdp/v1/accounts/username?loginName=devoperator9%40cdp.com", 
// 	type: "GET",
// 	beforeSend: function(xhr) {
// 		xhr.setRequestHeader('WSO2-Authorization', 'oAuth Bearer 32b37facf21b4deadc93a261e2dc4f2');
// 		xhr.setRequestHeader('Authorization', 'Bearer 9sY1mKjZgJDa0yw3LHBdaJetU68y');
// 		xhr.setRequestHeader('Accept', 'application/json');
// 	},
// 	success: function(data){


// 		$('#lights').html(data.name);
// 		//console.log();
// 	}
// });

// ------------------------------- get all the Parking Spots ----------------------------------------------------

//function getAllParkingSpots() {

	spots = 

	jQuery.ajax({
		url: "http://10.10.20.6/apigw/devnetlabapi/cdp/v1/devices/parking?UserKey=500109&SensorCustomerKey=500050&AppKey=CDP-App", 
		type: "POST",
		data: JSON.stringify({"Query":
		    {"Find":
		        {"ParkingSpot":
		            {"sid":
		                {"ne":""}
		            }
		        }
		    }
		}),
		beforeSend: function(xhr) {
			xhr.setRequestHeader('WSO2-Authorization', 'oAuth Bearer 32b37facf21b4deadc93a261e2dc4f2');
			xhr.setRequestHeader('Authorization', 'Bearer 9sY1mKjZgJDa0yw3LHBdaJetU68y');
			xhr.setRequestHeader('Accept', 'application/json');
			xhr.setRequestHeader('Content-Type', 'application/json');
		},
		success: function(data){
			var result = [];

			spots = data['Find']['Result'];

			console.log(spots.length);

			for(var i=0; i < spots.length; i++) {
				var spot = spots[i]['Light']
				var sid = spot['sid'];
				var occupied = spot['state']['occupied'];

				result.push({"sid": sid, "occupied": occupied});
			}

			console.log(JSON.stringify(result));
			//console.log();
		}, 
		error: function(error) {
			alert("error happend!");
			alert(error);
		}
	});

//}