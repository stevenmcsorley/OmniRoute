const { PubSub } = require('graphql-subscriptions');
const db = require('./db'); // Assume you have a db module to handle SQL queries

const pubsub = new PubSub();
const ASSIGNMENT_CHANGED_TOPIC = 'ASSIGNMENT_CHANGED';

const resolvers = {
  Query: {
    assignments: async (_, { companyId }) => {
      // Fetch assignments from the database
      return db.fetchAssignments(companyId);
    },
  },
  Subscription: {
    assignmentChanged: {
      subscribe: () => pubsub.asyncIterator([ASSIGNMENT_CHANGED_TOPIC]),
    },
  },
};

// Example function to call when an assignment is updated
function publishAssignmentChange(assignment) {
  pubsub.publish(ASSIGNMENT_CHANGED_TOPIC, { assignmentChanged: assignment });
}

module.exports = { resolvers, publishAssignmentChange };
