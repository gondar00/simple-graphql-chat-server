const jwt = require('jsonwebtoken')
const APP_SECRET = 'appsecret123'

const Mutation = {
  async signup(_, {
    username,
    name,
    emirateId,
    address,
    mobile,
    medicalRecord,
    medicalLicense,
    hospital
  }, context, info) {
    const user = await context.prisma.query.user(
      {
        where: {
          username
        }
      },
      '{ id }'
    )

    if (user) {
      return {
        token: jwt.sign({ userId: user.id }, APP_SECRET),
        user
      }
    }

    const newUser = await context.prisma.mutation.createUser(
      {
        data: {
          username,
          name,
          emirateId,
          address,
          mobile,
          medicalRecord,
          medicalLicense,
          hospital
        }
      },
      '{ id }'
    )

    return {
      token: jwt.sign({ userId: newUser.id }, APP_SECRET),
      user: newUser
    }
  },
  async createConversation(
    { userId },
    { name, participantIds, text },
    context,
    info
  ) {
    const allParticipantIds = participantIds
    allParticipantIds.push(userId)

    const data = {
      name,
      participants: {
        connect: allParticipantIds.map(participantId => ({
          id: participantId
        }))
      }
    }

    if (text) {
      data.texts = {
        create: {
          text,
          author: {
            connect: {
              id: userId
            }
          }
        }
      }
    }

    return context.prisma.mutation.createConversation({ data }, info)
  },
  async sendTextMessage({ userId }, { conversationId, text }, context, info) {
    return context.prisma.mutation.createText(
      {
        data: {
          text,
          author: {
            connect: {
              id: userId
            }
          },
          conversation: {
            connect: {
              id: conversationId
            }
          }
        }
      },
      info
    )
  },
  async createAlert(_, { author, text }, context, info) {
    return context.prisma.mutation.createAlert(
      {
        data: {
          text,
          author: {
            connect: {
              id: author
            }
          },
        }
      },
      info
    )
  },
  async createReport(_, { author }, context, info) {
    const user = await context.prisma.query.user(
      {
        where: {
          id: author
        }
      },
      '{ id, reports }'
    );
    return context.prisma.mutation.updateUser({
      where: { id: author },
      data: {
        reports: user.reports + 1
      }
    },
      info
    )
  }
}

module.exports = { Mutation }
