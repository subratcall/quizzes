const uuid = /[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/
const dateTime = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?Z?/

export default {
  newQuiz: {
    courseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
    part: 1,
    section: 1,
    points: 1,
    deadline: null,
    open: null,
    excludedFromScore: false,
    autoConfirm: true,
    tries: 1,
    triesLimited: true,
    awardPointsEvenIfWrong: false,
    grantPointsPolicy: "grant_whenever_possible",
    autoReject: true,
    title: "quiz",
    body: "body",
    submitMessage: "nice one!",
    items: [
      {
        type: "multiple-choice",
        order: 1,
        usesSharedOptionFeedbackMessage: false,
        title: "multiple-choice",
        body: "item",
        successMessage: "yay!",
        failureMessage: "boo!",
        sharedOptionFeedbackMessage: null,
        options: [
          {
            order: 1,
            correct: false,
            title: "A",
            successMessage: "true",
            failureMessage: "false",
          },
        ],
      },
      {
        type: "essay",
        order: 2,
        usesSharedOptionFeedbackMessage: false,
        title: "essay",
        body: "item",
        successMessage: "yay!",
        failureMessage: "boo!",
        sharedOptionFeedbackMessage: null,
      },
    ],
    peerReviews: [
      {
        title: "pr",
        body: "do this",
        questions: [
          {
            default: true,
            type: "grade",
            order: 1,
            title: "question",
            body: "answer this",
          },
        ],
      },
    ],
  },
  newQuizValidator: {
    id: expect.stringMatching(uuid),
    courseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
    part: 1,
    section: 1,
    points: 1,
    deadline: null,
    open: null,
    excludedFromScore: false,
    autoConfirm: true,
    tries: 1,
    triesLimited: true,
    awardPointsEvenIfWrong: false,
    grantPointsPolicy: "grant_whenever_possible",
    autoReject: true,
    title: "quiz",
    body: "body",
    submitMessage: "nice one!",
    createdAt: expect.stringMatching(dateTime),
    updatedAt: expect.stringMatching(dateTime),
    items: [
      {
        id: expect.stringMatching(uuid),
        quizId: expect.stringMatching(uuid),
        type: "multiple-choice",
        order: 1,
        validityRegex: null,
        formatRegex: null,
        multi: false,
        minWords: null,
        maxWords: null,
        minValue: null,
        maxValue: null,
        usesSharedOptionFeedbackMessage: false,
        title: "multiple-choice",
        body: "item",
        successMessage: "yay!",
        failureMessage: "boo!",
        sharedOptionFeedbackMessage: null,
        createdAt: expect.stringMatching(dateTime),
        updatedAt: expect.stringMatching(dateTime),
        options: [
          {
            id: expect.stringMatching(uuid),
            quizItemId: expect.stringMatching(uuid),
            order: 1,
            correct: false,
            title: "A",
            body: "",
            successMessage: "true",
            failureMessage: "false",
            createdAt: expect.stringMatching(dateTime),
            updatedAt: expect.stringMatching(dateTime),
          },
        ],
      },
      {
        id: expect.stringMatching(uuid),
        quizId: expect.stringMatching(uuid),
        type: "essay",
        order: 2,
        validityRegex: null,
        formatRegex: null,
        multi: false,
        minWords: null,
        maxWords: null,
        minValue: null,
        maxValue: null,
        usesSharedOptionFeedbackMessage: false,
        title: "essay",
        body: "item",
        successMessage: "yay!",
        failureMessage: "boo!",
        sharedOptionFeedbackMessage: null,
        createdAt: expect.stringMatching(dateTime),
        updatedAt: expect.stringMatching(dateTime),
        options: [],
      },
    ],
    peerReviews: [
      {
        id: expect.stringMatching(uuid),
        quizId: expect.stringMatching(uuid),
        title: "pr",
        body: "do this",
        createdAt: expect.stringMatching(dateTime),
        updatedAt: expect.stringMatching(dateTime),
        questions: [
          {
            id: expect.stringMatching(uuid),
            peerReviewCollectionId: expect.stringMatching(uuid),
            quizId: null,
            answerRequired: true,
            default: true,
            type: "grade",
            order: 1,
            title: "question",
            body: "answer this",
            createdAt: expect.stringMatching(dateTime),
            updatedAt: expect.stringMatching(dateTime),
          },
        ],
      },
    ],
  },
  quizUpdate: {
    id: "4bf4cf2f-3058-4311-8d16-26d781261af7",
    courseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
    part: 1,
    section: 1,
    points: 1,
    deadline: null,
    open: null,
    excludedFromScore: false,
    autoConfirm: true,
    tries: 1,
    triesLimited: true,
    awardPointsEvenIfWrong: false,
    grantPointsPolicy: "grant_whenever_possible",
    autoReject: true,
    title: "quiz",
    body: "body",
    submitMessage: "nice one!",
    items: [
      {
        id: "707195a3-aafe-4c06-bf23-854e54e084db",
        quizId: "4bf4cf2f-3058-4311-8d16-26d781261af7",
        type: "essay",
        order: 2,
        usesSharedOptionFeedbackMessage: false,
        title: "essay",
        body: "item",
        successMessage: "yay!",
        failureMessage: "boo!",
        sharedOptionFeedbackMessage: null,
      },
      {
        quizId: "4bf4cf2f-3058-4311-8d16-26d781261af7",
        type: "essay",
        order: 1,
        usesSharedOptionFeedbackMessage: false,
        title: "essay",
        body: "item",
        successMessage: "yay!",
        failureMessage: "boo!",
        sharedOptionFeedbackMessage: null,
      },
    ],
    peerReviews: [
      {
        id: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
        quizId: "4bf4cf2f-3058-4311-8d16-26d781261af7",
        title: "pr",
        body: "do this",
        questions: [
          {
            id: "730e3083-7a0d-4ea7-9837-61ee93c6692f",
            peer_review_collection_id: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
            default: true,
            type: "grade",
            order: 1,
            title: "question",
            body: "answer this",
          },
        ],
      },
    ],
  },
  quizUpdateValidator: {
    id: "4bf4cf2f-3058-4311-8d16-26d781261af7",
    courseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
    part: 1,
    section: 1,
    points: 1,
    deadline: null,
    open: null,
    excludedFromScore: false,
    autoConfirm: true,
    tries: 1,
    triesLimited: true,
    awardPointsEvenIfWrong: false,
    grantPointsPolicy: "grant_whenever_possible",
    autoReject: true,
    title: "quiz",
    body: "body",
    submitMessage: "nice one!",
    createdAt: expect.stringMatching(dateTime),
    updatedAt: expect.stringMatching(dateTime),
    items: [
      {
        id: "707195a3-aafe-4c06-bf23-854e54e084db",
        quizId: "4bf4cf2f-3058-4311-8d16-26d781261af7",
        type: "essay",
        order: 2,
        validityRegex: null,
        formatRegex: null,
        multi: false,
        minWords: null,
        maxWords: null,
        minValue: null,
        maxValue: null,
        usesSharedOptionFeedbackMessage: false,
        title: "essay",
        body: "item",
        successMessage: "yay!",
        failureMessage: "boo!",
        sharedOptionFeedbackMessage: null,
        createdAt: expect.stringMatching(dateTime),
        updatedAt: expect.stringMatching(dateTime),
      },
      {
        id: expect.stringMatching(uuid),
        quizId: "4bf4cf2f-3058-4311-8d16-26d781261af7",
        type: "essay",
        order: 1,
        validityRegex: null,
        formatRegex: null,
        multi: false,
        minWords: null,
        maxWords: null,
        minValue: null,
        maxValue: null,
        usesSharedOptionFeedbackMessage: false,
        title: "essay",
        body: "item",
        successMessage: "yay!",
        failureMessage: "boo!",
        sharedOptionFeedbackMessage: null,
        createdAt: expect.stringMatching(dateTime),
        updatedAt: expect.stringMatching(dateTime),
      },
    ],
    peerReviews: [
      {
        id: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
        quizId: "4bf4cf2f-3058-4311-8d16-26d781261af7",
        title: "pr",
        body: "do this",
        createdAt: expect.stringMatching(dateTime),
        updatedAt: expect.stringMatching(dateTime),
        questions: [
          {
            id: "730e3083-7a0d-4ea7-9837-61ee93c6692f",
            peerReviewCollectionId: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
            quizId: null,
            answerRequired: true,
            default: true,
            type: "grade",
            order: 1,
            title: "question",
            body: "answer this",
            createdAt: expect.stringMatching(dateTime),
            updatedAt: expect.stringMatching(dateTime),
          },
        ],
      },
    ],
  },
  quizValidator1: {
    id: "4bf4cf2f-3058-4311-8d16-26d781261af7",
    courseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
    part: 1,
    section: 1,
    points: 1,
    deadline: null,
    open: null,
    excludedFromScore: false,
    autoConfirm: true,
    tries: 1,
    triesLimited: true,
    awardPointsEvenIfWrong: false,
    grantPointsPolicy: "grant_whenever_possible",
    autoReject: true,
    title: "quiz 1",
    body: "body",
    submitMessage: "nice one!",
    createdAt: expect.stringMatching(dateTime),
    updatedAt: expect.stringMatching(dateTime),
    items: expect.arrayContaining([
      {
        id: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
        quizId: "4bf4cf2f-3058-4311-8d16-26d781261af7",
        type: "multiple-choice",
        order: 1,
        validityRegex: null,
        formatRegex: null,
        multi: false,
        minWords: null,
        maxWords: null,
        minValue: null,
        maxValue: null,
        usesSharedOptionFeedbackMessage: false,
        title: "multiple-choice",
        body: "item",
        successMessage: "yay!",
        failureMessage: "boo!",
        sharedOptionFeedbackMessage: null,
        createdAt: expect.stringMatching(dateTime),
        updatedAt: expect.stringMatching(dateTime),
        options: [
          {
            id: "7c802f5b-52f1-468e-a798-3028edc1d3fd",
            quizItemId: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
            order: 1,
            correct: false,
            title: "A",
            body: "",
            successMessage: "true",
            failureMessage: "false",
            createdAt: expect.stringMatching(dateTime),
            updatedAt: expect.stringMatching(dateTime),
          },
        ],
      },
      {
        id: "707195a3-aafe-4c06-bf23-854e54e084db",
        quizId: "4bf4cf2f-3058-4311-8d16-26d781261af7",
        type: "essay",
        order: 2,
        validityRegex: null,
        formatRegex: null,
        multi: false,
        minWords: null,
        maxWords: null,
        minValue: null,
        maxValue: null,
        usesSharedOptionFeedbackMessage: false,
        title: "essay",
        body: "item",
        successMessage: "yay!",
        failureMessage: "boo!",
        sharedOptionFeedbackMessage: null,
        createdAt: expect.stringMatching(dateTime),
        updatedAt: expect.stringMatching(dateTime),
        options: [],
      },
    ]),
    peerReviews: [
      {
        id: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
        quizId: "4bf4cf2f-3058-4311-8d16-26d781261af7",
        title: "pr",
        body: "do this",
        createdAt: expect.stringMatching(dateTime),
        updatedAt: expect.stringMatching(dateTime),
        questions: [
          {
            id: "730e3083-7a0d-4ea7-9837-61ee93c6692f",
            peerReviewCollectionId: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
            quizId: null,
            answerRequired: true,
            default: true,
            type: "grade",
            order: 1,
            title: "question",
            body: "answer this",
            createdAt: expect.stringMatching(dateTime),
            updatedAt: expect.stringMatching(dateTime),
          },
        ],
      },
    ],
  },
  quizValidator2: {
    id: "2b8f05ac-2a47-436e-8675-35bfe9a5c0ac",
    courseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
    part: 2,
    section: 1,
    points: 1,
    deadline: null,
    open: null,
    excludedFromScore: false,
    autoConfirm: true,
    tries: 1,
    triesLimited: true,
    awardPointsEvenIfWrong: false,
    grantPointsPolicy: "grant_whenever_possible",
    autoReject: true,
    title: "quiz 2",
    body: "body",
    submitMessage: "nice one!",
    createdAt: expect.stringMatching(dateTime),
    updatedAt: expect.stringMatching(dateTime),
    items: expect.arrayContaining([
      {
        id: "4a55eb54-6a9c-4245-843c-0577f3eafd9e",
        quizId: "2b8f05ac-2a47-436e-8675-35bfe9a5c0ac",
        type: "open",
        order: 1,
        validityRegex: "koira",
        formatRegex: null,
        multi: false,
        minWords: null,
        maxWords: null,
        minValue: null,
        maxValue: null,
        usesSharedOptionFeedbackMessage: false,
        title: "open",
        body: "item",
        successMessage: "yay!",
        failureMessage: "boo!",
        sharedOptionFeedbackMessage: null,
        createdAt: expect.stringMatching(dateTime),
        updatedAt: expect.stringMatching(dateTime),
        options: [],
      },
    ]),
    peerReviews: [],
  },
  courseValidator1: {
    id: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
    minScoreToPass: null,
    minProgressToPass: null,
    minPeerReviewsReceived: 2,
    minPeerReviewsGiven: 3,
    minReviewAverage: "2.00",
    maxSpamFlags: 1,
    organizationId: null,
    moocfiId: "aa141326-fc86-4c8f-b7d8-b7778fc56f26",
    maxReviewSpamFlags: 3,
    languageId: "xy_YZ",
    title: "course 1",
    body: "course",
    abbreviation: "course",
    createdAt: expect.stringMatching(dateTime),
    updatedAt: expect.stringMatching(dateTime),
  },
  courseValidator2: {
    id: "51b66fc3-4da2-48aa-8eab-404370250ca3",
    minScoreToPass: null,
    minProgressToPass: null,
    minPeerReviewsReceived: 2,
    minPeerReviewsGiven: 3,
    minReviewAverage: "2.00",
    maxSpamFlags: 1,
    organizationId: null,
    moocfiId: "12059bbf-4f5b-49ff-85e2-f5bd0797c603",
    maxReviewSpamFlags: 3,
    languageId: "xy_YZ",
    title: "course 2",
    body: "course",
    abbreviation: "course",
    createdAt: expect.stringMatching(dateTime),
    updatedAt: expect.stringMatching(dateTime),
  },
  quizAnswerValidator1: {
    id: "0cb3e4de-fc11-4aac-be45-06312aa4677c",
    quizId: "4bf4cf2f-3058-4311-8d16-26d781261af7",
    userId: 1234,
    status: "given-enough",
    createdAt: expect.stringMatching(dateTime),
    updatedAt: expect.stringMatching(dateTime),
    itemAnswers: [
      {
        id: "840ad4ff-8402-4c71-a57f-4b12e4b32bce",
        quizAnswerId: "0cb3e4de-fc11-4aac-be45-06312aa4677c",
        quizItemId: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
        textData: null,
        intData: null,
        correct: null,
        createdAt: expect.stringMatching(dateTime),
        updatedAt: expect.stringMatching(dateTime),
        optionAnswers: [
          {
            id: "ab6c2932-193c-439c-a5b5-1694bebdc178",
            quizItemAnswerId: "840ad4ff-8402-4c71-a57f-4b12e4b32bce",
            quizOptionId: "7c802f5b-52f1-468e-a798-3028edc1d3fd",
            createdAt: expect.stringMatching(dateTime),
            updatedAt: expect.stringMatching(dateTime),
          },
        ],
      },
      {
        id: "31941489-29a1-448d-bc59-418480d007d9",
        quizAnswerId: "0cb3e4de-fc11-4aac-be45-06312aa4677c",
        quizItemId: "707195a3-aafe-4c06-bf23-854e54e084db",
        textData: null,
        intData: null,
        correct: null,
        createdAt: expect.stringMatching(dateTime),
        updatedAt: expect.stringMatching(dateTime),
        optionAnswers: [],
      },
    ],
    userQuizState: {
      userId: 1234,
      quizId: "4bf4cf2f-3058-4311-8d16-26d781261af7",
      peerReviewsGiven: null,
      peerReviewsReceived: null,
      pointsAwarded: null,
      spamFlags: null,
      status: "locked",
      tries: null,
      createdAt: expect.stringMatching(dateTime),
      updatedAt: expect.stringMatching(dateTime),
    },
    peerReviews: [
      {
        id: "2a486ebb-900a-4a78-ada5-be0792610cf0",
        peerReviewCollectionId: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
        quizAnswerId: "0cb3e4de-fc11-4aac-be45-06312aa4677c",
        userId: 2345,
        rejectedQuizAnswerIds: null,
        createdAt: expect.stringMatching(dateTime),
        updatedAt: expect.stringMatching(dateTime),
        answers: [
          {
            peerReviewId: "2a486ebb-900a-4a78-ada5-be0792610cf0",
            peerReviewQuestionId: "730e3083-7a0d-4ea7-9837-61ee93c6692f",
            value: 1,
            text: null,
            createdAt: expect.stringMatching(dateTime),
            updatedAt: expect.stringMatching(dateTime),
          },
        ],
      },
      {
        id: "8cf3efb8-f2ca-44ed-8f18-1e4bd49ee805",
        peerReviewCollectionId: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
        quizAnswerId: "0cb3e4de-fc11-4aac-be45-06312aa4677c",
        userId: 3456,
        rejectedQuizAnswerIds: null,
        createdAt: expect.stringMatching(dateTime),
        updatedAt: expect.stringMatching(dateTime),
        answers: [
          {
            peerReviewId: "8cf3efb8-f2ca-44ed-8f18-1e4bd49ee805",
            peerReviewQuestionId: "730e3083-7a0d-4ea7-9837-61ee93c6692f",
            value: 2,
            text: null,
            createdAt: expect.stringMatching(dateTime),
            updatedAt: expect.stringMatching(dateTime),
          },
        ],
      },
    ],
  },
}
