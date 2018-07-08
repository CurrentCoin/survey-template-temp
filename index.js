import React, { Component } from "react";
import * as Survey from "survey-react";
import axios from 'axios'

import "./survey.css"
import eventFeedbackSurvey from './eventFeedbackSurvey.json'
import conferenceFeedbackSurvey from './conferenceFeedbackSurvey.json'
import demoSurvey from './demoSurvey.json'
import courseFeedbackSurvey from './courseFeedbackSurvey.json'

const surveyTemplates = {
  eventFeedbackSurvey,
  conferenceFeedbackSurvey,
  demoSurvey,
  courseFeedbackSurvey,
}

// const survey = new Survey.Model(conferenceFeedbackSurvey);
//
// survey
//     .onComplete
//     .add(function (result) {
//         // document
//         //     .querySelector('#surveyResult')
//         //     .innerHTML = "result: " + JSON.stringify(result.data);
//
//         console.log(JSON.stringify(result.data))
//     });

// var storageName = "survey_patient_history";
// function saveSurveyData(survey) {
//     var data = survey.data;
//     data.pageNo = survey.currentPageNo;
//     window
//         .localStorage
//         .setItem(storageName, JSON.stringify(data));
// }
// survey
//     .onPartialSend
//     .add(function (survey) {
//         saveSurveyData(survey);
//     });
// survey
//     .onComplete
//     .add(function (survey, options) {
//         saveSurveyData(survey);
//     });
//
// survey.sendResultOnPageNext = true;
// var prevData = window
//     .localStorage
//     .getItem(storageName) || null;
// if (prevData) {
//     var data = JSON.parse(prevData);
//     survey.data = data;
//     if (data.pageNo) {
//         survey.currentPageNo = data.pageNo;
//     }
// }
// $("#surveyElement").Survey({model: survey});

class App extends Component {
  handleSubmit = surveyResult => {
    const to = this.props.yourEmail
    const subject = 'Survey Submission'

    // const text = Object.keys(this.state).reduce((emailText, fieldName) => (
    //   this.props[camelCase('show '.concat(fieldName))]
    //     ? emailText.concat(`${titleCase(fieldName)}: ${this.state[fieldName]}\n`)
    //     : emailText
    // ), '')

    const text = JSON.stringify(surveyResult.data)

    axios.post(
      `http://ec2-18-222-103-218.us-east-2.compute.amazonaws.com:3000/email`,
      {
        to,
        subject,
        text,
      },
      {
        headers: {
          'Content-type': 'Application/json',
          'Accept': 'Application/json',
        }
      }
    )
    .then(emailServerResponse => {
      console.log('emailServerResponse:', emailServerResponse)
      if (emailServerResponse.status === 200) {
        // this.props.handleDialogOpen(true)
        alert('email sent')
      } else {
        // this.props.handleDialogOpen(false)
        alert('email not sent')
      }
    })
    .catch(error => {
      console.log('error:', error)
      alert('email not sent')
      // this.props.handleDialogOpen(false)
    })
  }

  render() {
    // Choose between different templates
    var model = new Survey.Model(surveyTemplates[this.props.survey]);

    model
      .onComplete
      .add(this.handleSubmit)

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Survey</h1>
        </header>
        <Survey.Survey
            model={model}
            // onComplete={this.onComplete}
            // onValueChanged={this.onValueChanged}
          />

        {/* <script src="https://surveyjs.azureedge.net/1.0.29/survey.react.min.js" /> */}
        </div>
    );
  }
}

export default App;
