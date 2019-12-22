import React from "react";
import { Text, View } from "react-native";
import axios from "axios";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel
} from "react-native-simple-radio-button";
import { Button } from "react-native-elements";

import ResultScreen from "./ResultScreen";

export default class QuizScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      next: 0,
      marks: 0,
      numberOfQuestions: null,
      time: {
        minutes: 0,
        seconds: 0
      },
      finalResult: null,
      data: [],
      value3Index: 0,
      value: null,
      selected: -1,
      changeOption: true,
      loading: true
    };

    this.clickNext = this.clickNext.bind(this);
    this.playAgain = this.playAgain.bind(this);
  }

  componentDidMount() {
    axios(
      `https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple`
    )
      .then(result => {
        console.log(result);
        this.setState({
          data: result.data.results,
          numberOfQuestions: result.data.results.length,
          loading: false
        });
      })
      .catch(error => {
        this.setState({ error });
        alert(error.message);
      });

    this.timer = setInterval(() => {
      this.increaseSecond();
    }, 1000);
  }

  increaseSecond = () => {
    let {
      time: { minutes, seconds }
    } = this.state;
    if (seconds < 59) {
      seconds += 1;
    } else {
      seconds = 0;
      minutes += 1;
    }
    this.setState({
      time: { minutes, seconds }
    });
  };

  clickNext() {
    const { next, value, marks, numberOfQuestions } = this.state;
    if (value !== null) {
      this.setState(
        {
          next: next + 1,
          selected: -1,
          changeOption: false
        },
        () => {
          this.setState({ changeOption: true, value: null });
        }
      );
      if (value === 1) {
        this.setState({
          marks: marks + 1
        });
      }
      if (next === numberOfQuestions - 1) {
        clearInterval(this.timer);
      }
    } else {
      alert("Please Select an Option");
    }
  }

  playAgain() {
    // const { time } = this.state;
    this.setState({
      next: 0,
      time: {
        minutes: 0,
        seconds: 0
      },
      marks: 0
    });
    this.timer = setInterval(() => {
      this.increaseSecond();
    }, 1000);
  }

  render() {
    const {
      data,
      next,
      marks,
      numberOfQuestions,
      time: { minutes, seconds },
      selected,
      changeOption,
      loading
    } = this.state;
    const { goHome } = this.props;

    return (
      <View style={{ flex: 1 }}>
        {loading ? (
          <View>
            <Text>Loading...</Text>
          </View>
        ) : null}
        {next === numberOfQuestions ? (
          <View style={{ flex: 1 }}>
            <ResultScreen
              playAgain={this.playAgain}
              goHome={()=>goHome()}
              marks={marks}
              minutes={minutes}
              seconds={seconds}
            />
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            {data.length > 0 && (
              <View style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ marginLeft: 5, marginTop: 5 }}>
                    {`${minutes} min ${seconds} sec \n`}
                  </Text>
                  <Text style={{ marginLeft: 5, marginRight: 5, fontSize: 18 }}>
                    {`${next + 1}. ${data[next].question} \n \n`}
                  </Text>

                  {changeOption && (
                    <View style={{ marginLeft: 15 }}>
                      <RadioForm
                        radio_props={[
                          { label: data[next].incorrect_answers[0], value: 0 },
                          { label: data[next].correct_answer, value: 1 },
                          { label: data[next].incorrect_answers[1], value: 2 },
                          { label: data[next].incorrect_answers[2], value: 3 }
                        ]}
                        initial={selected}
                        buttonColor={"#39C9BB"}
                        selectedButtonColor={"#39C9BB"}
                        buttonSize={20}
                        onPress={value => {
                          this.setState({ value: value });
                        }}
                      />
                    </View>
                  )}
                </View>
                <View
                  style={{
                    width: 200,
                    fontWeight: "bold",
                    marginLeft: "auto",
                    marginRight: "auto",
                    marginTop: 0,
                    marginBottom: 40
                  }}
                >
                  <Button
                    onPress={this.clickNext}
                    title="Next"
                    backgroundColor="#39C9BB"
                    type="outline"
                    buttonStyle={{
                      borderColor: "#39C9BB"
                    }}
                  />
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    );
  }
}
