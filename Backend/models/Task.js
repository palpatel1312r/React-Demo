// Backend/models/Task.js
const { Model } = require("objection");

class Task extends Model {
  static get tableName() {
    return "tasks";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["title", "user_id"],
      properties: {
        id: { type: "integer" },
        user_id: { type: "integer" },
        title: { type: "string", minLength: 1, maxLength: 255 },
        description: { type: "string", maxLength: 1000 },
        status: {
          type: "string",
          enum: ["pending", "in-progress", "completed"],
          default: "pending",
        },
        priority: {
          type: "string",
          enum: ["low", "medium", "high"],
          default: "medium",
        },
        due_date: { type: "string", format: "date" },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }

  static get relationMappings() {
    // Use dynamic import to avoid circular dependency
    const User = require("./User");
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "tasks.user_id",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = Task;
