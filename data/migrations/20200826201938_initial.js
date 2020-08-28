exports.up = async function(knex) {
    await knex.schema.createTable("zoos", (table) => {
        table
            .increments("id")
        table
            .text("name")
            .notNull()
        table
            .text("address")
            .notNull()
            .unique()
    })
    // make species next because it does not depend on any other tables
    await knex.schema.createTable("species", (table) => {
        table
            .increments("id")
        table
            .text("name")
            .notNull().unique
    })
    // make animals table next
    await knex.schema.createTable("animals", (table) => {
        table
            .increments("id")
        table
            .text("name")
            .notNull()
        // create a foreign key
        // translates to "species_id" refers to "id" in the "species" table
        // not null, because what if the species is unknown
        table
            .integer("species_id")
            .references("id")
            .inTable("species")
            .onDelete("SET NULL")
    })
    // make zoos_animals table last
    await knex.schema.createTable("zoos_animals", (table) => {
        table
            .integer("zoo_id")
            .notNull()
            .references("id")
            .inTable("zoos")
            .onDelete("CASCADE")
            .onUpdate("CASCADE")
        table
            .integer("animal_id")
            .notNull()
            .references("id")
            .inTable("animals")
            .onDelete("CASCADE")
            .onUpdate("CASCADE")
        // knex.raw will pass "current_timestamp" without quotes, meaning it's an internal SQL variable and not a literal string
        table
            .date("from_date")
            .defaultTo(knex.raw("current_timestamp"))
            .notNull()
        table
            .date("to_date")
        // making the primary key
        // it is a combination of the foreign keys
        // it must be a unique combination
        // since this table doesn't need an ID column, we can make the primary key a combination of two columns rather than a single one
        table
            .primary(["zoo_id", "animal_id"])
    })
}

exports.down = async function(knex) {
    // drop tables in reverse order of how you made them
    // make sure to drop the tables in reverse order of how they were created to prevent dropping tables that are referenced by other foreign keys
    await knex.schema.dropTableIfExists("zoos_animals")
    await knex.schema.dropTableIfExists("animals")
    await knex.schema.dropTableIfExists("species")
    await knex.schema.dropTableIfExists("zoos")
}
