To import latest entities from db
Run: npx typeorm-model-generator  -h host -u user -x password -p port  -o ./src/models  -d dbname  -e postgres --ssl true

To read about https://typeorm.io/data-source

### to see constraints in a table
If you can see the constraints in pgAdmin for datifyy_events, then you likely have a CHECK constraint defining the allowed values. You can retrieve the details of this constraint with the following SQL query, which will show the constraint definition for that specific table and column:

sql
Copy code
SELECT conname AS constraint_name, 
       pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'datifyy_events'::regclass;
This will display all constraints on the datifyy_events table, including any CHECK constraints that define specific allowed values. Look in the constraint_definition column for those constraints that specify allowed values.


├── controllers/     (HTTP layer - req/res handling only)
├── services/        (Business logic)
├── repositories/    (Data access layer)
├── dto/            (Data Transfer Objects)
├── mappers/        (Entity <-> DTO mapping)
├── validators/     (Input validation)
├── middleware/     (Cross-cutting concerns)
├── errors/         (Custom error types)
├── utils/          (Shared utilities)
└── di/             (Dependency injection setup)



REDIS: https://cloud.redis.io/#/databases/13372179/subscription/2822371/view-bdb/configuration
IMAGE: R2 Cloudfront