import { SingleLanguageLabels } from "./index"

const englishLabels: SingleLanguageLabels = {
  essay: {
    exampleAnswerLabel: "Answer example",
    userAnswerLabel: "Your answer",
    minimumWords: "Minimum number of words",
    currentNumberOfWordsLabel: "Words",
    textFieldLabel: "Your answer",
  },
  open: {
    placeholder: "Answer",
    userAnswerLabel: "Your answer",
  },
  peerReviews: {
    loadingLabel: "Loading",
    chooseButtonLabel: "Choose",
    chooseEssayInstruction: "Choose one of the essays for peer revie",
    givenPeerReviewsLabel: "Peer reviews given",
    noPeerAnswersAvailableLabel: "No answers available for peer review",
    reportAsInappropriateLabel: "Report as inappropriate",
    submitPeerReviewLabel: "Submit review",
    peerReviewsCompletedInfo: "All peer reviews have been submitted",
    extraPeerReviewsEncouragementLabel:
      "You have reviewed the minimum number of peer essays. You may continue to \
        review your peers' works, thereby increasing the probability of your own answer being selected by others!",
    displayPeerReview: "Add peer review",
    hidePeerReviewLabel: "Hide",
    quizInvolvesNoPeerReviewsInstruction: "This quiz involves no peer reviews",
  },
  unsupported: {
    notSupportedInsert: (itemType: string) =>
      `Question of type '${itemType}' is not supported.`,
  },
  multipleChoice: {
    chooseAllSuitableOptionsLabel: "Choose all suitable options",
  },
  stage: {
    answerStageLabel: "Answering the quiz",
    givingPeerReviewsStageLabel: "Giving peer reviews",
    receivingPeerReviewsStageLabel: "Receiving peer reviews",
    evaluationStageLabel: "Evaluating the answer",
  },
  general: {
    answerMissingBecauseQuizModifiedLabel:
      "Question not answered. Quiz has probably been modified after your answer.",
    submitButtonLabel: "Submit",
    errorLabel: "Error",
    loginPromptLabel: "Login to view the quiz",
    loadingLabel: "Loading",
    answerCorrectLabel: "The answer is correct",
    alreadyAnsweredLabel: "You have already answered",
    answerIncorrectLabel: "The answer is incorrect",
    kOutOfNCorrect: (k, n) => `${k}/${n} answers correct`,
    pointsAvailableLabel: "Points available in the quiz",
    pointsReceivedLabel: "Points awarded to you",
    incorrectSubmitWhileTriesLeftLabel:
      "The answer was incorrect - you may try again!",
    triesRemainingLabel: "Tries remaining",
  },
}

export default englishLabels