import urllib.request, urllib.parse, json
import pandas as pd

baseUrl = 'http://10.10.20.6/apigw/devnetlabapi/cdp/v1'

# real time device data requests require two query params: UserKey and SensorCustomerKey
queryParams =  urllib.parse.urlencode({'UserKey': '500102', 'SensorCustomerKey' : '500050', 'AppKey' : 'CDP-App'})

lightUrl = baseUrl + '/devices/lighting?%s' % queryParams 

requestHeaders = {
    'WSO2-Authorization' : 'oAuth Bearer 88b657e9e7e8220b44ba1b6ddfe9c8', # app_access_token
    'Authorization' : 'Bearer zk3Hd1YpJibAVEXFIssTml93diII', # api_access_token
    'Accept': 'application/json'
}


# TQL: when we need to get all lights, we put {ne:""}. I guess ne means not equal; not equal to "", means all the lights
# get single light
postData = {
    "Query":{
        "Find":{
            "Light":{
                "sid":"Simulated__DEVNET002__lBellzone01n0001"
            }
        }
    }
}
print('postData' + '*'*50)
print(postData)
data = urllib.parse.urlencode(postData)
print('data' + '*'*50)
print(data)
binary_data = data.encode('utf-8')
print('binary_data' + '*'*50)
print(binary_data)
request = urllib.request.Request(lightUrl, binary_data, requestHeaders)
response = urllib.request.urlopen(request)
print('before change' + '*'*50)
result = response.read().decode('utf-8')
print(type(result))
print(result)

df_result = pd.read_json(result)
print(type(df_result))
print(df_result.columns)