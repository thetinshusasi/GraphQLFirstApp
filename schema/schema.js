const graphql = require("graphql");
const _ = require("lodash");
const axios = require("axios").default;
const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLList,
    GraphQLString,
    GraphQLInt
} = graphql;

let baseUrl = "http://localhost:3000/";
const users = [{
    id: "23",
    firstName: "James",
    age: 20

},
{
    id: "24",
    firstName: "potter",
    age: 21
}];

const CompanyType = new GraphQLObjectType({
    name: "Company",
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        users: {
            type: new GraphQLList(UserType),
            resolve: (parentVal, args) => {
                return axios.get(baseUrl + `companies/${parentVal.id}/users`).then(res => res.data);
            }
        }

    })
});

const UserType = new GraphQLObjectType({
    name: "User",
    fields: {
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
            type: CompanyType,
            resolve: (parentVal, args) => {
                return axios.get(baseUrl + `companies/${parentVal.companyId}`).then(res => res.data);
            }

        }
    }
});

const RootQuery = new GraphQLObjectType(
    {
        name: "RootQueryType",
        fields: () => ({
            user: {
                type: UserType,
                args: { id: { type: GraphQLString } },
                resolve: (parentValue, args) => {
                    return axios.get(baseUrl + `users/${args.id}`).then(res => {
                        return res.data;
                    });

                }
            },
            company: {
                type: CompanyType,
                args: { id: { type: GraphQLString } },
                resolve: (parentVal, args) => {                 

                    return axios.get(baseUrl + `companies/${args.id}`).then(res => res.data);
                }

            }
        })
    }
);

const Mutation = new GraphQLObjectType({
    name:"Mutation",
    fields:()=>({
        /// fields of mutation describes the operation we want to perform
    })
});

module.exports = new GraphQLSchema({
    query: RootQuery
})