import pahoMqtt from "paho-mqtt";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  ScrollView,
  StyleSheet,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
const client = new pahoMqtt.Client("broker.hivemq.com", Number(8000),`mqtt-random-${parseInt(Math.random() * 100)}`);

export default function App() {
  const [newTopic, setNewTopic] = useState("");
  const [oxygene, setOxygene] = useState([]);
  const [steps, setSteps] = useState([]);
  const [temperature, setTemperature] = useState([]);
  const [frequence, setFrequence] = useState([]);
  const [pression, setPression] = useState([]);
 
  const fetch = () => {
    axios
      .get("http://192.168.0.3:3000/getpression")
      .then((res) => setPression(res.data));
    axios
      .get("http://192.168.0.3:3000/gettemperature")
      .then((res) => setTemperature(res.data));
    axios
      .get("http://192.168.0.3:3000/geto2")
      .then((res) => setOxygene(res.data));
    axios
      .get("http://192.168.0.3:3000/getsteps")
      .then((res) => setSteps(res.data));
    axios
      .get("http://192.168.0.3:3000/getfrequence")
      .then((res) => setFrequence(res.data));
  };

  useEffect(() => {
    fetch();
  }, []);

  const [subscribedTopics, setSubscribedTopics] = useState([
    { name: "hc/temp", messages: [] },
    { name: "hc/freq", messages: [] },
    { name: "hc/steps", messages: [] },
    { name: "hc/o2", messages: [] },
    { name: "hc/pres", messages: [] },
  ]);
  const onMessage = (data) => {
    console.log(subscribedTopics);
    const foundIndex = subscribedTopics.findIndex(
      (x) => x.name == data.destinationName
    );
    console.log(foundIndex);
    if (foundIndex != -1) {
      const cpy = [...subscribedTopics];
      cpy[foundIndex].messages.push({
        value: data.payloadString,
        date: new Date(),
      });
      console.log(cpy);

      setSubscribedTopics(cpy);
    }
  };
  client.onMessageArrived = onMessage;
  useEffect(() => {
    client.connect({
      onSuccess: () => {
        console.log("connected succefully");
        subscribedTopics.forEach((el) => client.subscribe(el.name));
      },
      onFailure: () => {
        console.log("Connection failed");
      },
    });
  }, []);

  const [msg, setMsg] = useState("initial msg");

  return (
    <ScrollView style={{ marginTop: StatusBar.currentHeight }}>
      <Text style={{ alignSelf: "center" }}>Welcome to my MQTT!</Text>
      <TextInput
        style={{
          borderWidth: 1,
          width: "80%",
          borderRadius: 10,
          margin: 5,
          alignSelf: "center",
        }}
        onChangeText={(t) => setNewTopic(t)}
      ></TextInput>
      <TouchableOpacity
        style={{
          backgroundColor: "brown",
          padding: 10,
          marginRight: 20,
          marginLeft: 20,
          borderRadius: 10,
        }}
        onPress={() => {
          setSubscribedTopics((current) => [
            ...current,
            { name: newTopic, messages: [] },
          ]);

          client.subscribe(newTopic);
        }}
      >
        <Text style={{ color: "white", fontSize: 16, textAlign: "center" }}>
          Subscribe to new topic
        </Text>
      </TouchableOpacity>
      <View style={{ height: 500 }}>
        <ScrollView
          horizontal
          style={{ display: "flex", flexDirection: "row" }}
        >
          {subscribedTopics.map((el, i) => (
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                borderWidth: 1,
                borderRadius: 10,
                marginRight: 5,
                marginTop: 10,
                marginLeft: 5,
                padding: 10,
              }}
              key={i}
            >
              <Text style={{ color: "red", fontWeight: "500" }}>{el.name}</Text>

              <ScrollView>
                {el.messages.map((data, index) => (
                  <View
                    style={{
                      borderWidth: 1,
                      padding: 5,
                      borderRadius: 5,
                      backgroundColor: "#efefef",
                      marginTop: 10,
                    }}
                    key={index}
                  >
                    <Text>
                      value :{" "}
                      <Text style={{ fontSize: 17, fontWeight: "700" }}>
                        {data.value}
                      </Text>
                    </Text>
                    <Text>
                      {new Date(data.date).toLocaleDateString() +
                        " " +
                        new Date(data.date).toLocaleTimeString()}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          ))}
        </ScrollView>
      </View>
      <TouchableOpacity style={{backgroundColor:"red",padding:10,width:100}}  onPress={() => fetch()}>
        <Text >Refetch</Text>
      </TouchableOpacity>
      <Text style={{margin:20,fontSize:20,width:160,padding:20,backgroundColor:"yellow"}}>Temperatures</Text>
      {temperature.map((el) => (
        <Text>{el.valeur}</Text>
      ))}
      <Text style={{margin:20,fontSize:20,width:160,padding:20,backgroundColor:"yellow"}}>pression</Text>
      {pression.map((el) => (
        <Text>{el.valeur}</Text>
      ))}
      <Text style={{margin:20,fontSize:20,width:160,padding:20,backgroundColor:"yellow"}}>o2</Text>
      {oxygene.map((el) => <Text>{el.valeur}</Text>)}
      <Text style={{margin:20,fontSize:20,width:160,padding:20,backgroundColor:"yellow"}}>steps</Text>
      {steps.map((el) => <Text>{el.valeur}</Text>)}
      <Text style={{margin:20,fontSize:20,width:160,padding:20,backgroundColor:"yellow"}}>oxygene</Text>
      {oxygene.map((el) => <Text>{el.valeur}</Text>)}
      <Text style={{margin:20,fontSize:20,width:160,padding:20,backgroundColor:"yellow"}}>frequence</Text>
      {frequence.map((el) => <Text>{el.valeur}</Text>)}
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
