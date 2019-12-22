import React, { Component } from "react";
import { Text, View, Modal, Alert, StyleSheet } from "react-native";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import * as FaceDetector from "expo-face-detector";

import { Icon, Button } from "react-native-elements";

export default class CameraScreen extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.front,
    modalVisible: false,
    showButton: false
  };

  setModalVisible(visible, buttonShow) {
    this.setState({
      modalVisible: visible,
      showButton: buttonShow
    });
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  click = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();
      const options = { mode: FaceDetector.Constants.Mode.fast };
      const result = await FaceDetector.detectFacesAsync(photo.uri, options);
      console.log("result", result);
      if (result.faces.length > 0) {
        console.log("Match found");

        this.setModalVisible(true, true);
      } else {
        console.log("No match found");

        this.setModalVisible(true);
      }
    }
  };

  render() {
    const { hasCameraPermission, showButton } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            ref={ref => (this.camera = ref)}
            style={{ flex: 1 }}
            type={this.state.type}
          >
            <View
              style={{
                flex: 1,
                // flexDirection: 'column',
                justifyContent: "flex-end",
                alignItems: "center"
              }}
            >
              <Icon
                reverse
                name="camera"
                type="material-community"
                color="#ffffff00"
                size={48}
                onPress={this.click}
              />
            </View>
          </Camera>

          <View style={{ marginTop: 0 }}>
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
              }}
            >
              <View style={{ marginTop: 155 }}>
                <View>
                  {showButton ? (
                    <View style={styles.startButton}>
                      <Button
                        onPress={this.props.startQuiz}
                        title="Start Quiz"
                        buttonStyle={{
                          width: 300,
                          backgroundColor: "#39C9BB",
                          borderRadius: 50,
                          marginLeft: "auto",
                          marginRight: "auto",
                          marginBottom: 0
                        }}
                      />
                    </View>
                  ) : (
                    <Text style={styles.errorText}>No face found!</Text>
                  )}
                  <View style={styles.hideModal}>
                    <Button
                      onPress={() => {
                        this.setModalVisible(!this.state.modalVisible);
                      }}
                      title="Back To Camera"
                      buttonStyle={{
                        width: 300,
                        backgroundColor: "#39C9BB",
                        borderRadius: 50,
                        marginLeft: "auto",
                        marginRight: "auto",
                        marginBottom: 0
                      }}
                    />
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  startButton: {
    marginTop: 50,
    marginBottom: 50
  },
  errorText: {
    marginLeft: "auto",
    marginRight: "auto",
    fontSize: 25,
    width: 300,
    textAlign: "center",
    fontWeight: "bold"
  },
  hideModal: {
    marginTop: 20
    // marginBottom: 'auto'
  }
});
