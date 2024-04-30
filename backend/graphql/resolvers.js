const { fetchAssignments, updateAssignmentStatus } = require("../db");

const ASSIGNMENT_UPDATED = "ASSIGNMENT_UPDATED";

const resolvers = {
  Query: {
    assignments: async (_, { companyId }) => {
      return await fetchAssignments(companyId);
    },
  },
  Mutation: {
    updateAssignmentStatus: async (_, { AssignmentId, status, CompanyId }, { pubsub }) => {
        // Make sure 'AssignmentId', 'status', and 'CompanyId' are passed correctly to the database function
        const updatedAssignment = await updateAssignmentStatus(AssignmentId, status, CompanyId);
        pubsub.publish(ASSIGNMENT_UPDATED, {
            assignmentUpdated: updatedAssignment,
        });
        return updatedAssignment;
    },
  },

  Subscription: {
    assignmentUpdated: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator([ASSIGNMENT_UPDATED])
    },
  },
};

module.exports = resolvers;
