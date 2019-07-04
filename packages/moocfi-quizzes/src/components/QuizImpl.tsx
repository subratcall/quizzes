import * as React from "react"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { Button, CircularProgress, Grid, Typography } from "@material-ui/core"
import * as quizAnswerActions from "../state/quizAnswer/actions"
import * as messageActions from "../state/message/actions"

import { initialize } from "../state/actions"
import Checkbox from "./CheckboxOption"
import Feedback from "./Feedback"
import MultipleChoice from "./MultipleChoice"
import ResearchAgreement from "./ResearchAgreement"
import Scale from "./Scale"
import Open from "./Open"
import Essay from "./Essay"
import StageVisualizer from "./PeerReviews/StageVisualizer"
import PeerReviews from "./PeerReviews"
import Unsupported from "./Unsupported"
import { useTypedSelector } from "../state/store"
import { SpaciousTypography } from "./styleComponents"
import { Quiz, QuizItemType, QuizItemAnswer } from "../modelTypes"

const componentsByTypeNames = (typeName: QuizItemType) => {
  const mapTypeToComponent = {
    essay: Essay,
    "multiple-choice": MultipleChoice,
    scale: Scale,
    checkbox: Checkbox,
    open: Open,
    "research-agreement": ResearchAgreement,
    feedback: Feedback,
    "custom-frontend-accept-data": Unsupported,
  }

  return mapTypeToComponent[typeName]
}

export interface QuizProps {
  id: string
  languageId: string
  accessToken: string
}

const FuncQuizImpl: React.FunctionComponent<QuizProps> = ({
  id,
  languageId,
  accessToken,
}) => {
  const submitLocked = useTypedSelector(state => state.quizAnswer.submitLocked)
  const error = useTypedSelector(state => state.message)
  const quizAnswer = useTypedSelector(state => state.quizAnswer.quizAnswer)
  const quiz = useTypedSelector(state => state.quiz)
  const languageInfo = useTypedSelector(state => state.language.languageLabels)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initialize(id, languageId, accessToken))
  }, [])

  if (!quiz || !languageInfo) {
    return <div />
  }

  const generalLabels = languageInfo.general

  const handleSubmit = () => dispatch(quizAnswerActions.submit())

  const hasCorrectAnswer = (quiz: Quiz) => {
    return quiz.items.some(
      item =>
        item.type === "essay" ||
        item.type === "multiple-choice" ||
        item.type === "open",
    )
  }

  const atLeastOneCorrect = (itemAnswers: QuizItemAnswer[]) =>
    itemAnswers.some(ia => ia.correct === true)

  const quizContainsEssay = () => {
    return quiz.items.some(ia => ia.type === "essay")
  }

  const quizItemComponents = (quiz: Quiz, languageId: string) => {
    return (
      <>
        {quiz.items
          .sort((i1, i2) => i1.order - i2.order)
          .map(item => {
            const ItemComponent = componentsByTypeNames(item.type)

            return <ItemComponent item={item} key={item.id} />
          })}
      </>
    )
  }

  if (!accessToken) {
    return <div>{generalLabels.loginPromptLabel}</div>
  }

  if (error) {
    return (
      <div>
        {generalLabels && generalLabels.errorLabel}
        <pre>{error}</pre>
      </div>
    )
  }

  if (!quizAnswer || !quiz) {
    return (
      <Grid container={true} justify="center">
        <Grid item={true}>
          <CircularProgress disableShrink={true} />
        </Grid>
      </Grid>
    )
  }

  if (quiz.texts.length === 0) {
    const message =
      "Error: quiz has no texts. (Likely the quiz does not match the requested " +
      "language id)"
    dispatch(messageActions.set(message))
    return <div />
  }

  const types = quiz.items.map(item => item.type)

  return (
    <div>
      <SpaciousTypography variant="h5">
        {quiz.texts[0].title}
      </SpaciousTypography>
      <SpaciousTypography
        variant="body1"
        dangerouslySetInnerHTML={{ __html: quiz.texts[0].body }}
      />

      <div>
        {quizContainsEssay() && <StageVisualizer />}

        {quizItemComponents(quiz, languageId)}

        {quizAnswer.id ? (
          <>
            {quizContainsEssay() && <PeerReviews />}

            <Typography variant="h5">
              {hasCorrectAnswer(quiz)
                ? atLeastOneCorrect(quizAnswer.itemAnswers)
                  ? quiz.items.length === 1
                    ? generalLabels.answerCorrectLabel
                    : generalLabels.kOutOfNCorrect(
                        quizAnswer.itemAnswers.filter(ia => ia.correct === true)
                          .length,
                        quiz.items.length,
                      )
                  : types.includes("essay") || types.includes("scale")
                  ? ""
                  : generalLabels.answerIncorrectLabel
                : generalLabels.alreadyAnsweredLabel}
            </Typography>
          </>
        ) : (
          <div>
            <Button
              variant="contained"
              color="primary"
              disabled={submitLocked}
              onClick={handleSubmit}
            >
              {generalLabels.submitButtonLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default FuncQuizImpl
