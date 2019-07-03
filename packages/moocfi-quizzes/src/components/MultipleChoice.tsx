import * as React from "react"
import { useDispatch } from "react-redux"
import styled from "styled-components"
import { Button, Grid, Typography } from "@material-ui/core"
import { GridDirection, GridSize } from "@material-ui/core/Grid"
import { SpaciousTypography } from "./styleComponents"
import { useTypedSelector } from "../state/store"
import * as quizAnswerActions from "../state/quizAnswer/actions"
import { QuizItem, QuizItemOption } from "../modelTypes"

const ChoicesContainer = styled(
  ({ singleItem, optionContainerWidth, ...others }) => (
    <Grid item={true} xs={optionContainerWidth}>
      <Grid container={true} {...others} />
    </Grid>
  ),
)`
  padding-top: 7;
  flex-wrap: ${({ singleItem }) => (singleItem ? "nowrap" : "wrap")};
`

const ChoiceButton = styled(Button)`
  text-transform: none;
  margin: 0.5em 0;
`

const RevealedChoiceButton = styled(({ selected, correct, ...others }) => (
  <ChoiceButton variant={selected ? "contained" : "outlined"} {...others} />
))`
  ${props =>
    props.selected
      ? `
    color: white;
    background-color: ${props.correct ? "green" : "red"};
    `
      : props.correct
      ? `
    color: green;
    outline-color: green;`
      : ``}
`

const BottomMarginedGrid = styled(Grid)`
  marginbottom: 10px;
`

const LeftBorderedTypography = styled(
  ({ barColor, ...others }: { barColor: string }) => <Typography {...others} />,
)`
  border-left: 4px solid ${({ barColor }) => barColor};
  padding: 3;
  margin-bottom: 5;
`

const SolutionTypography = styled(
  ({ correct, ...others }: { correct: boolean }) => (
    <LeftBorderedTypography barColor={correct ? "green" : "red"} {...others} />
  ),
)`
  margin-bottom: 0;
`

type MultipleChoiceProps = {
  item: QuizItem
}

const MultipleChoice: React.FunctionComponent<MultipleChoiceProps> = ({
  item,
}) => {
  const quiz = useTypedSelector(state => state.quiz)
  const answer = useTypedSelector(state => state.quizAnswer.quizAnswer)

  const itemAnswer = answer.itemAnswers.find(ia => ia.quizItemId === item.id)

  const onlyOneItem = quiz.items.length === 1

  const options = item.options

  let direction: GridDirection = "row"
  let questionWidth: 6 | 12 = 6
  let optionContainerWidth: 6 | 12 = 6
  let optionWidth: GridSize

  if (onlyOneItem) {
    const maxOptionLength = Math.max(
      ...options.map(option => option.texts[0].title.length),
    )
    const width =
      maxOptionLength > 100 ? 12 : Math.ceil(maxOptionLength / (8 + 1 / 3))
    optionContainerWidth = 12
    optionWidth = Math.min(width, 12) as GridSize
    questionWidth = 12
    direction = "column"
  }

  return (
    <BottomMarginedGrid container={true} direction={direction}>
      <UnnamedComponent
        item={item}
        itemAnswer={itemAnswer}
        onlyOneItem={onlyOneItem}
        questionWidth={questionWidth}
      />

      <ChoicesContainer
        direction={direction}
        justify="space-between"
        singleItem={onlyOneItem}
        optionContainerWidth={optionContainerWidth}
      >
        {options
          .sort((o1, o2) => o2.order - o1.order)
          .map(option => {
            return (
              <Option
                option={option}
                direction={direction}
                optionWidth={optionWidth}
              />
            )
          })}
      </ChoicesContainer>
    </BottomMarginedGrid>
  )
}

const UnnamedComponent = ({ questionWidth, onlyOneItem, item, itemAnswer }) => {
  const answered = itemAnswer.id ? true : false

  const languageInfo = useTypedSelector(
    state => state.language.languageLabels.multipleChoice,
  )

  const { title, body, successMessage, failureMessage } = item.texts[0]

  if (onlyOneItem) {
    return <></>
  }
  return (
    <Grid item sm={questionWidth}>
      <SpaciousTypography variant="h6">{title}</SpaciousTypography>

      {body && (
        <SpaciousTypography
          variant="body1"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      )}

      {!answered && item.multi && (
        <Typography variant="subtitle1">
          {languageInfo.chooseAllSuitableOptionsLabel}
        </Typography>
      )}

      {answered && !onlyOneItem && (
        <SolutionTypography correct={itemAnswer.correct} variant="body1">
          {itemAnswer.correct ? successMessage : failureMessage}
        </SolutionTypography>
      )}
    </Grid>
  )
}

type OptionProps = {
  option: QuizItemOption
  direction: GridDirection
  optionWidth: GridSize
}

const Option: React.FunctionComponent<OptionProps> = ({
  option,
  direction,
  optionWidth,
}) => {
  const items = useTypedSelector(state => state.quiz.items)
  const item = items.find(i => i.id === option.quizItemId)
  const quizAnswer = useTypedSelector(state => state.quizAnswer.quizAnswer)
  const itemAnswer = quizAnswer.itemAnswers.find(
    ia => ia.quizItemId === item.id,
  )

  const onlyOneItem = items.length === 1

  const dispatch = useDispatch()

  const handleOptionChange = (optionId: string) => () =>
    dispatch(quizAnswerActions.changeChosenOption(item.id, optionId))

  const optionAnswers = itemAnswer.optionAnswers
  const answered = itemAnswer.id ? true : false

  const optionIsSelected = optionAnswers.some(
    oa => oa.quizOptionId === option.id,
  )
  const text = option.texts[0]

  // option incorrect, selected -> success; option correct, not selected -> success! Otherwise failure
  const feedbackMessage =
    option.correct === optionIsSelected
      ? text.successMessage
      : text.failureMessage

  const feedbackColor = optionIsSelected
    ? option.correct
      ? "green"
      : "red"
    : "white"

  if (!answered) {
    return (
      <Grid item={true} sm={optionWidth} key={option.id}>
        <ChoiceButton
          variant="outlined"
          fullWidth
          color={optionIsSelected ? "primary" : "default"}
          onClick={handleOptionChange(option.id)}
        >
          {text.title}
        </ChoiceButton>
      </Grid>
    )
  }

  if (onlyOneItem) {
    return (
      <Grid item={true} key={option.id}>
        <Grid container={true} direction={direction}>
          <Grid item={true} sm={optionWidth}>
            <RevealedChoiceButton
              selected={optionIsSelected}
              correct={option.correct}
              fullWidth
            >
              {text.title}
            </RevealedChoiceButton>
          </Grid>

          <Grid item>
            <LeftBorderedTypography variant="body1" barColor={feedbackColor}>
              {feedbackMessage}
            </LeftBorderedTypography>
          </Grid>
        </Grid>
      </Grid>
    )
  }

  return (
    <Grid item={true} key={option.id}>
      <RevealedChoiceButton
        selected={optionIsSelected}
        correct={option.correct}
        fullWidth
      >
        {text.title}
      </RevealedChoiceButton>
    </Grid>
  )
}

export default MultipleChoice
