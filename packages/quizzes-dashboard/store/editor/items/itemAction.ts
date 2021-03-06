import { createAction } from "typesafe-actions"

export const editedQuizItemBody = createAction(
  "EDITED_QUIZ_ITEM_BODY",
  (newBody: string, itemId: string) => ({ body: newBody, id: itemId }),
)<{ body: string; id: string }>()

export const editedQuizItemTitle = createAction(
  "EDITED_QUIZ_ITEM_TITLE",
  (newTitle: string, itemId: string) => ({ title: newTitle, id: itemId }),
)<{ title: string; id: string }>()

export const editedScaleMaxValue = createAction(
  "EDITED_SCALE_MAX_VALUE",
  (itemId: string, newValue: number) => ({
    itemId: itemId,
    newValue: newValue,
  }),
)<{ itemId: string; newValue: number }>()

export const editedScaleMinValue = createAction(
  "EDITED_SCALE_MIN_VALUE",
  (itemId: string, newValue: number) => ({
    itemId: itemId,
    newValue: newValue,
  }),
)<{ itemId: string; newValue: number }>()

export const editedScaleMaxLabel = createAction(
  "EDITED_SCALE_MAX_LABEL",
  (itemId: string, newLabel: string) => ({
    itemId: itemId,
    newLabel: newLabel,
  }),
)<{ itemId: string; newLabel: string }>()

export const editedScaleMinLabel = createAction(
  "EDITED_SCALE_MIN_LABEL",
  (itemId: string, newLabel: string) => ({
    itemId: itemId,
    newLabel: newLabel,
  }),
)<{ itemId: string; newLabel: string }>()

export const editedValidityRegex = createAction(
  "EDITED_VALIDITY_REGEX",
  (itemId: string, newRegex: string) => ({
    itemId: itemId,
    newRegex: newRegex,
  }),
)<{ itemId: string; newRegex: string }>()

export const toggledMultiOptions = createAction(
  "TOGGLED_MULTI_OPTIONS",
  (itemId: string, checked: boolean) => ({
    itemId: itemId,
    checked: checked,
  }),
)<{ itemId: string; checked: boolean }>()

export const editedItemSuccessMessage = createAction(
  "EDITED_ITEM_SUCCESS_MESSAGE",
  (itemId: string, newMessage: string) => ({
    itemId: itemId,
    newMessage: newMessage,
  }),
)<{ itemId: string; newMessage: string }>()

export const editedItemFailureMessage = createAction(
  "EDITED_ITEM_FAILURE_MESSAGE",
  (itemId: string, newMessage: string) => ({
    itemId: itemId,
    newMessage: newMessage,
  }),
)<{ itemId: string; newMessage: string }>()

export const editedItemMaxWords = createAction(
  "EDITED_ITEM_MAX_WORDS",
  (itemId: string, maxWords: number) => ({
    itemId: itemId,
    maxWords: maxWords,
  }),
)<{ itemId: string; maxWords: number }>()

export const editedItemMinWords = createAction(
  "EDITED_ITEM_MIN_WORDS",
  (itemId: string, minWords: number) => ({
    itemId: itemId,
    minWords: minWords,
  }),
)<{ itemId: string; minWords: number }>()

export const editedSharedOptionsFeedbackMessage = createAction(
  "EDITED_SHARED_OPTION_MESSAGE",
  (itemId: string, newMessage: string) => ({
    itemId: itemId,
    newMessage: newMessage,
  }),
)<{ itemId: string; newMessage: string }>()

export const toggledSharedOptionFeedbackMessage = createAction(
  "TOGGLED_SHARED_OPTION_MESSAGE",
  (itemId: string, sharedFeedback: boolean) => ({
    itemId: itemId,
    sharedFeedback: sharedFeedback,
  }),
)<{ itemId: string; sharedFeedback: boolean }>()
