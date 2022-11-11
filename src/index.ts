import { PrismaClient } from '@prisma/client';
import express from 'express';
import graphql, {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLID,
} from 'graphql';
import { graphqlHTTP } from 'express-graphql';
const prisma = new PrismaClient();

const port = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));


const ProductType = new GraphQLObjectType({
    name: "Product",
    fields: ()=>({
        id:{type: GraphQLString},
        transactions:{type :new GraphQLList(GraphQLString)}
    })
})


const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields:{
        products:{
            type: new GraphQLList(ProductType),
            resolve(parent,args){
                return (
                     prisma.products.findMany({
                            
                        })
                )
            }
        }
    }
})
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createProduct: {
      type: ProductType,
      args: {
        quantity: {type: GraphQLInt}
      },
      resolve(parent, args){
        prisma.products.create({
          data: {
            transactions: {
              create: {
                quantity: args.quantity
              },
            },
          },
        });
        return args
      }
    },
  },
});
const schema = new GraphQLSchema({query:RootQuery, mutation:Mutation})


app.use('/graphql', graphqlHTTP({
    schema,
    graphiql:true
}))

app.listen(port, () =>
  console.log(`REST API server ready at: http://localhost:${port}`)
);







 //console.log('Created new user: ', newProduct);

//  const allProducts = await prisma.products.findMany({
//    include: {
//      transactions: {
//        select: {
//          productsId: false,
//          id: true,
//          quantity: true,
//          time: true,
//        },
//      },
//    },
//  });
//  console.log('All users: ');
//  console.dir(allProducts, { depth: null });
