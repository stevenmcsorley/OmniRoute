const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Assignment {
    AssignmentId: Int!
    ResourceId: Int!
    EmployeeId: Int
    StartTime: String
    EndTime: String
    Status: String
    CompanyId: Int!
  }

  type Query {
    assignments(companyId: Int!): [Assignment]
  }

  type Mutation {
    updateAssignmentStatus(AssignmentId: Int!, status: String!, CompanyId: Int!): Assignment
}


  type Subscription {
    assignmentUpdated: Assignment
  }
`;

module.exports = typeDefs;
