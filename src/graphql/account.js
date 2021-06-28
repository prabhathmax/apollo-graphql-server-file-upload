import { gql } from 'apollo-server';
import { DateTimeMock, EmailAddressMock } from 'graphql-scalars';
import validations from '../validations/userValidations';

const typeDefs = gql`
  scalar DateTimeMock
  scalar EmailAddressMock

  type Account {
    userId: Int!
    email: String!
    createdAt: DateTimeMock!
    updatedAt: DateTimeMock
    profile: Profile!
  }
  type Profile {
    userId: Int!
    firstName: String! 
    lastName: String!
    middleName: String
    createdAt: DateTimeMock!
    updatedAt: DateTimeMock
  }
  type AuthenticationInfo {
    token: String!
    account: Account!
  }
  input CreateAccountInput {
    email: EmailAddressMock!
    password: String
    firstName: String!
    lastName: String!
    middleName: String
  }
  extend type Mutation {
    addAccountWithProfile(info: CreateAccountInput!): Account! 
    login(email: String!, password: String!): AuthenticationInfo
  }
  extend type Query {
    allAccounts: [Account]! @authenticated @hasPermission(permission: "all_users") @hasRole(role: "admin")
  }
`;

const resolvers = {
  DateTimeMock,
  EmailAddressMock,
  Account: {
    async profile(account, __, { services }) {
      return services.account.findProfile(account.userId);
    },
  },
  Mutation: {
    async addAccountWithProfile(_, { info }, { services }) {
      await validations.emailExists(info.email, services); // validate email exists
      return services.account.addAccount(info);
    },
    async login(_, { email, password }, { services }) {
      const { token } = await services.authentication.login(email, password);
      const account = await services.account.findByEmail(email);
      return { token, account };
    },
  },
  Query: {
    async allAccounts(_, __, { services }) {
      return services.account.findAll();
    },
  },
};

export default { typeDefs, resolvers };
