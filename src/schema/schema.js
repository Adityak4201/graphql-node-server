const graphql = require("graphql");
const Book = require("../models/book");
const Author = require("../models/author");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

// dummy data
// const books = [
//   { id: "1", name: "Name of the Wind", genre: "Fantasy", authorId: "1" },
//   { id: "2", name: "The Final Empire", genre: "Fantasy", authorId: "2" },
//   { id: "3", name: "The Long Earth", genre: "Sci-Fi", authorId: "3" },
//   { id: "4", name: "The Hero of Ages", genre: "Fantasy", authorId: "2" },
//   { id: "5", name: "The Colour of Magic", genre: "Fantasy", authorId: "3" },
//   { id: "6", name: "The Light Fantastic", genre: "Fantasy", authorId: "3" },
// ];

// const authors = [
//   { id: "1", name: "Patrick Rothfuss", age: 44 },
//   { id: "2", name: "Brandon Sanderson", age: 42 },
//   { id: "3", name: "Terry Pratchett", age: 66 },
// ];

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve: (parent) => {
        // console.log(parent, args);
        return Author.findById(parent.authorId);
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve: (parent) => {
        return Book.find({ authorId: parent.id });
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve: (parent, args) => {
        // code to get data from db/other source
        // console.log(typeof args.id);
        return Book.findById(args.id);
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve: (parent, args) => {
        return Author.findById(args.id);
      },
    },
    books: {
      type: new GraphQLList(BookType),
      resolve: () => Book.find({}),
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve: () => Author.find({}),
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: async (parent, args) => {
        const { name, age } = args;
        const author = new Author({ name, age });
        return await author.save();
      },
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (parent, args) => {
        const { name, genre, authorId } = args;
        const book = new Book({ name, genre, authorId });
        return await book.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation: Mutation });
