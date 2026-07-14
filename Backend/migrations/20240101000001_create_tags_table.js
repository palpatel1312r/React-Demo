// migrations/20240101000001_create_tags_table.js
exports.up = async function (knex) {
  const hasTable = await knex.schema.hasTable("tags");
  if (!hasTable) {
    await knex.schema.createTable("tags", function (table) {
      table.increments("id").primary();
      table.string("name", 50).notNullable().unique();
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
    console.log("✅ Tags table created");
  } else {
    console.log("ℹ️ Tags table already exists");
  }
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("tags");
};
