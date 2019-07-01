import * as React from "react"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { Button, Typography } from "@material-ui/core"
import * as quizAnswerActions from "../state/quizAnswer/actions"
import { initialize } from "../state/actions"
import Checkbox from "./CheckboxOption"
import Feedback from "./Feedback"
import MultipleChoice from "./MultipleChoice"
import ResearchAgreement from "./ResearchAgreement"
import Scale from "./Scale"
import Open from "./Open"
import Essay from "./Essay"
import StageVisualizer from "./Essay/StageVisualizer"
import PeerReviews from "./Essay/PeerReviews"
import Unsupported from "./Unsupported"
import { wordCount } from "../utils/string_tools"
import { useTypedSelector } from "../state/store"
import { Quiz } from "../state/quiz/reducer"
import { SpaciousTypography } from "./styleComponents"

export type ComponentName =
  | "essay"
  | "multiple-choice"
  | "scale"
  | "checkbox"
  | "open"
  | "research-agreement"
  | "feedback"
  | "custom-frontend-accept-data"

const componentType = (typeName: ComponentName) => {
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

export interface Props {
  id: string
  languageId: string
  accessToken: string
  baseUrl: string
}

const FuncQuizImpl: React.FunctionComponent<Props> = ({
  id,
  languageId,
  accessToken,
}) => {
  const submitLocked = useTypedSelector(state => state.submitLocked)
  const error = useTypedSelector(state => state.message)
  const quizAnswer = useTypedSelector(state => state.quizAnswer)
  const quiz = useTypedSelector(state => state.quiz)
  const languageLabels = useTypedSelector(
    state => state.language.languageLabels,
  )
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initialize(id, languageId, accessToken))
  }, [])

  const handleTextDataChange = (itemId: string) => (
    e: React.FormEvent<HTMLInputElement>,
  ) => dispatch(quizAnswerActions.changeTextData(itemId, e.currentTarget.value))

  const handleIntDataChange = (itemId: string) => (
    e: React.FormEvent<HTMLInputElement>,
  ) =>
    dispatch(
      quizAnswerActions.changeIntData(itemId, Number(e.currentTarget.value)),
    )

  const handleCheckboxToggling = (itemId: string) => (optionId: string) => () =>
    dispatch(quizAnswerActions.changeCheckboxData(itemId, optionId))

  const handleOptionChange = (itemId: string) => (optionId: string) => () =>
    dispatch(quizAnswerActions.changeChosenOption(itemId, optionId))

  const handleSubmit = () => dispatch(quizAnswerActions.submit())

  // not all quizzess have correct solutions - e.g. self-evaluation
  const hasCorrectAnswer = quiz => {
    return quiz.items.some(
      item =>
        item.type === "essay" ||
        item.type === "multiple-choice" ||
        item.type === "open",
    )
  }

  const atLeastOneCorrect = itemAnswers =>
    itemAnswers.some(ia => ia.correct === true)

  const submitDisabled = () => {
    const itemsSubmittable = quiz.items.map(item => {
      const itemAnswer = quizAnswer.itemAnswers.find(
        ia => ia.quizItemId === item.id,
      )
      if (!itemAnswer) {
        return false
      }
      if (
        item.type === "essay" ||
        item.type === "open" ||
        item.type === "feedback"
      ) {
        if (!itemAnswer.textData) return false
        const words = wordCount(itemAnswer.textData)
        if (item.minWords && words < item.minWords) return false

        if (item.maxWords && words > item.maxWords) return false
        return true
      }
      if (item.type === "multiple-choice") {
        return itemAnswer.optionAnswers.length > 0
      }
      if (item.type === "scale") {
        return itemAnswer.intData ? true : false
      }
      if (item.type === "checkbox" || item.type === "research-agreement") {
        return itemAnswer.optionAnswers.length > 0
      }
      return undefined
    })

    return itemsSubmittable.includes(false)
  }

  const quizContainsEssay = () => {
    return quiz.items.some(ia => ia.type === "essay")
  }

  const quizItemComponents = (quiz: Quiz, languageId: string) => {
    return (
      <>
        {quiz.items
          .sort((i1, i2) => i1.order - i2.order)
          .map(item => {
            const itemAnswer = quizAnswer.itemAnswers.find(
              ia => ia.quizItemId === item.id,
            )
            if (!itemAnswer) {
              return []
            }
            const ItemComponent = componentType(item.type)

            return (
              <ItemComponent
                item={item}
                key={item.id}
                intData={itemAnswer.intData}
                textData={itemAnswer.textData}
                optionAnswers={itemAnswer.optionAnswers}
                correct={itemAnswer.correct}
                handleTextDataChange={handleTextDataChange(item.id)}
                handleIntDataChange={handleIntDataChange(item.id)}
                handleOptionChange={handleOptionChange(item.id)}
                handleCheckboxToggling={handleCheckboxToggling(item.id)}
              />
            )
          })}
      </>
    )
  }

  if (!accessToken) {
    return <div>Kirjaudu sisään vastataksesi tehtävään</div>
  }

  if (error) {
    return (
      <div>
        Error
        <pre>{error}</pre>
      </div>
    )
  }

  if (!quizAnswer || !quiz) {
    return <div>Loading...</div>
  }

  if (quiz.texts.length === 0) {
    return <div>Error: quiz has no texts.</div>
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
                    ? "Tehtävä oikein"
                    : `Sait ${
                        quizAnswer.itemAnswers.filter(ia => ia.correct === true)
                          .length
                      }/${quiz.items.length} oikein`
                  : types.includes("essay") || types.includes("scale")
                  ? ""
                  : "Tehtävä väärin"
                : "Olet jo vastannut"}
            </Typography>
          </>
        ) : (
          <div>
            <Button
              variant="contained"
              color="primary"
              disabled={submitLocked ? true : submitDisabled()}
              onClick={handleSubmit}
            >
              Vastaa
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default FuncQuizImpl
