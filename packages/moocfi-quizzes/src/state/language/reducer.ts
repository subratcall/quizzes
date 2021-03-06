import { ActionType, getType } from "typesafe-actions"
import * as language from "./actions"
import { languageOptions, SingleLanguageLabels } from "../../utils/languages"

export type LanguageState = {
  languageId: string
  languageLabels: SingleLanguageLabels | null
}

export const initialState = {
  languageId: "",
  languageLabels: null,
}

export const languageReducer = (
  state: LanguageState = initialState,
  action: ActionType<typeof language>,
): LanguageState => {
  switch (action.type) {
    case getType(language.set):
      let id = action.payload
      const options = languageOptions[action.payload]
      if (!options) {
        id = "en_US"
      }
      return {
        languageId: id,
        languageLabels: languageOptions[id],
      }
    case getType(language.clear):
      return initialState
    default:
      return state
  }
}
