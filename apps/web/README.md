# Tally Web

Web management console for Tally and public API for the Tally Raycast extension.

## Managing the Database Schema

1. Alter the schema in `src/db/schema/**.ts` as needed
2. Run `pnpx nx run @tally/web:"migrations:generate"` to generate migration SQL
   for the changes
3. Run `pnpx nx run @tally/web:migrate` to apply the migrations
