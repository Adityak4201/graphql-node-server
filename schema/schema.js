const graphql = require('graphql')

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt
} = graphql

// dummy data
const books = [
  { id: '1', name: 'Name of the Wind', genre: 'Fantasy', authorId: '1' },
  { id: '2', name: 'The Final Empire', genre: 'Fantasy', authorId: '2' },
  { id: '3', name: 'The Long Earth', genre: 'Sci-Fi', authorId: '3' }
]

const authors = [
  { id: '1', name: 'Patrick Rothfuss', age: 44 },
  { id: '2', name: 'Brandon Sanderson', age: 42 },
  { id: '3', name: 'Terry Pratchett', age: 66 }
]

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve: (parent, args) => {
        return authors.find((author) => author.id === parent.author)
      }
    }
  })
})

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve: (parent, args) => {
        // code to get data from db/other source
        // console.log(typeof args.id);
        return books.find((book) => book.id === args.id)
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve: (parent, args) => {
        return authors.find((author) => author.id === args.id)
      }
    }
  }
})

// book(id:'2') {
//   name, genre
// }

module.exports = new GraphQLSchema({ query: RootQuery })
