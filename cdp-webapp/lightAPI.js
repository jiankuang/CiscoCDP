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

// ------------------------------- get all the lights ----------------------------------------------------
jQuery.ajax({
	url: "http://10.10.20.6/apigw/devnetlabapi/cdp/v1/devices/lighting?UserKey=500109&SensorCustomerKey=500050&AppKey=CDP-App", 
	type: "POST",
	data: JSON.stringify({"Query":
	    {"Find":
	        {"Light":
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

		lights = data['Find']['Result'];

		console.log(lights.length);

		for(var i=0; i < lights.length; i++) {
			var light = lights[i]['Light']
			var sid = light['sid'];
			var intensityLevel = light['state']['intensityLevel'];

			result.push({"sid": sid, "intensityLevel": intensityLevel});
		}

		$('#lights').html(JSON.stringify(result));
		//console.log();
	}, 
	error: function(error) {
		alert("error happend!");
		alert(JSON.stringify(error));
	}
});


var sid = "Simulated__DEVNET002__lBellzone01n0001";
var intensity = 0;

updateIntensitylevel(sid, intensity);

function updateIntensitylevel(sid, intensity){

	var postData = {
	  "Query": {
	    "Find": {
	      "Format":"version",
	      "Light": {
	        "sid": sid 
	      }
	    },
	    "for":{
	    	"each":"light",
	    	"in":"Find.Result.Light",
	    	"SetLocalData":{
	    		"key":"light.state.intensityLevel.value",
	    		"value": intensity
	    	}
	    },
	    "Update": {
	    	"from": "Result",
	    	"Include": "$Response.Message.Value.Find"
	    }
	  }
	};


	jQuery.ajax({
		url: "http://10.10.20.6/apigw/devnetlabapi/cdp/v1/devices/lighting?UserKey=500109&SensorCustomerKey=500050&AppKey=CDP-App", 
		type: "POST",
		data: JSON.stringify(postData),
		beforeSend: function(xhr) {
			xhr.setRequestHeader('WSO2-Authorization', 'oAuth Bearer 32b37facf21b4deadc93a261e2dc4f2');
			xhr.setRequestHeader('Authorization', 'Bearer 9sY1mKjZgJDa0yw3LHBdaJetU68y');
			xhr.setRequestHeader('Accept', 'application/json');
			xhr.setRequestHeader('Content-Type', 'application/json');
		},
		success: function(data){
			var result = [];

			lights = data['Find']['Result'];

		console.log(lights.length);

		for(var i=0; i < lights.length; i++) {
			var light = lights[i]['Light']
			var sid = light['sid'];
			var intensityLevel = light['state']['intensityLevel'];

			result.push({"sid": sid, "intensityLevel": intensityLevel});
		}

			console.log(JSON.stringify(result));
			//console.log();
		}, 
		error: function(error) {
			alert("error happend!");
			alert(error);
		}
	});
}
