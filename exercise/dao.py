import urllib.request, urllib.parse, json

# login -----------------------------------------------------------------------------------------------------------
loginUrl = 'http://10.10.20.6/apigw/devnetlabtokenapi/login'

postData = {
	'username':'devoperator4@cdp.com',
	'password':'sWrw3%M*J',
    'client_id':'a27b18484c3c4e08a7c193e42c639347',
    'client_secret':'b863de8f453c4a05A88126F45B958CF1',
    'grant_type':'client_credentials'
}

# Convert a mapping object or a sequence of two-element tuples, which may contain str or bytes objects, 
# to a percent-encoded ASCII text string.
# e.g. username=devoperator4%40cdp.com&password=sWrw3%25M%2AJ& ...
data = urllib.parse.urlencode(postData)
# e.g. b'username=devoperator4%40cdp.com&password=sWrw3%25M%2AJ& ...'
binary_data = data.encode('UTF-8')
print('\nLogging in \n(' + loginUrl + ')\n')
# request: <urllib.request.Request object at 0x037CD9B0>
request = urllib.request.Request(loginUrl, binary_data)
# response: <http.client.HTTPResponse object at 0x03B15FB0>
response = urllib.request.urlopen(request)

# {"scope":"default","token_type":"bearer","app_access_token":"88b657e9e7e8220b44ba1b6ddfe9c8","app_refresh_token":"81e9dc9e98cd2fc6db6df3b4691eee","app_expires_in":3600,"api_access_token":"zk3Hd1YpJibAVEXFIssTml93diII","api_expires_in":3599}
results = response.read().decode('UTF-8')
# {'scope': 'default', 'token_type': 'bearer', 'app_access_token': '88b657e9e7e8220b44ba1b6ddfe9c8', 'app_refresh_token': '81e9dc9e98cd2fc6db6df3b4691eee', 'app_expires_in': 3600, 'api_access_token': 'zk3Hd1YpJibAVEXFIssTml93diII', 'api_expires_in': 3599}
responseDictionary = json.loads(results)

print('Response from Login Request:')
print(responseDictionary)

# Get User info ----------------------------------------------------------------------------------------------------------
# get the auth tokens from the response - these are needed in all future Smart+Connected Digital Platform API Requests
requestHeaders = {
    'WSO2-Authorization' : 'oAuth Bearer ' + responseDictionary['app_access_token'],
    'Authorization' : 'Bearer ' + responseDictionary['api_access_token'],
    'Accept': 'application/json'
}

print('Request Headers for CDP API requests:')
print(requestHeaders)

# get user info for the logged in user
# <CDP-BaseURL>/accounts/username?loginName=user123@cdp.com

# Base Smart+Connected Digital Platform API URL for all other requests
baseUrl = 'http://10.10.20.6/apigw/devnetlabapi/cdp/v1'
# username resource requires one queryparam: the username for which you are retrieving information
queryParams =  urllib.parse.urlencode({'loginName': postData['username']})

requestUrl = baseUrl + '/accounts/username?%s' % queryParams

print('\nGetting **USER** Information (' + requestUrl + ')\n')

request = urllib.request.Request(requestUrl)
# add headers (for API authorization)
for k, v in requestHeaders.items():
    request.add_header(k, v)

# perform the request
response = urllib.request.urlopen(request)

results = response.read().decode('UTF-8')
responseDictionary = json.loads(results)

print('User Information: (We need userId(id) and customerId(parentInfo.id) for querying active devices.)\n')
print(responseDictionary)

customerId = None
userId = None

if 'id' in responseDictionary:
    userId = str(responseDictionary['id'])
    print("Retrieved User ID:" + userId)

if 'parentInfo' in responseDictionary:
    parentInfo = responseDictionary['parentInfo']
    if 'id' in parentInfo:
        customerId = str(parentInfo['id'])
        print("Retrieved Customer ID:" + customerId)

# functions -------------------------------------------------------------------------------------------
def getJsonResponseFromPostTQL(deviceType, postData):
	baseUrl = 'http://10.10.20.6/apigw/devnetlabapi/cdp/v1'
	# real time device data requests require two query params: UserKey and SensorCustomerKey
	queryParams =  urllib.parse.urlencode({'UserKey': userId, 'SensorCustomerKey' : customerId, 'AppKey' : 'CDP-App'})
	# concatinate requestUrl based on deviceType
	requestUrl = baseUrl + '/devices/%s?%s' % (deviceType, queryParams)


	# urlencode the data
	data = urllib.parse.urlencode(postData)
	# use UTF-8 encoding for POST data and responses
	encoding = 'UTF-8'
	# POST needs binary data, so encode it
	binary_data = data.encode(encoding)

	# urlopen with data causes a POST request instead of a GET
	request = urllib.request.Request(requestUrl, binary_data)
	print("\nRequesting **Real Time Data** (" + requestUrl + ")\n")
	# add headers (for API authorization)
	for k, v in requestHeaders.items():
	    request.add_header(k, v)
	
	# perform the request
	response = urllib.request.urlopen(request)
	results = response.read().decode(encoding) # results is in json string format, double quotes
	# create a dictionary from the results
	responseDictionary = json.loads(results) # responseDictionary is in dictinoary format, single qoutes
	if 'Find' in responseDictionary:
	    findObject = responseDictionary['Find']
	    if 'Result' in findObject:
	        results = findObject['Result']

	return results

# ------------------------------ Lighting -------------------------------------------------------------------------------------

def updateLightIntensityLevel(sid, intensity):
	light = None
	postData = {
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
	    		"value": intensity #"0"
	    	}
	    },
	    "Update": {
	    	"from": "Result",
	    	"Include": "$Response.Message.Value.Find"
	    }
	  }
	}
	results = getJsonResponseFromPostTQL("lighting" ,postData)
	if 'Light' in results[0]:
		light = results[0]['Light']
	return light

def getLightStatus(sid):
	light = None
	# create the TQL POST Body
	postData = {"Query":
	    {"Find":
	        {"Light":
	            {"sid": sid #
	            }
	        }
	    }
	}
	results = getJsonResponseFromPostTQL("lighting" ,postData)
	if 'Light' in results[0]:
		light = results[0]['Light']
	return light

# ------------------------------ Parking -----------------------------------------------------------------------------

def getParkingSpotStatus(sid):
	parking = None
	# create the TQL POST Body
	postData = {
	  "Query": {
	    "Find": {
	      "ParkingSpot": {
	        "sid": sid #"Simulated__DEVNET002__pspotz001n001"
	      }
	    }
	  }
	}
	results = getJsonResponseFromPostTQL("parking" ,postData)
	if 'ParkingSpot' in results[0]:
		parking = results[0]['ParkingSpot']
	return parking

def getAllParkingSpots():
	parkings = None
	# create the TQL POST Body
	postData = {
	  "Query": {
	    "Find": {
	      "ParkingSpot": {
	        "sid": {
	          "ne": ""
	        }
	      }
	    }
	  }
	}
	parkings = getJsonResponseFromPostTQL("parking" ,postData)
	return parkings

def getAllParkingSpaces():
	postData = {
	  "Query": {
	    "Find": {
	      "ParkingSpace": {
	        "sid": {
	          "ne": ""
	        }
	      }
	    }
	  }
	}
	spaces = getJsonResponseFromPostTQL("parking" ,postData)
	return spaces

def updateParkingSpotOccupationStatus(sid, occupied):
	parking = None
	postData = {
	  "Query": {
	    "Find": {
	      "Format":"version",
	      "ParkingSpot": {
	        "sid": sid # 
	      }
	    },
	    "for":{
	    	"each":"spot",
	    	"in":"Find.Result.ParkingSpot",
	    	"SetLocalData":{
	    		"key":"spot.state.occupied.value",
	    		"value": occupied #True
	    	}
	    },
	    "Update": {
	 	    "from": "Result",
		    "Include": "$Response.Message.Value.Find"
	    }
	  }
	}
	results = getJsonResponseFromPostTQL("parking" ,postData)
	if 'ParkingSpot' in results[0]:
		parking = results[0]['ParkingSpot']
	return parking

# --------------------------------------- Environment -------------------------------------------------------
def getAllEnvironmentSensors():
	postData = {
	  "Query": {
	    "Find": {
	      "EnvironmentSensor": {
	        "sid": {
	          "ne": ""
	        }
	      }
	    }
	  }
	}
	lst = getJsonResponseFromPostTQL("environment" ,postData)
	return lst