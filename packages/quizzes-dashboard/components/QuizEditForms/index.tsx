import React from "react"
import { Typography } from "@material-ui/core"
import styled from "styled-components"
import QuizItems from "./QuizItems"
import BasicInfo from "./BasicInfo"
import { useTypedSelector } from "../../store/store"
import { Skeleton } from "@material-ui/lab"

const StyledId = styled(Typography)`
  margin-bottom: 1rem !important;
`

const StyledSkeleton = styled(Skeleton)`
  margin-bottom: 1rem;
`

const QuizEditForms = () => {
  const quizId = useTypedSelector(state => state.editor.quizId)

  if (!quizId) {
    return (
      <>
        <StyledSkeleton variant="text" width={900} height={200} />
        <StyledSkeleton variant="rect" width={900} height={400} />
        <StyledSkeleton variant="rect" width={900} height={400} />
      </>
    )
  }
  return (
    <>
      <StyledId>{quizId}</StyledId>
      <BasicInfo />
      <QuizItems />
    </>
  )
}

export default QuizEditForms
