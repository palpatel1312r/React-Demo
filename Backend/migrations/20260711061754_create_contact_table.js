exports.up = async function (knex) {
  // Check if table exists before creating
  const exists = await knex.schema.hasTable("contacts");
  if (!exists) {
    return knex.schema.createTable("contacts", function (table) {
      table.increments("id").primary();
      table.string("name", 255).notNullable();
      table.string("email", 255).notNullable();
      table.text("message").notNullable();
      table.boolean("is_read").defaultTo(false);
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
  }
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("contacts");
};
