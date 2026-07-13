
exports.up = function (knex) {
  return knex.schema.createTable("tasks", function (table) {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable();
    table.string("title", 255).notNullable();
    table.text("description");
    table
      .enum("status", ["pending", "in-progress", "completed"])
      .defaultTo("pending");
    table.enum("priority", ["low", "medium", "high"]).defaultTo("medium");
    table.date("due_date");
    table.timestamps(true, true);

    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.index("user_id");
    table.index("status");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("tasks");
};
