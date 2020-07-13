import { createStore, combineReducers } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import { useSelector, TypedUseSelectorHook } from "react-redux"
import { optionReducer } from "./editor/options/optionReducer"
import { itemReducer } from "./editor/items/itemReducer"
import { quizReducer } from "./editor/quiz/quizReducer"
import { resultReducer } from "./editor/result/resultReducer"
import {
  Quiz,
  Item,
  Option,
  ItemVariables,
  OptionVariables,
  QuizVariables,
} from "../types/NormalizedQuiz"
import { itemVariableReducers } from "./editor/itemVariables/itemVariableReducers"
import { optionVariableReducers } from "./editor/optionVariables/optionVariableReducers"
import { quizVariableReducers } from "./editor/quizVariables/quizVariableReducers"

const editorReducer = combineReducers({
  quizzes: quizReducer,
  items: itemReducer,
  options: optionReducer,
  quizId: resultReducer,
  itemVariables: itemVariableReducers,
  optionVariables: optionVariableReducers,
  quizVariables: quizVariableReducers,
})

const reducer = combineReducers({
  editor: editorReducer,
})

const store = createStore(reducer, composeWithDevTools())

export interface storeState {
  editor: {
    quizzes: { [quizId: string]: Quiz }
    items: { [itemId: string]: Item }
    options: { [optionId: string]: Option }
    quizId: string
    itemVariables: { [itemId: string]: ItemVariables }
    optionVariables: { [optionId: string]: OptionVariables }
    quizVariables: { [quizId: string]: QuizVariables }
  }
}

export const useTypedSelector: TypedUseSelectorHook<storeState> = useSelector

export default store
