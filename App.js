import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, KeyboardAvoidingView, TouchableHighlight, Linking } from 'react-native';

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      resistance: "",
      voltage: "",
      current: "",
      power: "",
      lastTwo: [],
      buttonDisable: true,
    }
  }

  handleInput = (name, text) => {
    const {lastTwo} = this.state
    if (!lastTwo.includes(name)) {
      if (lastTwo.length <2 ) {
        lastTwo.push(name)
        var newArray = lastTwo
      } else { 
        newArray = [lastTwo[1], name]
      }
    } else {
      newArray = lastTwo
    }

    this.lastTwoCheck();

    this.setState({ 
      [name]:text,
      lastTwo: newArray
    })
  } 

  lastTwoCheck = () => {
    const {lastTwo, buttonDisable} = this.state
    if (lastTwo.length === 2 && buttonDisable) {
      this.setState({buttonDisable: false})
    }
  }

  calculate = () => {
    const {lastTwo} = this.state;
    const r = Number(this.state.resistance);
    const v = Number(this.state.voltage);
    const i = Number(this.state.current);
    const p = Number(this.state.power);
    const resistance = lastTwo.includes("resistance")
    const voltage = lastTwo.includes("voltage")
    const current = lastTwo.includes("current")
    const power = lastTwo.includes("power")
    if (resistance && voltage) {
      this.setState({
        current: this.rounder(v / r),
        power: this.rounder((v *  v) / r)
      })
    } else if (resistance && current) {
      this.setState({
        voltage: this.rounder(i * r),
        power: this.rounder((i * i) * r)
      })
    } else if (resistance && power) {
      this.setState({
        voltage: this.rounder(Math.sqrt(p * r)),
        current: this.rounder(Math.sqrt(p / r))
      })
    } else if (voltage && current) {
      this.setState({
        resistance: this.rounder(v / i),
        power: this.rounder(v * i)
      })
    } else if (voltage && power) {
      this.setState({
        resistance: this.rounder((v * v) / p),
        current: this.rounder(p / v)
      })
    } else if (current && power) {
      this.setState({
        resistance: this.rounder(p / (i * i)),
        voltage: this.rounder(p / i)
      })
    }  
  }

  rounder = (num) =>{
    var decimalPlace = num.toString().split('.')
    if (decimalPlace[1] && decimalPlace[1].length > 8) {
      return num.toFixed(8)
    }
    return num.toString()
  }

  clear = () => {
    this.setState({
      resistance: "",
      voltage: "",
      current: "",
      power: "",
      lastTwo: [],
      buttonDisable: true,
      test: "test"
    })
  }

  render() {
    const {buttonDisable, lastTwo} = this.state
    const resistance = lastTwo.includes("resistance") ? "green" : "black";
    const voltage = lastTwo.includes("voltage") ? "green" : "black";
    const current = lastTwo.includes("current") ? "green" : "black";
    const power = lastTwo.includes("power") ? "green" : "black";

    return (
      <KeyboardAvoidingView style={styles.container} >
        <Text style={styles.head}>Ohm's Law Calculator</Text>
        <View style={styles.boxes}>
          <View style={styles.smallerBox}>
            <Text style={{color: resistance}}>Resistance (Ohms): </Text>
            <TextInput selectTextOnFocus={true} keyboardType="numeric" style={styles.input} value={this.state.resistance} onChangeText={(text)=>this.handleInput('resistance', text)}/>
          </View>
          <View style={styles.smallerBox}>
            <Text style={{color: voltage}}>Voltage (Volts): </Text>
            <TextInput selectTextOnFocus={true} keyboardType="numeric" style={styles.input} value={this.state.voltage} onChangeText={(text)=>this.handleInput('voltage', text)}/>
          </View>
        </View>
        <View style={styles.boxes}>
          <View style={styles.smallerBox}>
            <Text style={{color: current}}>Current (Amperes): </Text>
            <TextInput selectTextOnFocus={true} keyboardType="numeric" style={styles.input} value={this.state.current} onChangeText={(text)=>this.handleInput('current', text)}/>
          </View>
          <View style={styles.smallerBox}>
            <Text style={{color: power}}>Wattage (Watts): </Text>
            <TextInput selectTextOnFocus={true} keyboardType="numeric" style={styles.input} value={this.state.power} onChangeText={(text)=>this.handleInput('power', text)}/>
          </View>
        </View>
        <View style={styles.boxes}>
          <TouchableHighlight style={styles.button} >
            <Button disabled={buttonDisable} title="Calculate" onPress={this.calculate}/>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} >
            <Button style={styles.button} title="Clear" onPress={this.clear} />
          </TouchableHighlight>
        </View>
        <Text onPress={()=> {Linking.openURL('https://bfojas.github.io/portfolio/')}}>
        bfojas.github.io/portfolio/
        </Text>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
  },

  head: {
    fontSize: 24,
  },

  boxes: {
    display: "flex",
    flex: .10,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 15,
  },

  smallerBox: {
    margin: 5,
    flex: 0.4,
    display: "flex",
    flexDirection: "column"
  },

  input: {
    height: 30,
    borderColor: 'black',
    backgroundColor: "white"
  },

  button: {
    height: 40,
    width: 125,
    borderRadius:10,
    margin: 20,
  },
});
