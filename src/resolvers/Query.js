const Query = {
  async users ({ userId }, args, context, info) {
    return context.prisma.query.users(
      { where: { id_not: userId } },
      info
    )
  },
  async me ({ userId }, args, context, info) {
    return context.prisma.query.user({ where: { id: userId } }, info)
  },
  async user (parent, args, context, info) {
    return context.prisma.query.user({ where: { id: args.id } }, info)
  },
  async conversations (NULL, args, context, info) {
    return context.prisma.query.conversations(null, info)
  },
  async alerts (NULL, args, context, info) {
    return context.prisma.query.alerts(null, info)
  }
}

module.exports = { Query }
