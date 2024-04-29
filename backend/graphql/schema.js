const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Assignment {
    Id: Int!
    ResourceId: Int!
    EmployeeId: Int
    StartTime: String
    EndTime: String
    Status: String
  }

  type Query {
    assignments(companyId: Int!): [Assignment]
  }

  type Mutation {
    updateAssignmentStatus(Id: Int!, Status: String!): Assignment
  }

  type Subscription {
    assignmentUpdated(companyId: Int!): Assignment
  }
`;

module.exports = typeDefs;
