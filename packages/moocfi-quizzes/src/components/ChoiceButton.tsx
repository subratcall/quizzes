import * as React from "react"
import { useContext } from "react"
import ThemeProviderContext from "../contexes/themeProviderContext"
import styled from "styled-components"
import { Button } from "@material-ui/core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons"

export interface ChoiceButtonProps {
  revealed: boolean
  children: any
  onlyOneItem: boolean
  selected: boolean
  correct: boolean
  onClick?: any
  disabled?: boolean
}

interface ButtonProps {
  onlyOneItem: boolean
  selected: boolean
}

interface RevealedButtonProps {
  onlyOneItem: boolean
  selected: boolean
  correct: boolean
  children: any
}

const IconWrapper = styled.div`
  margin: 0.5rem;
`

const SuccessIcon = () => (
  <IconWrapper>
    <FontAwesomeIcon icon={faCheck} />
  </IconWrapper>
)

const FailureIcon = () => (
  <IconWrapper>
    <FontAwesomeIcon icon={faTimes} />
  </IconWrapper>
)

const ChoiceButton = styled(Button)<ButtonProps>`
  ${({ onlyOneItem }) => onlyOneItem && `width: 70%;`}
  ${({ selected }) =>
    !selected && `background-color: white;`}
  text-transform: none;
  margin: 0.5em 0;
  border-radius: 15px;
  border: 1px solid
    ${({ selected }) => (selected ? "rgba(0, 0, 0, 0)" : "rgba(0, 0, 0, 0.23)")};
  padding: 15px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
`

const RevealedChoiceButton = styled(
  ({ selected, correct, ...others }: RevealedButtonProps) => {
    return (
      <ChoiceButton
        variant={"contained"}
        selected={selected}
        fullWidth
        {...others}
        aria-label={correct ? "correct-answer" : "wrong-answer"}
      >
        {selected ? correct ? <SuccessIcon /> : <FailureIcon /> : ""}
        {others.children}
      </ChoiceButton>
    )
  },
)`
  ${props =>
    props.selected
      ? `
      color: white;
      background-color: ${props.correct ? "#047500" : "#DB0000"};
      `
      : props.correct
      ? `
      color: #047500;
      border-color: #047500;
      border-width: 3px
      `
      : ``}
`

export default (props: ChoiceButtonProps) => {
  const themeProvider = useContext(ThemeProviderContext)
  const { revealed, ...others } = props
  const ThemedButton = themeProvider.choiceButton

  if (ThemedButton) {
    return <ThemedButton {...props} />
  }

  return revealed ? (
    <RevealedChoiceButton {...others} />
  ) : (
    <ChoiceButton
      variant="contained"
      color={props.selected ? "primary" : "default"}
      fullWidth
      {...others}
    />
  )
}