import React from "react";
import { StyleSheet, Text, View } from "react-native";

import CameraScreen from "./Components/CameraScreen";
import QuizScreen from "./Components/QuizScreen";

console.disableYellowBox = true;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cameraShow: true,
      quiz: false
    };

    this.startQuiz = this.startQuiz.bind(this);
    this.goHome = this.goHome.bind(this);
  }

  startQuiz() {
    this.setState({ cameraShow: false, quiz: true });
  }

  goHome() {
    this.setState({ cameraShow: true, quiz: false });
  }

  render() {
    const { cameraShow, quiz } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTextStyle}>Quiz App</Text>
        </View>
        {cameraShow ? <CameraScreen startQuiz={this.startQuiz} /> : null}
        {quiz ? <QuizScreen goHome={this.goHome} /> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  header: {
    backgroundColor: "#39C9BB",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22
  },
  headerTextStyle: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold"
  },
  firstScreen: {
    flex: 1
  },
  startingText: {
    marginLeft: 10,
    marginTop: 10,
    fontSize: 18,
    textAlign: "justify"
  }
});
