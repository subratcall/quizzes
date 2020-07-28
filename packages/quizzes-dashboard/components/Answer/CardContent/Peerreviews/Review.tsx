import React from "react"
import { PeerReview } from "../../../../types/Answer"
import { Typography, Divider } from "@material-ui/core"
import ReviewContent from "./ReviewContent"
import styled from "styled-components"

export const StyledDivider = styled(Divider)`
  display: flex !important;
  color: blue !important;
  margin: 0.5rem !important;
  width: 100%;
`

export const ReviewContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 0.5rem;
  flex-wrap: wrap;
`

export interface reviewProps {
  review: PeerReview
  number: number
}

export const Review = ({ review, number }: reviewProps) => {
  return (
    <>
      <ReviewContainer>
        <Typography variant="h3">Review nro. {number}</Typography>
        <ReviewContent review={review} />
      </ReviewContainer>
    </>
  )
}

export default Review
