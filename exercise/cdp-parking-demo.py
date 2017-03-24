import dao
## Parking demo #########################################################################################################

# when car parks at a parking lot, the light of this spot is off; when the spot is empty, the light is on. 

# --------------- Initially, there is no car (state.occupied == False), light is on (state.intensityLevel > 0 (100)) -------------------
print('#'*30 + 'Set Initial Status' + '#'*30)
# Drive Out (change state.occupied to False)
parking = dao.updateParkingSpotOccupationStatus("Simulated__DEVNET002__pspotz001n001", False)
if parking is not None:
    # we now have an instance of a Smart+Connected Digital Platform parking spot model
    print('Parking Spot %s Occupation Status: %s' % (parking['label'], parking['state']['occupied'])) 

# Turn On the light
light = dao.updateLightIntensityLevel("Simulated__DEVNET002__lBellzone01n0001", 100)
if light is not None:
    # we now have an instance of a Smart+Connected Digital Platform parking spot model
    print('Light %s Intensity Level: %s' % (light['label'], light['state']['intensityLevel']))  

# --------------- Check the initial status --------------------------------------------------------------------------------------------
print('#'*30 + 'Check Initial Status' + '#'*30)
# get the status of a parking splot 
parking = dao.getParkingSpotStatus("Simulated__DEVNET002__pspotz001n001")
if parking is not None:
    # we now have an instance of a Smart+Connected Digital Platform parking spot model
    print('Parking Spot %s Occupation Status: %s' % (parking['label'], parking['state']['occupied'])) 


# get the status of a light 
light = dao.getLightStatus("Simulated__DEVNET002__lBellzone01n0001")
if light is not None:
    # we now have an instance of a Smart+Connected Digital Platform light model
    print('Light %s Intensity Level: %s' % (light['label'], light['state']['intensityLevel'])) 

# ----------------- then a car drive in, the light turn off ---------------------------------------------------------------------------
print('#'*30 + 'A Car Drive In' + '#'*30)
# Drive In (change state.occupied to True)
parking = dao.updateParkingSpotOccupationStatus("Simulated__DEVNET002__pspotz001n001", True)
if parking is not None:
    # we now have an instance of a Smart+Connected Digital Platform parking spot model
    print('Parking Spot %s Occupation Status: %s' % (parking['label'], parking['state']['occupied'])) 

# Turn Off the light
light = dao.updateLightIntensityLevel("Simulated__DEVNET002__lBellzone01n0001", 0)
if light is not None:
    # we now have an instance of a Smart+Connected Digital Platform parking spot model
    print('Light %s Intensity Level: %s' % (light['label'], light['state']['intensityLevel']))  

# ------------------- check the status after a car drive in --------------------------------------------------------------------------
print('#'*30 + 'Check the Status after A Car Drive In' + '#'*30)
# get the status of a parking splot 
parking = dao.getParkingSpotStatus("Simulated__DEVNET002__pspotz001n001")
if parking is not None:
    # we now have an instance of a Smart+Connected Digital Platform parking spot model
    print('Parking Spot %s Occupation Status: %s' % (parking['label'], parking['state']['occupied'])) 


# get the status of a light 
light = dao.getLightStatus("Simulated__DEVNET002__lBellzone01n0001")
if light is not None:
    # we now have an instance of a Smart+Connected Digital Platform light model
    print('Light %s Intensity Level: %s' % (light['label'], light['state']['intensityLevel'])) 

# -------------------- finally the car drive out, the light turn on again ------------------------------------------------------------
print('#'*30 + 'The Car Drive Out' + '#'*30)
# Drive Out (change state.occupied to False)
parking = dao.updateParkingSpotOccupationStatus("Simulated__DEVNET002__pspotz001n001", False)
if parking is not None:
    # we now have an instance of a Smart+Connected Digital Platform parking spot model
    print('Parking Spot %s Occupation Status: %s' % (parking['label'], parking['state']['occupied'])) 

# Turn On the light
light = dao.updateLightIntensityLevel("Simulated__DEVNET002__lBellzone01n0001", 100)
if light is not None:
    # we now have an instance of a Smart+Connected Digital Platform parking spot model
    print('Light %s Intensity Level: %s' % (light['label'], light['state']['intensityLevel'])) 

# ------------------ check the final status -----------------------------------------------------------------------------------------
print('#'*30 + 'Check the Status after The Car Drive Out' + '#'*30)
# get the status of a parking splot 
parking = dao.getParkingSpotStatus("Simulated__DEVNET002__pspotz001n001")
if parking is not None:
    # we now have an instance of a Smart+Connected Digital Platform parking spot model
    print('Parking Spot %s Occupation Status: %s' % (parking['label'], parking['state']['occupied'])) 


# get the status of a light 
light = dao.getLightStatus("Simulated__DEVNET002__lBellzone01n0001")
if light is not None:
    # we now have an instance of a Smart+Connected Digital Platform light model
    print('Light %s Intensity Level: %s' % (light['label'], light['state']['intensityLevel'])) 