import { createAction } from "typesafe-actions"
import { EditableQuiz } from "../../../types/EditQuiz"

export const setInitialState = createAction(
  "SET_INITIAL_STATE",
  (quizId: string, quiz: EditableQuiz) => ({
    quizId: quizId,
    quiz: quiz,
  }),
)<{ quizId: string; quiz: EditableQuiz }>()

export const setAddNewQuizItem = createAction(
  "SET_ADD_NEW_QUIZITEM",
  (quizId: string, adding: boolean) => ({
    quizId: quizId,
    adding: adding,
  }),
)<{ quizId: string; adding: boolean }>()

export const setNewItemType = createAction(
  "SET_NEW_ITEM_TYPE",
  (quizId: string, type: string) => ({ quizId: quizId, type: type }),
)<{ quizId: string; type: string }>()

export const addedNewTemporaryItemId = createAction(
  "CREATED_TEMPORARY_ITEMID",
  (quizId: string, itemId: string) => ({
    quizId: quizId,
    itemId: itemId,
  }),
)<{ quizId: string; itemId: string }>()