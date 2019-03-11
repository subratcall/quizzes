import React, { Component } from "react"
import axios from "axios"
import LikertScale from 'likert-react'
import { Button, Grid, Paper, TextField, Typography } from "@material-ui/core"
import 'likert-react/dist/main.css'

export default (props) => {

    let languageInfo = ((languageId) => {
        const languageOptions = {
            en_US: {
                choosePeerEssayLabel: "Choose",
                exampleAnswerLabel: "Answer example",
                givenPeerReviewsLabel: "Peer reviews given",
                loadingLabel: "Loading",
                noPeerAnswersAvailableLabel: "No answers available for peer review",
                reportAsInappropriateLabel: "Report as inappropriate",
                submitPeerReviewLabel: "Submit review",
                userAnswerLabel: "Your answer"
            },

            fi_FI: {
                chooseEssayLabel: "Valitse",
                exampleAnswerLabel: "Esimerkkivastaus",
                givenPeerReviewsLabel: "Vertaisarvioita annettu",
                loadingLabel: "Ladataan",
                noPeerAnswersAvailableLabel: "Vertaisarvioitavia vastauksia ei saatavilla",
                reportAsInappropriateLabel: "Ilmoita asiaton vastaus",
                submitPeerReviewLabel: "Lähetä vertaisarvio",
                userAnswerLabel: "Vastauksesi"
            }
        }

        const result = languageOptions[languageId]
        return result !== undefined
            ? result
            : languageOptions.en_US
    })(props.languageId)

    const {
        answered,
        handleTextDataChange,
        submitMessage,
        textData,
        ...other
    } = props

    return (
        answered
            ?
            <div>
                <Typography variant="subtitle1" >{languageInfo.userAnswerLabel}</Typography>
                <Paper style={paper} >
                    <Typography variant="body1" >{textData}</Typography>
                </Paper>
                <Typography variant="subtitle1" >{languageInfo.exampleAnswerLabel}</Typography>
                <Paper style={paper} >
                    <Typography variant="body1" dangerouslySetInnerHTML={{ __html: submitMessage }} />
                </Paper>
                <PeerReviews {...other} answered={answered} languageInfo={languageInfo} />
            </div>
            :
            <div>
                <TextField
                    value={textData}
                    onChange={handleTextDataChange}
                    fullWidth={true}
                    multiline={true}
                    margin="normal"
                />
            </div>
    )
}

class PeerReviews extends Component {
    state = {
        peerReview: undefined,
        answersToReview: undefined,
        submitDisabled: true,
        submitLocked: true
    }

    componentDidMount() {
        this.fetchAnswersToReview()
    }

    fetchAnswersToReview = async () => {
        const response = await axios.get(
            `https://quizzes.mooc.fi/api/v1/quizzes/peerreview/${this.props.quizId}/${this.props.languageId}`,
            { headers: { authorization: `Bearer ${this.props.accessToken}` } }
        )
        this.setState({ answersToReview: response.data })
    }

    flagAsSpam = (quizAnswerId) => async (event) => {
        this.setState({ answersToReview: undefined })
        await axios.post(
            "https://quizzes.mooc.fi/api/v1/quizzes/spamflag",
            { quizAnswerId },
            { headers: { authorization: `Bearer ${this.props.accessToken}` } }
        )
        await this.fetchAnswersToReview()
    }

    selectAnswer = (quizAnswerId) => (event) => {
        const peerReview = {
            quizAnswerId,
            peerReviewQuestionCollectionId: this.props.peerReviewQuestions[0].id,
            rejectedQuizAnswerIds: [this.state.answersToReview.find(answer => answer.id != quizAnswerId).id],
            answers: this.props.peerReviewQuestions[0].questions.map(question => { return { peerReviewQuestionId: question.id } })
        }
        this.setState({
            peerReview,
            submitLocked: false
        })
    }

    handlePeerReviewGradeChange = (peerReviewQuestionId) => (question, value) => {
        const answers = this.state.peerReview.answers.map(answer => {
            if (answer.peerReviewQuestionId === peerReviewQuestionId) {
                const updated = { ...answer }
                updated.value = value
                return updated
            }
            return answer
        })
        const peerReview = this.state.peerReview
        const submitDisabled = answers.find(answer => !answer.hasOwnProperty("value")) ? true : false
        this.setState({
            peerReview: { ...peerReview, ...{ answers } },
            submitDisabled
        })
    }

    submitPeerReview = async () => {
        this.setState({ submitDisabled: true, submitLocked: true })
        const response = await axios.post(
            "https://quizzes.mooc.fi/api/v1/quizzes/peerreview",
            this.state.peerReview,
            { headers: { authorization: `Bearer ${this.props.accessToken}` } }
        )
        await this.fetchAnswersToReview()
        this.props.setUserQuizState(response.data.userQuizState)
        this.setState({ peerReview: undefined })
    }

    render() {

        const peerReview = this.state.peerReview

        const answersToReview = peerReview
            ? this.state.answersToReview.filter(answer => answer.id === peerReview.quizAnswerId)
            : this.state.answersToReview

        return (
            <div>
                <Typography variant="subtitle1" >{this.props.peerReviewQuestions[0].texts[0].body}</Typography>
                <Typography variant="subtitle1" >Vertaisarvioita annettu: {this.props.peerReviewsGiven}/{this.props.peerReviewsRequired}</Typography>
                <Typography variant="subtitle1" >{this.props.languageInfo.givenPeerReviewsLabel}: {this.props.peerReviewsGiven}/{this.props.peerReviewsRequired}</Typography>
                {!answersToReview
                    ? <Typography>{this.props.languageInfo.loadingLabel}{this.props.languageInfo.loadingLabel}</Typography>
                    : answersToReview.length === 0
                        ? <Typography>{this.props.languageInfo.noPeerAnswersAvailableLabel}</Typography>
                        : answersToReview.map(answer =>
                            <div key={answer.id} >
                                <Paper style={paper} >
                                    <Typography variant="body1" >{answer.itemAnswers[0].textData}</Typography>
                                </Paper>
                                {peerReview
                                    ? <div>
                                        {this.props.peerReviewQuestions[0].questions.map(question => {
                                            return <LikertScale
                                                key={question.id}
                                                reviews={[{ question: question.texts[0].title }]}
                                                onClick={this.handlePeerReviewGradeChange(question.id)}
                                            />
                                        })}
                                        <Button
                                            disabled={this.state.submitLocked ? true : this.state.submitDisabled}
                                            onClick={this.submitPeerReview}
                                        >
                                            {this.props.languageInfo.submitPeerReviewLabel}
                                        </Button>
                                    </div>
                                    : <Grid container >
                                        <Grid item xs={3}>
                                            <Button onClick={this.flagAsSpam(answer.id)}>{this.props.languageInfo.reportAsInappropriateLabel}</Button>
                                        </Grid>
                                        <Grid item xs={8}></Grid>
                                        <Grid item xs={1}>
                                            <Button onClick={this.selectAnswer(answer.id)}>{this.props.languageInfo.chooseEssayLabel}</Button>
                                        </Grid>
                                    </Grid>
                                }
                            </div>
                        )}
            </div>
        )
    }
}

const paper = {
    padding: 10,
    margin: 10
}
