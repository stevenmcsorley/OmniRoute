const { fetchAssignments, updateAssignmentStatus } = require("../db");

// Subscription event names
const ASSIGNMENT_UPDATED = "ASSIGNMENT_UPDATED";

const resolvers = {
  Query: {
    assignments: async (_, { companyId }) => {
      return await fetchAssignments(companyId);
    },
  },
  //   Mutation: {
  //     updateAssignmentStatus: async (_, { Id, Status }, { pubsub }) => {
  //       const updatedAssignment = await updateAssignmentStatus(Id, Status);
  //       // Publish the update to the subscription channel
  //       pubsub.publish(`${ASSIGNMENT_UPDATED}_${updatedAssignment.CompanyId}`, {
  //         assignmentUpdated: updatedAssignment,
  //       });
  //       return updatedAssignment;
  //     },
  //   },
  Mutation: {
    updateAssignmentStatus: async (_, { Id, Status }, { pubsub }) => {
      const updatedAssignment = await updateAssignmentStatus(Id, Status);
      // Publish the update to the subscription channel
      pubsub.publish(ASSIGNMENT_UPDATED, {
        assignmentUpdated: updatedAssignment,
      });
      return updatedAssignment;
    },
  },
  Subscription: {
    assignmentUpdated: {
      subscribe: (_, __, { pubsub }) => {
        return pubsub.asyncIterator(ASSIGNMENT_UPDATED);
      },
    },
  },
  //   Subscription: {
  //     assignmentUpdated: {
  //       subscribe: (_, { companyId }, context) => {
  //         console.log('Subscription context:', context);
  //         if (!context || !context.pubsub) {
  //           throw new Error('PubSub instance is not available in the subscription context.');
  //         }
  //         return context.pubsub.asyncIterator(`${ASSIGNMENT_UPDATED}_${companyId}`);
  //       },
  //     },
  //   },
};

module.exports = resolvers;
