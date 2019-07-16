import { Container } from "typedi"
import { EntityManager, getManager } from "typeorm"
import { Database } from "../config/database"
import { UserQuizState } from "../models"

const courses = {
  "ohjelmoinnin-mooc-2019": "38240a7b-7e64-4202-91e2-91f6d46f6198",
  "elements-of-ai": "21356a26-7508-4705-9bab-39b239862632",
  "elements-of-ai-fi": "5d1e8da2-3154-4966-aa94-2ca0406cf38a",
  "elements-of-ai-se": "5f496ecc-327a-4899-baff-2daa2b40b05f",
}

const database = Container.get(Database)

let manager: EntityManager
let date: Date

database.connect().then(async () => {
  manager = getManager()
  date = (await manager.query(
    "select date from uqs_aggregation order by date desc limit 1",
  ))[0].date.toISOString()
  createUserQuizStates()
})

const insert = process.argv.includes("cron")
  ? async (batch: UserQuizState[]) => {
      await Promise.all(
        batch.map(async uqs => {
          await uqs.save()
        }),
      )
    }
  : async (batch: UserQuizState[]) => {
      await manager
        .createQueryBuilder()
        .insert()
        .into(UserQuizState)
        .values(batch)
        .onConflict(`(user_id, quiz_id) DO NOTHING`)
        .execute()
    }

const createUserQuizStates = async () => {
  const now: any = new Date()

  console.log(now)
  console.log(
    `creating user quiz states for answers given or updated since ${date}`,
  )

  console.log("creating ohjelmoinnin mooc user quiz states")
  const ohjelmoinninMooc: UserQuizState[] = await createOhjelmoinninMoocQuizStates()
  console.log(`${ohjelmoinninMooc.length} created`)
  console.log("creating elements of ai user quiz states")
  const elementsOfAI: UserQuizState[] = await createElementsOfAIUserQuizStates()
  console.log(`${elementsOfAI.length} created`)

  const userQuizStates: UserQuizState[] = [...ohjelmoinninMooc, ...elementsOfAI]

  console.log(`inserting ${userQuizStates.length} user quiz states`)

  let start = -1000
  let end = -1
  while (end !== userQuizStates.length - 1) {
    start += 1000
    end += 1000
    if (end > userQuizStates.length - 1) {
      end = userQuizStates.length - 1
    }
    await insert(userQuizStates.slice(start, end))
  }

  await manager.query(
    `insert into uqs_aggregation (date) values ('${new Date(
      now - 10 * 60000,
    ).toISOString()}')`,
  )
}

const createOhjelmoinninMoocQuizStates = async (): Promise<UserQuizState[]> => {
  const distinct = `
  (select
    distinct(user_id, quiz_id),
    user_id,
    quiz_id
  from quiz_answer
  where (created_at >= '${date}' or updated_at >= '${date}'))
  `

  const data = await manager.query(`
  select
    d.user_id,
    d.quiz_id,
    t.tries
  from ${distinct} d
  join ${tries} t on d.user_id = t.user_id and d.quiz_id = t.quiz_id
  join quiz q on d.quiz_id = q.id
  where course_id = '38240a7b-7e64-4202-91e2-91f6d46f6198'
  and d.user_id is not null
  and d.quiz_id is not null;
  `)

  const userQuizStates: UserQuizState[] = data.map(
    (userQuiz: any, index: number) => {
      const userQuizState: UserQuizState = new UserQuizState()
      userQuizState.userId = userQuiz.user_id
      userQuizState.quizId = userQuiz.quiz_id
      userQuizState.pointsAwarded = 1
      userQuizState.tries = userQuiz.tries
      userQuizState.status = "open"
      return userQuizState
    },
  )

  return userQuizStates
}

const createElementsOfAIUserQuizStates = async () => {
  const peerReview = `
    (select quiz_answer_id from peer_review where created_at >= '${date}')
    `

  const spamFlag = `
    (select quiz_answer_id from spam_flag where created_at >= '${date}')
    `

  const latest = `
  (select
    id
  from (select
          id,
          row_number() over(partition by user_id, quiz_id order by created_at desc) rn
        from quiz_answer) s
  where rn = 1)
  `

  const type = `
    (select
      distinct(quiz_id, type, multi),
      quiz_id,
      type,
      multi
    from quiz_item)
  `

  const elementsQuizzes = `
  (select
    id
  from quiz
  where course_id = '${courses["elements-of-ai"]}'
  or course_id = '${courses["elements-of-ai-fi"]}'
  or course_id = '${courses["elements-of-ai-se"]}')
  `

  const data = await manager.query(`
  select
    qa.id,
    status,
    qa.user_id,
    qa.quiz_id,
    t.type,
    t.multi,
    coalesce(g.given, 0) as given,
    coalesce(r.received, 0) as received,
    coalesce(spam.flagged, 0) as flagged,
    coalesce(c.correct, 0) as correct,
    coalesce(cm.correct, 0) as correct_multi,
    coalesce(total.total, 0) as total,
    tries.tries as tries
  from quiz_answer as qa
  join ${latest} l on qa.id = l.id
  join ${type} t on qa.quiz_id = t.quiz_id
  left join ${given} as g on qa.quiz_id = g.quiz_id and qa.user_id = g.user_id
  left join ${flagged} as spam on qa.id = spam.quiz_answer_id
  left join ${received} as r on qa.id = r.quiz_answer_id
  left join ${tries} as tries on qa.user_id = tries.user_id and qa.quiz_id = tries.quiz_id
  left join ${correctMultipleChoice} c on qa.id = c.id
  left join ${correctMultipleChoiceMulti} cm on qa.id = cm.id
  left join ${total} total on qa.quiz_id = total.id
  where qa.quiz_id in ${elementsQuizzes}
  and qa.user_id is not null
  and qa.quiz_id is not null
  and (qa.created_at >= '${date}' or qa.updated_at >= '${date}' or qa.id in ${peerReview} or qa.id in ${spamFlag})
  `)

  const answerData = await manager.query(`
  select
    qa.id,
    text_data,
    validity_regex
  from quiz_answer qa
  left join quiz_item_answer qia on qa.id = qia.quiz_answer_id
  left join quiz_item qi on qia.quiz_item_id = qi.id
  where qa.quiz_id in ${elementsQuizzes}
  and qi.type = 'open'
  and (qa.created_at >= '${date}' or qa.updated_at >= '${date}');
  `)
  const validation: any = {}
  answerData.map((answer: any) => {
    if (!validation[answer.id]) {
      validation[answer.id] = { correct: 0, total: 0 }
    }
    const correct = validation[answer.id].correct
    validation[answer.id].correct = new RegExp(answer.validity_regex).test(
      answer.text_data.trim().toLowerCase(),
    )
      ? correct + 1
      : correct
    validation[answer.id].total += 1
  })

  const userQuizStates: UserQuizState[] = data.map((answer: any) => {
    const userQuizState = new UserQuizState()

    const status = answer.status

    userQuizState.userId = answer.user_id
    userQuizState.quizId = answer.quiz_id
    userQuizState.tries = answer.tries
    userQuizState.status =
      status === "confirmed" || status === "submitted" ? "locked" : "open"

    switch (answer.type) {
      case "essay":
        userQuizState.peerReviewsGiven = answer.given
        userQuizState.peerReviewsReceived = answer.received
        userQuizState.spamFlags = answer.flagged
        userQuizState.pointsAwarded = status === "confirmed" ? 1 : null
        break
      case "open":
        userQuizState.pointsAwarded =
          validation[answer.id].correct / validation[answer.id].total
        break
      case "multiple-choice":
        if (answer.multi) {
          userQuizState.pointsAwarded = answer.correct_multi / answer.total
        } else {
          userQuizState.pointsAwarded = answer.correct / answer.total
        }
        break
    }

    return userQuizState
  })

  return userQuizStates
}

const correctMultipleChoice = `
  (select
    qa.id,
    count(qia.id) correct
  from quiz_answer qa
  join quiz_item_answer qia on qa.id = qia.quiz_answer_id
  join quiz_option_answer qoa on qia.id = qoa.quiz_item_answer_id
  join quiz_option qo on qoa.quiz_option_id = qo.id
  where qo.correct = true
  group by qa.id)
  `

const multiCorrect = `
  (select
    qia.id,
    count(qoa.id) correct
  from quiz_item_answer qia
  join quiz_option_answer qoa on qia.id = qoa.quiz_item_answer_id
  join quiz_option qo on qoa.quiz_option_id = qo.id
  where qo.correct = true
  group by qia.id)
  `

const multiFalse = `
  (select
    qia.id,
    count(qoa.id) as false
  from quiz_item_answer qia
  join quiz_option_answer qoa on qia.id = qoa.quiz_item_answer_id
  join quiz_option qo on qoa.quiz_option_id = qo.id
  where qo.correct = false
  group by qia.id)
  `

const multiTotal = `
  (select
    qi.id,
    count(qo.id) total_correct
  from quiz_item qi
  join quiz_option qo on qi.id = qo.quiz_item_id
  where correct = true
  group by qi.id)
  `

const multiItems = `
  (select
    qia.id,
    coalesce(c.correct, 0) correct,
    coalesce(f.false, 0) as false,
    coalesce(t.total_correct, 0) total
  from quiz_item_answer qia
  left join ${multiCorrect} c on qia.id = c.id
  left join ${multiFalse} f on qia.id = f.id
  left join ${multiTotal} t on qia.quiz_item_id = t.id)
  `

const correctMultipleChoiceMulti = `
  (select
    qa.id,
    count(case when a.correct = a.total and a.false = 0 then 1 end) correct
  from quiz_answer qa
  join quiz_item_answer qia on qa.id = qia.quiz_answer_id
  join ${multiItems} a on qia.id = a.id
  group by qa.id)
  `

const total = `
  (select
    q.id,
    count(qi.id) total
  from quiz q
  join quiz_item qi on q.id = qi.quiz_id
  group by q.id)
  `

const peerreview = `
  (select
    quiz_answer_id,
    count(case when value = 1 then 1 end) as sadface,
    count(value) as total
  from peer_review as pr
  join peer_review_question_answer as prqa on pr.id = prqa.peer_review_id
  join peer_review_question as prq on prqa.peer_review_question_id = prq.id
  where type = 'grade'
  group by quiz_answer_id)
  `

const given = `
  (select
    pr.user_id,
    qa.quiz_id,
    count(pr.id) as given
  from quiz_answer as qa
  join peer_review as pr on qa.id = pr.quiz_answer_id
  group by pr.user_id, qa.quiz_id)
  `

const flagged = `
  (select
    quiz_answer_id,
    count(id) as flagged
  from spam_flag
  group by quiz_answer_id)
  `

const received = `
  (select
    quiz_answer_id,
    count(id) as received
  from peer_review
  group by quiz_answer_id)
  `

const tries = `
  (select
    user_id,
    quiz_id,
    count(id) as tries
  from quiz_answer
  group by user_id, quiz_id)
  `

/*const createElementsEssayQuizStates = async (): Promise<UserQuizState[]> => {
const peerReview = `
  (select quiz_answer_id from peer_review where created_at >= '${date}')
  `

const spamFlag = `
  (select quiz_answer_id from spam_flag where created_at >= '${date}')
  `

const latest = `
(select
  id
from (select
        id,
        row_number() over(partition by user_id, quiz_id order by created_at desc) rn
      from quiz_answer
      where quiz_id in ${elementsEssay}
      and status != 'deprecated'
      and (created_at >= '${date}' or updated_at >= '${date}' or id in ${peerReview} or id in ${spamFlag})
      and user_id is not null
      and quiz_id is not null) s
where rn = 1)
`

const data = await manager.query(`
select
  qa.id,
  status,
  qa.user_id,
  qa.quiz_id,
  coalesce(s.sadface, 0) as sadface,
  coalesce(s.total, 0) as total,
  coalesce(g.given, 0) as given,
  coalesce(r.received, 0) as received,
  coalesce(spam.flagged, 0) as flagged,
  t.tries as tries
from quiz_answer as qa
join ${latest} l on qa.id = l.id
left outer join ${peerreview} as s on qa.id = s.quiz_answer_id
left outer join ${given} as g on qa.quiz_id = g.quiz_id and qa.user_id = g.user_id
left outer join ${flagged} as spam on qa.id = spam.quiz_answer_id
left outer join ${received} as r on qa.id = r.quiz_answer_id
left outer join ${tries} as t on qa.user_id = t.user_id and qa.quiz_id = t.quiz_id
`)

const userQuizStates: UserQuizState[] = data.map(
  (answer: any, index: number) => {
    const userQuizState: UserQuizState = new UserQuizState()
    userQuizState.userId = answer.user_id
    userQuizState.quizId = answer.quiz_id
    userQuizState.pointsAwarded = answer.status === "confirmed" ? 1 : null
    userQuizState.peerReviewsGiven = answer.given
    userQuizState.peerReviewsReceived = answer.received
    userQuizState.spamFlags = answer.flagged
    userQuizState.tries = answer.tries
    userQuizState.status =
      answer.status === "confirmed" || answer.status === "submitted"
        ? "locked"
        : "open"
    return userQuizState
  },
)

console.log(`${userQuizStates.length} created`)

const set = new Set()

userQuizStates
  .filter(uqs => uqs.userId !== null && uqs.quizId !== null)
  .forEach(o => {
    set.add(o.userId + o.quizId)
  })

console.log(set.size)

return userQuizStates
}

const createOhjelmoinninMoocEssayQuizStates = async (): Promise<
UserQuizState[]
> => {
const data = await manager.query(`
select
  qa.id,
  status,
  qa.user_id,
  qa.quiz_id,
  t.tries as tries
from quiz_answer as qa
left join ${tries} as t on qa.user_id = t.user_id and qa.quiz_id = t.quiz_id
where status != 'deprecated'
and qa.quiz_id in ${ohjelmoinninMoocEssay}
and (qa.created_at >= '${date}' or qa.updated_at >= '${date}');
`)

const userQuizStates: UserQuizState[] = data.map(
  (answer: any, index: number) => {
    const userQuizState: UserQuizState = new UserQuizState()
    userQuizState.userId = answer.user_id
    userQuizState.quizId = answer.quiz_id
    userQuizState.pointsAwarded = 1
    userQuizState.tries = answer.tries
    userQuizState.status = "locked"
    return userQuizState
  },
)

console.log(`${userQuizStates.length} created`)

const set = new Set()

userQuizStates
  .filter(uqs => uqs.userId !== null && uqs.quizId !== null)
  .forEach(o => {
    set.add(o.userId + o.quizId)
  })

console.log(set.size)

return userQuizStates
}

const createOpenQuizStates = async () => {
const answerData = await manager.query(`
select
  qa.id,
  text_data,
  validity_regex
from quiz_answer qa
left join quiz_item_answer qia on qa.id = qia.quiz_answer_id
left join quiz_item qi on qia.quiz_item_id = qi.id
where qa.quiz_id in ${open}
and (qa.created_at >= '${date}' or qa.updated_at >= '${date}');
`)
const validation: any = {}
answerData.map((answer: any) => {
  if (!validation[answer.id]) {
    validation[answer.id] = { correct: 0, total: 0 }
  }
  const correct = validation[answer.id].correct
  validation[answer.id].correct = new RegExp(answer.validity_regex).test(
    answer.text_data.trim().toLowerCase(),
  )
    ? correct + 1
    : correct
  validation[answer.id].total += 1
})
const data = await manager.query(`
select
  qa.id,
  status,
  qa.user_id,
  qa.quiz_id,
  t.tries as tries
from quiz_answer as qa
left outer join ${tries} as t on qa.user_id = t.user_id and qa.quiz_id = t.quiz_id
where status != 'deprecated'
and qa.quiz_id in ${open}
and (qa.created_at >= '${date}' or qa.updated_at >= '${date}');
`)
const userQuizStates: UserQuizState[] = data.map(
  (answer: any, index: number) => {
    const userQuizState: UserQuizState = new UserQuizState()
    userQuizState.userId = answer.user_id
    userQuizState.quizId = answer.quiz_id
    userQuizState.pointsAwarded =
      validation[answer.id].correct / validation[answer.id].total
    userQuizState.tries = answer.tries
    userQuizState.status = "locked"
    return userQuizState
  },
)

console.log(`${userQuizStates.length} created`)

const set = new Set()

userQuizStates
  .filter(uqs => uqs.userId !== null && uqs.quizId !== null)
  .forEach(o => {
    set.add(o.userId + o.quizId)
  })

console.log(set.size)

return userQuizStates
}

const createMultipleChoiceQuizStates = async (): Promise<UserQuizState[]> => {
const data = await manager.query(`
select
  qa.id,
  qa.quiz_id,
  qa.user_id,
  c.correct,
  t.total,
  tr.tries
from quiz_answer qa
left join ${correctMultipleChoice} c on qa.id = c.id
left join ${total} t on qa.quiz_id = t.id
left join ${tries} tr on qa.user_id = tr.user_id and qa.quiz_id = tr.quiz_id
where qa.status != 'deprecated'
and qa.quiz_id in ${multipleChoice}
and (qa.created_at >= '${date}' or qa.updated_at >= '${date}');
`)
const userQuizStates: UserQuizState[] = data.map(
  (answer: any, index: number) => {
    const userQuizState: UserQuizState = new UserQuizState()
    userQuizState.userId = answer.user_id
    userQuizState.quizId = answer.quiz_id
    userQuizState.pointsAwarded = answer.correct / answer.total
    userQuizState.tries = answer.tries
    userQuizState.status = "locked"
    return userQuizState
  },
)

console.log(`${userQuizStates.length} created`)

const set = new Set()

userQuizStates
  .filter(uqs => uqs.userId !== null && uqs.quizId !== null)
  .forEach(o => {
    set.add(o.userId + o.quizId)
  })

console.log(set.size)

return userQuizStates
}

const createMultipleChoiceMultiQuizStates = async (): Promise<
UserQuizState[]
> => {
const data = await manager.query(`
select
  qa.id,
  qa.quiz_id,
  qa.user_id,
  c.correct,
  t.total,
  tr.tries
from quiz_answer qa
left join ${correctMultipleChoiceMulti} c on qa.id = c.id
left join ${total} t on qa.quiz_id = t.id
left join ${tries} tr on qa.user_id = tr.user_id and qa.quiz_id = tr.quiz_id
where qa.status != 'deprecated'
and qa.quiz_id in ${multipleChoiceMulti}
and (qa.created_at >= '${date}' or qa.updated_at >= '${date}');
`)
const userQuizStates: UserQuizState[] = data.map(
  (answer: any, index: number) => {
    const userQuizState: UserQuizState = new UserQuizState()
    userQuizState.userId = answer.user_id
    userQuizState.quizId = answer.quiz_id
    userQuizState.pointsAwarded = answer.correct / answer.total
    userQuizState.tries = answer.tries
    userQuizState.status = "locked"
    return userQuizState
  },
)

console.log(`${userQuizStates.length} created`)

const set = new Set()

userQuizStates
  .filter(uqs => uqs.userId !== null && uqs.quizId !== null)
  .forEach(o => {
    set.add(o.userId + o.quizId)
  })

console.log(set.size)

return userQuizStates
}

const createScaleQuizStates = async (): Promise<UserQuizState[]> => {
const data = await manager.query(`
select
  qa.user_id,
  qa.quiz_id,
  tr.tries
from quiz_answer qa
left join ${tries} tr on qa.user_id = tr.user_id and qa.quiz_id = tr.quiz_id
where qa.quiz_id in ${scale}
`)
const userQuizStates: UserQuizState[] = data.map(
  (answer: any, index: number) => {
    const userQuizState: UserQuizState = new UserQuizState()
    userQuizState.userId = answer.user_id
    userQuizState.quizId = answer.quiz_id
    userQuizState.pointsAwarded = 1
    userQuizState.tries = answer.tries
    userQuizState.status = "locked"
    return userQuizState
  },
)

console.log(`${userQuizStates.length} created`)

const set = new Set()

userQuizStates
  .filter(uqs => uqs.userId !== null && uqs.quizId !== null)
  .forEach(o => {
    set.add(o.userId + o.quizId)
  })

console.log(set.size)

return userQuizStates
}

const createCheckboxQuizStates = async (): Promise<UserQuizState[]> => {
const data = await manager.query(`
select
  qa.user_id,
  qa.quiz_id,
  tr.tries
from quiz_answer qa
left join ${tries} tr on qa.user_id = tr.user_id and qa.quiz_id = tr.quiz_id
where qa.quiz_id in ${checkbox}
`)
const userQuizStates: UserQuizState[] = data.map(
  (answer: any, index: number) => {
    const userQuizState: UserQuizState = new UserQuizState()
    userQuizState.userId = answer.user_id
    userQuizState.quizId = answer.quiz_id
    userQuizState.pointsAwarded = 1
    userQuizState.tries = answer.tries
    userQuizState.status = "locked"
    return userQuizState
  },
)

console.log(`${userQuizStates.length} created`)

const set = new Set()

userQuizStates
  .filter(uqs => uqs.userId !== null && uqs.quizId !== null)
  .forEach(o => {
    set.add(o.userId + o.quizId)
  })

console.log(set.size)

return userQuizStates
}*/

/*const elementsEssay = `
  (select
    distinct(q.id)
  from quiz as q
  join quiz_item as qi on q.id = qi.quiz_id
  where type = 'essay'
  and (course_id = '${courses["elements-of-ai"]}'
  or course_id = '${courses["elements-of-ai-fi"]}'
  or course_id = '${courses["elements-of-ai-se"]}'))
  `

const ohjelmoinninMoocEssay = `
  (select
    distinct(q.id)
  from quiz as q
  join quiz_item as qi on q.id = qi.quiz_id
  where type = 'essay'
  and course_id = '${courses["ohjelmoinnin-mooc-2019"]}')
  `

const open = `
  (select
    distinct(q.id)
  from quiz as q
  join quiz_item as qi on q.id = qi.quiz_id
  where type = 'open'
  and (course_id = '${courses["elements-of-ai"]}'
  or course_id = '${courses["elements-of-ai-fi"]}'
  or course_id = '${courses["elements-of-ai-se"]}'
  or course_id = '${courses["ohjelmoinnin-mooc-2019"]}'))
  `

const multipleChoice = `
  (select
    distinct(q.id)
  from quiz as q
  join quiz_item as qi on q.id = qi.quiz_id
  where type = 'multiple-choice'
  and multi != true
  and (course_id = '${courses["elements-of-ai"]}'
  or course_id = '${courses["elements-of-ai-fi"]}'
  or course_id = '${courses["elements-of-ai-se"]}'
  or course_id = '${courses["ohjelmoinnin-mooc-2019"]}'))
`

const multipleChoiceMulti = `
  (select
    distinct(q.id)
  from quiz as q
  join quiz_item as qi on q.id = qi.quiz_id
  where type = 'multiple-choice'
  and multi = true
  and (course_id = '${courses["elements-of-ai"]}'
  or course_id = '${courses["elements-of-ai-fi"]}'
  or course_id = '${courses["elements-of-ai-se"]}'
  or course_id = '${courses["ohjelmoinnin-mooc-2019"]}'))
`

const scale = `
  (select
    distinct(q.id)
  from quiz q
  join quiz_item qi on q.id = qi.quiz_id
  where type = 'scale'
  and course_id = '${courses["ohjelmoinnin-mooc-2019"]}')
  `

const checkbox = `
  (select
    distinct(q.id)
  from quiz q
  join quiz_item qi on q.id = qi.quiz_id
  where type = 'checkbox'
  and course_id = '${courses["ohjelmoinnin-mooc-2019"]}')
  `*/