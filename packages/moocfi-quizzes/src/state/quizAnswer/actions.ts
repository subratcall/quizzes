import { ActionCreator } from "redux"
import { createAction } from "typesafe-actions"
import { ThunkAction, State } from "../store"
import { postAnswer } from "../../services/answerService"
import * as userActions from "../user/actions"
import * as quizActions from "../quiz/actions"
import { QuizAnswer, QuizItem } from "../../modelTypes"
import { wordCount } from "../../utils/string_tools"

export const set = createAction("quizAnswer/SET", resolve => {
  return (quizAnswer: QuizAnswer) => resolve(quizAnswer)
})

export const clear = createAction("quizAnswer/CLEAR")

export const setLocked = createAction("quizAnswer/SET_LOCKED", resolve => {
  return () => resolve()
})

export const changeTextDataAction = createAction(
  "quizAnswer/UPDATE_TEXT_VALUE",
  resolve => (itemId: string, newValue: string, readyToSubmit: boolean) =>
    resolve({ itemId, newValue, readyToSubmit }),
)

export const changeIntData = createAction(
  "quizAnswer/UPDATE_INT_VALUE",
  resolve => (itemId: string, newValue: number) =>
    resolve({ itemId, newValue }),
)

export const changeCheckboxData = createAction(
  "quizAnswer/TOGGLE_CHECKBOX_VALUE",
  resolve => (itemId: string, optionId: string) =>
    resolve({ itemId, optionId }),
)

export const chooseOption = createAction(
  "quizAnswer/CHOOSE_OPTION",
  resolve => (itemId: string, optionId: string, multi: boolean) =>
    resolve({ itemId, optionId, multi }),
)

export const changeChosenOption: ActionCreator<ThunkAction> = (
  itemId: string,
  optionId: string,
) => (dispatch, getState) => {
  const multi = getState().quiz.items.find(i => i.id === itemId).multi
  dispatch(chooseOption(itemId, optionId, multi))
}

export const changeTextData: ActionCreator<ThunkAction> = (
  itemId: string,
  newValue: string,
) => (dispatch, getState) => {
  const itemAnswer = getState().quizAnswer.quizAnswer.itemAnswers.find(
    qa => qa.quizItemId === itemId,
  )
  const item = getState().quiz.items.find(i => i.id === itemId)

  const readyToSubmit = itemAnswerReadyForSubmit(newValue, item)
  dispatch(changeTextDataAction(itemId, newValue, readyToSubmit))
}

export const submit: ActionCreator<ThunkAction> = () => async (
  dispatch,
  getState,
) => {
  const responseData = await postAnswer(
    getState().quizAnswer.quizAnswer,
    getState().user.accessToken,
  )

  // remember! Disable submit! Although it's not so necessary
  dispatch(setLocked())
  dispatch(set(responseData.quizAnswer))
  dispatch(quizActions.set(responseData.quiz))
  dispatch(userActions.setQuizState(responseData.userQuizState))
}

const itemAnswerReadyForSubmit = (textData: string, item: QuizItem) => {
  if (!item) {
    return false
  }
  if (!textData) return false
  const words = wordCount(textData)
  if (item.minWords && words < item.minWords) return false

  if (item.maxWords && words > item.maxWords) return false

  return true
}
