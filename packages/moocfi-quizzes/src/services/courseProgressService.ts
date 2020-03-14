import axios from "axios"
import BASE_URL from "../config"
import { PointsByGroup } from "../modelTypes"
import { GraphQLClient } from "graphql-request"

let graphQLClient: GraphQLClient

const request = async (accessToken: string, query: string, baseUrl: string) => {
  if (!graphQLClient) {
    graphQLClient = new GraphQLClient(`${baseUrl}/api`, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })
  }
  return await graphQLClient.request(query)
}

/*export const getUserCourseData = async (
  courseId: string,
  accessToken: string,
  baseUrl: string,
): Promise<any> => {
  const response = await axios.get(
    `${baseUrl}/api/v1/quizzes/usercoursestate/${courseId}`,
    {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    },
  )
  return response.data
}

export const getCompletion = async (
  courseId: string,
  accessToken: string,
  baseUrl: string,
): Promise<any> => {
  const query = `
    {
      currentUser {
        completions(
          course_id: "${courseId}"
        ) {
          id
        }
      }
    }
  `
  return await request(accessToken, query, baseUrl)
}*/

export const getUserCourseData = async (
  courseId: string,
  accessToken: string,
  baseUrl: string,
): Promise<any> => {
  const query = `
    {
      currentUser {
        user_course_progresses(
          where: { course: { id: "${courseId}" } }
        ) {
          n_points
          max_points
          progress
          course {
            points_needed
            exercise_completions_needed
            exercises {
              id
              quizzes_id: custom_id
              name
              part
              section
              max_points
            }
            withAnswer: exercises(orderBy: part_ASC) {
              id
              custom_id
              part
              section
              max_points
              exercise_completions(orderBy: updated_at_DESC, first: 1) {
                completed
                n_points
                required_actions {
                  value
                }
              }
            }
          }
        }
        completions(
          course_id: "${courseId}"
        ) {
          id
        }
      }
    }
  `
  const data = await request(accessToken, query, baseUrl)

  return data
}
