// const { prisma } = require('./generated/prisma-client')

// // A `main` function so that we can use async/await
// async function main() {
//   // Create a new user called `Alice`
//   const newUser = await prisma.createUser({ name: 'Heisenberg' })
//   console.log(`Created new user: ${newUser.name} (ID: ${newUser.id})`)

//   // Read all users from the database and print them to the console
//   const allUsers = await prisma.users()
//   console.log(allUsers)

//   const newChat = await prisma.createChat({
//       from: {
//         connect: {
//           id: newUser.id
//         }
//       },
//       content: 'hello'
//   })
//   console.log(newChat)
// }

// main().catch(e => console.error(e))
const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')

const resolvers = {
  Query: {
    users(root, args, context) {
      return context.prisma.users()
    },
    chats(root, args, context) {
      return context.prisma.chats()
    },
    chatsByUser(root, args, context) {
      return context.prisma
        .user({
          id: args.userId,
        })
        .chats()
    },
  },
  Mutation: {
    createChat(root, args, context) {
      return context.prisma.createChat({
        content: args.content,
        from: {
          connect: { id: args.userId },
        },
      })
    },
    createUser(root, args, context) {
      return context.prisma.createUser({ name: args.name })
    },
  },
  Subscription: {
    newChat: {
      subscribe: (parent, args, ctx, info) => {
        // console.log(ctx)
        return ctx.prisma.$subscribe.chat({ mutation_in: ['CREATED'] }).node()
      },
      resolve: payload => {
        return payload
      },
    }
  },
  User: {
    chats(root, args, context) {
      return context.prisma
        .user({
          id: root.id,
        })
        .chats()
    },
  },
  Chat: {
    from(root, args, context) {
      return context.prisma
        .chat({
          id: root.id,
        })
        .from()
    },
  },
}

const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: {
    prisma,
  },
})
server.start(() => console.log('Server is running on http://localhost:4000'))