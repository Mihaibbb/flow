import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';
import io from "socket.io-client";


export default function App() {

  const [location, setLocation] = useState();
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [lights, setLights] = useState(null);

  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMessage('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({  });
      console.log("Location: ", location);
      setLatitude(location.coords.latitude)
      setLongitude(location.coords.longitude);
      setLocation(location.coords);
    })();
  }, []);

  useEffect(() => {
    const socket = io("http://server.mihaibarbu.com/");

    socket.on("connect", () => {     
      console.log("Connect", socket.id);
      socket.emit("connect_mobile", socket.id);

      socket.on("mesaj", (data) => {
        console.warn(data);
        setLights(data);
      });

    });
  }, []);

  const handleRegionChange = () => {
    
  };  

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map} 
        zoomEnabled={true} 
        region={{
          latitude: latitude || 0.01212432,
          longitude: longitude || 0.5458934,
          latitudeDelta: 0.0322,
          longitudeDelta: 0.0221
        }}  
        onRegionChangeComplete={handleRegionChange}
      >
         <Marker
            coordinate={{
              latitude: latitude || 0,
              longitude: longitude || 0
            }}
            title={"title"}
            description={"description"}
            pinColor={"purple"}
         />  

         {lights && lights.length && lights.map(light => (
          <>
            <Marker 
              coordinate={{
                latitude: light.lat || 0,
                longitude: light.long || 0
              }}
              title={""}
            >
              <View style={[styles.customMarker, { backgroundColor: light.traffic0.toLowerCase() }]} />
            </Marker>

            <Marker
              coordinate={{
                latitude: light.lat + .0002 || 0,
                longitude: light.long + .0002 || 0,
              }}
            >
              <View style={[styles.customMarker, { backgroundColor: light.traffic1.toLowerCase() }]} />

            </Marker>

            <Marker
              coordinate={{
                latitude: light.lat + .0004 || 0,
                longitude: light.long + .0004 || 0,
              }}
            >
              <View style={[styles.customMarker, { backgroundColor: light.traffic2.toLowerCase() }]} />

            </Marker>

            <Marker
              coordinate={{
                latitude: light.lat + .0004 || 0,
                longitude: light.long + .0004 || 0,
              }}
            >
              <View style={[styles.customMarker, { backgroundColor: light.traffic3.toLowerCase() }]} />

            </Marker>
          </>
         ))}
      </MapView>  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },

  customMarker: {
    width: 35,
    height: 35,
    borderRadius: 35
  }
});