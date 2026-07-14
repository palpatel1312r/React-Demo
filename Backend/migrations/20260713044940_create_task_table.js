exports.up = async function (knex) {
  // Add order column
  const hasOrder = await knex.schema.hasColumn("tasks", "order");
  if (!hasOrder) {
    await knex.schema.table("tasks", function (table) {
      table.integer("order").defaultTo(0);
    });
  }

  // Add assigned_to column
  const hasAssignedTo = await knex.schema.hasColumn("tasks", "assigned_to");
  if (!hasAssignedTo) {
    await knex.schema.table("tasks", function (table) {
      table.integer("assigned_to").unsigned().nullable();
      table
        .foreign("assigned_to")
        .references("id")
        .inTable("users")
        .onDelete("SET NULL");
    });
  }
};

exports.down = async function (knex) {
  await knex.schema.table("tasks", function (table) {
    table.dropColumn("order");
    table.dropForeign(["assigned_to"]);
    table.dropColumn("assigned_to");
  });
};
