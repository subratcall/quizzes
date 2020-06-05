import React from "react"
import { Item } from "../../types/EditQuiz"
import styled from "styled-components"
import EssayContent from "./EssayContent"
import { Card, Typography, TextField, Select } from "@material-ui/core"
import MultipleChoiceContent from "./MultipleChoiceContent"
import CheckBoxContent from "./CheckBoxContent"
import OpenContent from "./OpenContent"
import ScaleContent from "./ScaleContent"
import { editedQuizItemTitle } from "../../store/edit/actions"
import { connect } from "react-redux"
import DebugDialog from "../DebugDialog"

const QuizCard = styled(Card)`
  box-shadow: rgba(0, 0, 0, 0.3) 0px 8px 40px -12px !important;
  border-radius: 1rem !important;
  margin: 0 auto;
  margin-bottom: 1rem;
  width: 800px;
`

const IconWrapper = styled.div`
  font-size: 3.5rem;
  margin: 0 1.5rem 0 0.5rem;
  @media (max-width: 550px) {
    text-align: center;
  }
`

const QuizHeader = styled.div`
  background-color: rgb(33, 48, 148);
  color: white;
  padding: 1rem;
  display: flex;
`

const StyledId = styled(Typography)`
  margin-bottom: 1rem !important;
`

const TitleContainer = styled.div`
  flex: 1;
  margin-right: 1rem;
`

const TypeContainer = styled.div`
  margin-right: 1.5rem;
  width: 5rem;
`

const QuizContent = styled.div`
  padding: 1rem;
`

const StyledTextField = styled(TextField)`
  background-color: white;
  border-radius: 1rem;
  overflow: auto;
  width: 100%;
  margin-top: 0.25rem !important;
`

const StyledSelectField = styled(Select)`
  background-color: white;
  border-radius: 1rem;
  overflow: auto;
  width: 100%;
  margin-top: 0.25rem !important;
`
interface QuizItemProps {
  item: Item
  editItemTitle: (newTitle: string, itemId: string) => any
}

const QuizItem = ({ item, editItemTitle }: QuizItemProps) => {
  return (
    <div>
      <QuizCard>
        <QuizHeader>
          <Typography variant="h4">{item.type} quiz</Typography>
        </QuizHeader>
        <QuizHeader>
          <TitleContainer>
            <Typography variant="h5">Quiz title:</Typography>
            <StyledTextField
              id={item.id}
              variant="outlined"
              defaultValue={item.texts[0].title}
              onChange={event => editItemTitle(event.target.value, item.id)}
            />
          </TitleContainer>
        </QuizHeader>
        <QuizContent>
          {contentBasedOnType(item.type.toString(), item)}
          <DebugDialog passedData={item} editable={true} />
        </QuizContent>
      </QuizCard>
      <br />
    </div>
  )
}

const contentBasedOnType = (type: string, item: Item) => {
  switch (type) {
    case "multiple-choice": {
      return <MultipleChoiceContent item={item} />
    }
    case "checkbox": {
      return <CheckBoxContent item={item} />
    }
    case "essay": {
      return <EssayContent item={item} />
    }
    case "open": {
      return <OpenContent item={item} />
    }
    case "scale": {
      return <ScaleContent item={item} />
    }
    default: {
      return <h1>Hi, I'm new/unknown</h1>
    }
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    editItemTitle: (newTitle: string, itemId: string) =>
      dispatch(editedQuizItemTitle(newTitle, itemId)),
  }
}

export default connect(null, mapDispatchToProps)(QuizItem)
