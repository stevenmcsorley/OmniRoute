const { gql } = require('apollo-server');

const typeDefs = gql`
  type Assignment {
    Id: Int!
    ResourceId: Int!
    EmployeeId: Int!
    StartTime: String!
    EndTime: String!
    Status: Status!
  }

  enum Status {
    Scheduled
    Active
    Completed
    Cancelled
  }

  type Query {
    assignments(companyId: Int!): [Assignment]
  }

  type Subscription {
    assignmentChanged(companyId: Int!): Assignment
  }
`;

module.exports = typeDefs;
