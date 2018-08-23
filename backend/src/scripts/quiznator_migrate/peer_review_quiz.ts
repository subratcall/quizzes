import oldQuizTypes from "./app-modules/constants/quiz-types"
import {
  PeerReview as QNPeerReview,
  Quiz as QNQuiz,
} from "./app-modules/models"

import { QueryPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import {
  PeerReviewQuestion,
  PeerReviewQuestionCollection,
  PeerReviewQuestionCollectionTranslation,
  PeerReviewQuestionTranslation,
  Quiz,
  UserCourseState,
} from "../../models"
import { getUUIDByString, progressBar, safeGet } from "./util"

export async function migratePeerReviewQuestions() {
  console.log("Querying peer review questions...")
  const peerReviewQuestions = await QNQuiz.find({
    type: { $in: [oldQuizTypes.PEER_REVIEW] },
  })

  const bar = progressBar(
    "Migrating peer review questions",
    peerReviewQuestions.length,
  )
  const collections: Array<
    QueryPartialEntity<PeerReviewQuestionCollection>
  > = []
  const collectionTranslations: Array<
    QueryPartialEntity<PeerReviewQuestionCollectionTranslation>
  > = []
  const questions: Array<QueryPartialEntity<PeerReviewQuestion>> = []
  const questionTranslations: Array<
    QueryPartialEntity<PeerReviewQuestionTranslation>
  > = []
  await Promise.all(
    peerReviewQuestions.map(async (oldPRQ: any) => {
      const quiz = await Quiz.findOne(
        getUUIDByString(safeGet(() => oldPRQ.data.quizId)),
      )
      if (!quiz) {
        return
      }

      const val = await migratePeerReviewQuestion(quiz, oldPRQ)
      if (!val) {
        return
      }

      const [prqc, prqct, prqs, prqts] = val
      collections.push(prqc)
      collectionTranslations.push(prqct)
      prqs.forEach(prq => questions.push(prq))
      prqts.forEach(prqt => questionTranslations.push(prqt))

      bar.tick()
    }),
  )

  console.log("Inserting peer review questions")
  await PeerReviewQuestionCollection.createQueryBuilder()
    .insert()
    .values(collections)
    .onConflict(`("id") DO NOTHING`)
    .execute()
  await PeerReviewQuestionCollectionTranslation.createQueryBuilder()
    .insert()
    .values(collectionTranslations)
    .onConflict(
      `("peer_review_question_collection_id", "language_id") DO NOTHING`,
    )
    .execute()
  await PeerReviewQuestion.createQueryBuilder()
    .insert()
    .values(questions)
    .onConflict(`("id") DO NOTHING`)
    .execute()
  await PeerReviewQuestionTranslation.createQueryBuilder()
    .insert()
    .values(questionTranslations)
    .onConflict(`("peer_review_question_id", "language_id") DO NOTHING`)
    .execute()
}

async function migratePeerReviewQuestion(
  quiz: Quiz,
  oldPRQ: { [key: string]: any },
): Promise<
  [
    QueryPartialEntity<PeerReviewQuestionCollection>,
    QueryPartialEntity<PeerReviewQuestionCollectionTranslation>,
    Array<QueryPartialEntity<PeerReviewQuestion>>,
    Array<QueryPartialEntity<PeerReviewQuestionTranslation>>
  ]
> {
  const languageId = quiz.course.languages[0].id

  const peerReviewSample = await QNPeerReview.findOne({
    $or: [{ quizId: oldPRQ._id }, { sourceQuizId: oldPRQ._id }],
  })
  if (!peerReviewSample) {
    return null
  }

  const collection = {
    id: getUUIDByString(oldPRQ._id),
    quizId: quiz.id,
    createdAt: oldPRQ.createdAt,
    updatedAt: oldPRQ.updatedAt,
  }
  const collectionTranslation = {
    peerReviewQuestionCollectionId: collection.id,
    languageId,
    title: oldPRQ.title || "",
    body: oldPRQ.body || "",
    createdAt: oldPRQ.createdAt,
    updatedAt: oldPRQ.updatedAt,
  }

  const questions: Array<QueryPartialEntity<PeerReviewQuestion>> = []
  const questionTranslations: Array<
    QueryPartialEntity<PeerReviewQuestionTranslation>
  > = []
  let order = 1
  const newPRQ = async (
    id: string,
    type: string,
    title: string = "",
    body: string = "",
  ) => {
    questions.push({
      id: getUUIDByString(id),
      quizId: quiz.id,
      collectionId: collection.id,
      default: false,
      type,
      order: order++,
      answerRequired: oldPRQ.data.answeringRequired,
      createdAt: oldPRQ.createdAt,
      updatedAt: oldPRQ.updatedAt,
    })
    questionTranslations.push({
      peerReviewQuestionId: getUUIDByString(id),
      languageId,
      title,
      body,
      createdAt: oldPRQ.createdAt,
      updatedAt: oldPRQ.updatedAt,
    })
  }

  if (peerReviewSample.review && peerReviewSample.review !== "n/a") {
    newPRQ(oldPRQ._id + "essay", "essay")
  }
  if (peerReviewSample.grading) {
    for (const question of Object.keys(peerReviewSample.grading)) {
      newPRQ(oldPRQ._id + question, "grade", question)
    }
  }

  return [collection, collectionTranslation, questions, questionTranslations]
}
