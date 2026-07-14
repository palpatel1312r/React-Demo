// migrations/20240101000002_create_task_tags_table.js
exports.up = async function (knex) {
  const hasTable = await knex.schema.hasTable("task_tags");
  if (!hasTable) {
    await knex.schema.createTable("task_tags", function (table) {
      table.integer("task_id").unsigned().notNullable();
      table.integer("tag_id").unsigned().notNullable();
      table.primary(["task_id", "tag_id"]);

      table
        .foreign("task_id")
        .references("id")
        .inTable("tasks")
        .onDelete("CASCADE");

      table
        .foreign("tag_id")
        .references("id")
        .inTable("tags")
        .onDelete("CASCADE");
    });
    console.log("✅ Task tags junction table created");
  } else {
    console.log("ℹ️ Task tags table already exists");
  }
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("task_tags");
};
