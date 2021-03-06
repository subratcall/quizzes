import http from "http"
import WebSocketServer from "websocket"
import redis from "./config/redis"
import TMCApi from "./services/TMCApi"
import { ITMCProfileDetails } from "./types"

const webSocketsServerPort = 7000
const server = http.createServer()
export const wsListen = () => server.listen(webSocketsServerPort)

const wsServer = new WebSocketServer.server({
  httpServer: server,
})

const connectionByUserCourse = new Map()
const userCourseByConnection = new Map()

export enum MessageType {
  PROGRESS_UPDATED = "PROGRESS_UPDATED",
  PEER_REVIEW_RECEIVED = "PEER_REVIEW_RECEIVED",
  QUIZ_CONFIRMED = "QUIZ_CONFIRMED",
  QUIZ_REJECTED = "QUIZ_REJECTED",
}

export const pushMessageToClient = (
  userId: number,
  courseId: string,
  type: MessageType,
  payload?: string,
) => {
  const userCourseObjectString = JSON.stringify({ userId, courseId })
  const connection = connectionByUserCourse.get(userCourseObjectString)
  if (connection) {
    if (connection.connected) {
      connection.sendUTF(
        JSON.stringify({
          type,
          message: payload,
        }),
      )
    } else {
      connectionByUserCourse.delete(userCourseObjectString)
      redis.publisher.publish(
        "websocket",
        JSON.stringify({ userId, courseId, type, message: payload }),
      )
    }
  } else {
    redis.publisher.publish(
      "websocket",
      JSON.stringify({ userId, courseId, type, message: payload }),
    )
  }
}

wsServer.on("request", (request: any) => {
  console.log("request ", request.origin)
  const connection = request.accept("echo-protocol", request.origin)

  connection.on("message", async (message: any) => {
    const data = JSON.parse(message.utf8Data)
    if (data instanceof Object && data.accessToken && data.courseId) {
      const accessToken = data.accessToken
      const courseId = data.courseId
      try {
        let user: ITMCProfileDetails = JSON.parse(await redis.get(accessToken))
        if (!user) {
          user = await TMCApi.getProfile(accessToken)
          redis.set(accessToken, JSON.stringify(user), "EX", 3600)
        }
        const userCourseObject = {
          userId: user.id,
          courseId,
        }
        connectionByUserCourse.set(JSON.stringify(userCourseObject), connection)
        userCourseByConnection.set(connection, userCourseObject)
        console.log("connection verified")
      } catch (error) {
        connection.drop()
        console.log("connection rejected")
      }
    } else {
      connection.drop()
    }
  })

  connection.on("close", () => {
    const userCourseObjectString = JSON.stringify(
      userCourseByConnection.get(connection),
    )
    userCourseByConnection.delete(connection)
    connectionByUserCourse.delete(userCourseObjectString)
  })
})

redis.subscriber.on("message", (channel: any, message: any) => {
  const data = JSON.parse(message)
  if (data instanceof Object && data.userId && data.courseId && data.type) {
    const userId = data.userId
    const courseId = data.courseId
    const userCourseObjectString = JSON.stringify({ userId, courseId })
    const connection = connectionByUserCourse.get(userCourseObjectString)
    if (connection) {
      if (connection.connected) {
        console.log("connection found")
        connection.sendUTF(
          JSON.stringify({
            type: data.type,
            message: data.message,
          }),
        )
      } else {
        connectionByUserCourse.delete(userCourseObjectString)
      }
    }
  }
})

redis.subscriber.subscribe("websocket")
