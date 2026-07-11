exports.up = function (knex) {
  return knex.schema.hasTable("users").then(function (exists) {
    if (!exists) {
      return knex.schema.createTable("users", (table) => {
        table.increments("id").primary();
        table.string("name", 100).notNullable();
        table.string("email", 100).notNullable().unique();
        table.string("password", 255).notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
      });
    }
    console.log('✅ Table "users" already exists, skipping creation');
    return Promise.resolve();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
