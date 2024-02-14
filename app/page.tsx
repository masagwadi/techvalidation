'use client';
import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, Marker, useLoadScript, Autocomplete, InfoWindow } from '@react-google-maps/api';
import Image from 'next/image';

const containerStyle: React.CSSProperties = {
  width: '800px',
  height: '600px'
};

interface Store {
  id: number;
  name: string;
  lat: number;
  lng: number;
  province: string;
  city: string;
  address: string;
  distance?: number;
}

const MyMapComponent: React.FC<{ stores: Store[], center: { lat: number, lng: number }, onStoreClick: (store: Store) => void, selectedStoreData: Store | null}> = ({ stores, center, onStoreClick, selectedStoreData }) => {
  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={20}
    >
      {stores.map(store => (
        <Marker
          key={store.id}
          position={{ lat: store.lat, lng: store.lng }}
          onClick={() => onStoreClick(store)}
          icon={{
            url: selectedStoreData && selectedStoreData.id === store.id ? 'http://maps.gstatic.com/mapfiles/ms2/micons/rangerstation.png' : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
            scaledSize: selectedStoreData && selectedStoreData.id === store.id ? new window.google.maps.Size(38, 38) : new window.google.maps.Size(38, 38), // Adjust the size here
          }}
        >
        {selectedStoreData && selectedStoreData.id === store.id && (
            // <InfoWindow onCloseClick={() => setSelectedStoreData(null)}>
              <InfoWindow position={{ lat: store.lat, lng: store.lng }} >
              <div>
              <h1>Store Name: {store.name}</h1>
              <h2>Store ID: {store.id}</h2>
              <h2>Store ID: {store.address}</h2><br/>
              <Image 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWiQW6jW9O0wng3KoqyAjXMXrMOQSiyZ6Sfdsht_TMYg&s" 
                  alt="Store Image" 
                  width={350}
                  height={350}
              />
              </div>
            </InfoWindow>
          )}
        </Marker>
      ))}
    </GoogleMap>
  );
};


const IndexPage: React.FC = () => {
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStoreData, setSelectedStoreData] = useState<Store | null>(null);
  const [selectedStores, setSelectedStores] = useState<Store[]>([]);

  
  const [mapCenter, setMapCenter] = useState<{ lat: number, lng: number }>({ lat: -29.85868, lng: 31.02184 });
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDsmOlsuQwQmQV_Wp2RnSodJpTjGfEZA7c" || "",
    libraries: ["places"]
  });

  // const autocomplete = useRef<google.maps.places.Autocomplete | null>(null);
  const autocomplete = useRef<google.maps.places.Autocomplete>();

  useEffect(() => {
    if (!isLoaded) return;

    // Set South Africa stores data here
    const southAfricaStores: Store[] = [
      { "id": 1, "name": "Van Schaik Bookstore Bellville", "address": "Shop 42, Bellville Mall, C/o Durban Road & Voortrekker Road, Bellville, Cape Town", "lat": -33.89046, "lng": 18.62989, "province": "Western Cape", "city": "Bellville" },
      { "id": 2, "name": "Van Schaik Bookstore Brackenfell", "address": "Shop 3, Brackenfell Centre, Old Paarl Road, Brackenfell, Cape Town", "lat": -33.88374, "lng": 18.69537, "province": "Western Cape", "city": "Brackenfell" },
      { "id": 3, "name": "Van Schaik Bookstore Somerset Mall", "address": "Shop 62, Somerset Mall, C/o N2 & R44, Somerset West, Cape Town", "lat": -34.08535, "lng": 18.82809, "province": "Western Cape", "city": "Somerset West" },
      { "id": 4, "name": "Van Schaik Bookstore Paarl Mall", "address": "Shop 63, Paarl Mall, Cecilia Street, Paarl, Cape Town", "lat": -33.73021, "lng": 18.96739, "province": "Western Cape", "city": "Paarl" },
      { "id": 5, "name": "Van Schaik Bookstore Tygervalley Centre", "address": "Shop 104, Tygervalley Centre, C/o Bill Bezuidenhout Avenue & Willie Van Schoor Avenue, Bellville, Cape Town", "lat": -33.87362, "lng": 18.63018, "province": "Western Cape", "city": "Bellville" },
      { "id": 6, "name": "Van Schaik Bookstore The Paddocks Shopping Centre", "address": "Shop 3, The Paddocks Shopping Centre, C/o Racecourse & Grand National Boulevard, Milnerton, Cape Town", "lat": -33.86172, "lng": 18.65229, "province": "Western Cape", "city": "Milnerton" },
      { "id": 7, "name": "Van Schaik Bookstore Vangate Mall", "address": "Shop 65, Vangate Mall, Vanguard Drive, Athlone, Cape Town", "lat": -34.00394, "lng": 18.54055, "province": "Western Cape", "city": "Athlone" },
      { "id": 8, "name": "Van Schaik Bookstore Somerset Value Mart", "address": "Shop 109, Somerset Value Mart, C/o Reitz Street & De Beers Avenue, Somerset West, Cape Town", "lat": -34.06936, "lng": 18.82604, "province": "Western Cape", "city": "Somerset West" },
      { "id": 9, "name": "Van Schaik Bookstore Liberty Promenade", "address": "Shop 152, Liberty Promenade, Morgenster Road, Mitchells Plain, Cape Town", "lat": -34.04299, "lng": 18.60948, "province": "Western Cape", "city": "Mitchells Plain" },
      { "id": 10, "name": "Van Schaik Bookstore Eikestad Mall", "address": "Shop 62, Eikestad Mall, Andringa Street, Stellenbosch, Cape Town", "lat": -33.93204, "lng": 18.86044, "province": "Western Cape", "city": "Stellenbosch" },
      { "id": 11, "name": "Van Schaik Bookstore Pretoria (12345)", "address": "275 Madiba St, Pretoria Central, Pretoria, 0002", "lat": -25.754898, "lng": 28.21453, "province": "Gauteng", "city": "Pretoria" },
    { "id": 12, "name": "Van Schaik Bookstore Johannesburg (23456)", "address": "Corner of Frederick & Rissik Street, Johannesburg, 2001", "lat": -26.203738, "lng": 28.033229, "province": "Gauteng", "city": "Johannesburg" },
    { "id": 13, "name": "Van Schaik Bookstore Menlyn", "address": "Shop LG127, Menlyn Park Shopping Centre, Atterbury Road & Lois Avenue, Menlyn, Pretoria, 0063", "lat": -25.783152, "lng": 28.281632, "province": "Gauteng", "city": "Pretoria" },
    { "id": 14, "name": "Van Schaik Bookstore Hatfield", "address": "1242 South St, Hatfield, Pretoria, 0028", "lat": -25.749212, "lng": 28.233699, "province": "Gauteng", "city": "Pretoria" },
    { "id": 15, "name": "Van Schaik Bookstore Southgate", "address": "Shop L04, Southgate Mall, Rifle Range Rd, Southgate, Johannesburg, 2091", "lat": -26.26201, "lng": 27.989002, "province": "Gauteng", "city": "Johannesburg" },
    { "id": 16, "name": "Van Schaik Bookstore Carlton Centre", "address": "150 Commissioner St, Johannesburg CBD, Johannesburg, 2001", "lat": -26.20453, "lng": 28.04547, "province": "Gauteng", "city": "Johannesburg" },
    { "id": 17, "name": "Van Schaik Bookstore Mamelodi", "address": "712 Tsamaya Rd, Mamelodi, Pretoria, 0122", "lat": -25.720595, "lng": 28.292143, "province": "Gauteng", "city": "Pretoria" },
    { "id": 18, "name": "Van Schaik Bookstore Arcadia", "address": "401 Jorissen St, Arcadia, Pretoria, 0007", "lat": -25.747245, "lng": 28.222848, "province": "Gauteng", "city": "Pretoria" },
    { "id": 19, "name": "Van Schaik Bookstore Randburg", "address": "Shop L46, Randburg Square, Randburg, Johannesburg, 2194", "lat": -26.095871, "lng": 27.980947, "province": "Gauteng", "city": "Johannesburg" },
    { "id": 20, "name": "Van Schaik Bookstore Jabulani Mall", "address": "Shop 83, Jabulani Mall, Bolani Rd, Soweto, Johannesburg, 1868", "lat": -26.253676, "lng": 27.866108, "province": "Gauteng", "city": "Johannesburg" },
    { "id": 21, "name": "Van Schaik Bookstore Pietermaritzburg", "lat": -29.60389, "lng": 30.39805, "province": "KwaZulu-Natal", "city": "Pietermaritzburg", "address": "Shop G23, Liberty Midlands Mall, 50 Sanctuary Rd, Pietermaritzburg, 3201" },
    { "id": 22, "name": "Van Schaik Bookstore Ballito", "lat": -29.53514, "lng": 31.21312, "province": "KwaZulu-Natal", "city": "Ballito", "address": "Shop 209, Level 2, Ballito Junction Regional Mall, Ballito Dr, Dolphin Coast, 4399" },
    { "id": 23, "name": "Van Schaik Bookstore Musgrave Centre", "lat": -29.83823, "lng": 31.01313, "province": "KwaZulu-Natal", "city": "Durban", "address": "Shop 320, Musgrave Centre, 115 Musgrave Rd, Berea, Durban, 4001" },
    { "id": 24, "name": "Van Schaik Bookstore The Pavilion", "lat": -29.85237, "lng": 30.95102, "province": "KwaZulu-Natal", "city": "Durban", "address": "Shop 19, Upper Level, The Pavilion, Jack Martens Dr, Westville, Durban, 3629" },
    { "id": 25, "name": "Van Schaik Bookstore Gateway Theatre of Shopping", "lat": -29.72664, "lng": 31.08255, "province": "KwaZulu-Natal", "city": "Durban", "address": "Shop F092, Gateway Theatre of Shopping, 1 Palm Blvd, Umhlanga Ridge, Durban, 4319" },
    { "id": 26, "name": "Van Schaik Bookstore South Coast Mall", "lat": -30.79563, "lng": 30.45244, "province": "KwaZulu-Natal", "city": "Shelly Beach", "address": "Shop 133, South Coast Mall, Izotsha Rd, Shelly Beach, 4265" },
    { "id": 27, "name": "Van Schaik Bookstore Midlands Mall", "lat": -29.57493, "lng": 30.36689, "province": "KwaZulu-Natal", "city": "Pietermaritzburg", "address": "Shop 212, Upper Level, Liberty Midlands Mall, 50 Sanctuary Rd, Pietermaritzburg, 3201" },
    { "id": 28, "name": "Van Schaik Bookstore Galleria Mall", "lat": -30.05562, "lng": 30.89055, "province": "KwaZulu-Natal", "city": "Amanzimtoti", "address": "Shop G089, Lower Level, Galleria Mall, Cnr Moss Kolnik & Arbour Rd, Amanzimtoti, 4126" },
    { "id": 29, "name": "Van Schaik Bookstore Empangeni", "lat": -28.76865, "lng": 31.89273, "province": "KwaZulu-Natal", "city": "Empangeni", "address": "Shop 7, Empangeni Plaza, 41 Turnbull St, Empangeni, 3880" },
    { "id": 30, "name": "Van Schaik Bookstore Richards Bay", "lat": -28.78336, "lng": 32.04554, "province": "KwaZulu-Natal", "city": "Richards Bay", "address": "Shop 15, Boardwalk Mall, Kruger Rand Rd, Richards Bay, 3900" },


  
      // Add more stores here
    ];
    
    
    setStores(southAfricaStores);
  }, [isLoaded]);

  useEffect(() => {
    if (selectedProvince && selectedCity) {
      // Find the first store in the selected province and city to set as the map center
      const selectedStore = stores.find(store => store.province === selectedProvince && store.city === selectedCity);
      if (selectedStore) {
        setMapCenter({ lat: selectedStore.lat, lng: selectedStore.lng });
      }
    }
  }, [selectedProvince, selectedCity, stores]);

  const handleStoreClick = (store: Store) => {
    setSelectedStoreData(store);
    setMapCenter({ lat: store.lat, lng: store.lng });
  };

  const handleAutocompleteSelect = () => {
    if (!autocomplete.current) return;

    const place = autocomplete.current.getPlace();
    if (!place.geometry || !place.geometry.location) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const store = stores.find(s => s.lat === lat && s.lng === lng);
    if (store) {
      setMapCenter({ lat, lng });
      setSelectedStoreData(store);
    }
  };

  const handleUseCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
  
        // Calculate distances between the user's location and each store
        const storesWithDistances = stores.map(store => {
          const distance = calculateDistance(userLat, userLng, store.lat, store.lng);
          return { ...store, distance };
        });
  
        // Sort stores by distance (nearest first)
        storesWithDistances.sort((a, b) => a.distance - b.distance);
  
        // Select the 5 nearest stores
        const nearestStores = storesWithDistances.slice(0, 5);
  
        // Update map center to the first nearest store
        const nearestStore = nearestStores[0];
        if (nearestStore) {
          setMapCenter({ lat: nearestStore.lat, lng: nearestStore.lng });
          setSelectedStoreData(nearestStore);
        }
  
        // Set the nearest stores as the selected stores for the list
        setSelectedStores(nearestStores);
      },
      error => {
        console.error('Error getting user location:', error);
      }
    );
  };
  

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  if (loadError) return <div>Error loading Google Maps</div>;

  return (
    
    <div>
      {isLoaded ? (
        <div>
          <div>
            <select value={selectedProvince} onChange={e => setSelectedProvince(e.target.value)}>
              <option value="">Select Province</option>
              <option value="Western Cape">Western Cape</option>
              <option value="Gauteng">Gauteng</option>
              <option value="KwaZulu-Natal">KwaZulu-Natal</option>
              {/* Add more provinces if needed */}
            </select>
            {selectedProvince && (
              <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)}>
                <option value="">Select City</option>
                {stores
                .filter(store => store.province === selectedProvince)
                .reduce((uniqueCities: string[], store) => {
                  if (!uniqueCities.includes(store.city)) {
                    uniqueCities.push(store.city);
                  }
                  return uniqueCities;
                }, [])
                .map((city, index) => (
                  <option key={`${city}-${index}`} value={city}>{city}</option>
                ))}
              </select>
            )}
          </div>
         
          <br />
          {selectedProvince && selectedCity && (
            <div className="flex">
              <div className="w-1/2 bg-gray-200 p-4">
            
              <Autocomplete onLoad={(autocompleteInstance) => { autocomplete.current = autocompleteInstance }} onPlaceChanged={handleAutocompleteSelect}>
                <input type="text" placeholder="Search for a store" />
              </Autocomplete>
              <MyMapComponent stores={stores} center={mapCenter} onStoreClick={handleStoreClick} selectedStoreData={selectedStoreData} />
              </div>
              <div className="w-1/2 bg-gray-300 p-4">
              <div className="p-4">
                <button className="btn bg-green-500 text-white px-4 py-2 rounded" onClick={handleUseCurrentLocation}>Closest to me</button>
                {selectedStores.length > 0 && (
                  <div className="p-4">
                    <h1><b>Nearest Stores</b></h1>
                    <ul>
                      {selectedStores.map(store => (
                        <li key={store.id} onClick={() => handleStoreClick(store)}
                        className={`cursor-pointer ${selectedStoreData && selectedStoreData.id === store.id ? 'font-bold text-orange-500' : ''}`}>
                          {store.name} - {store.city}
                          {store.distance !== undefined && (
                            <span> ({store.distance.toFixed(2)} km)</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
              {selectedStoreData && (
                <div className="p-4">
                  <h1><b>Selected Store Information</b></h1>
                  <p>ID: <b>{selectedStoreData.id}</b></p>
                  <p>Name: <b>{selectedStoreData.name}</b></p>
                  <p>Province: <b>{selectedStoreData.province}</b></p>
                  <p>City: <b>{selectedStoreData.city}</b></p>
                  <p>Latitude: <b>{selectedStoreData.lat}</b></p>
                  <p>Longitude: <b>{selectedStoreData.lng}</b></p>
                </div>
              )}

              {selectedProvince && (
                <div className="p-4">
                  <h1><b>Stores in {selectedProvince}</b></h1>
                  <ul>
                    {stores
                      .filter(store => store.province === selectedProvince)
                      .map(store => (
                        <li
                          key={store.id}
                          onClick={() => handleStoreClick(store)}
                          className={`cursor-pointer ${selectedStoreData && selectedStoreData.id === store.id ? 'font-bold text-orange-500' : ''}`}
                        >
                          {store.name} - {store.city}
                        </li>
                      ))}
                  </ul>
                  {selectedProvince && (
                    <p>Number of stores in {selectedProvince}: {stores.filter(store => store.province === selectedProvince).length}</p>
                  )}
                  {selectedCity && (
                    <p>Number of stores in {selectedCity}: {stores.filter(store => store.city === selectedCity).length}</p>
                  )}
                </div>
              )}
              </div>

            </div>
          )}


        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>  
  
  );
};

export default IndexPage;
