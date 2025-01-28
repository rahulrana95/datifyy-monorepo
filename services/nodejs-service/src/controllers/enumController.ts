import { AppDataSource } from "..";
import { Request, Response } from 'express';

// Helper function to fetch enums and return in key-value format
const fetchEnumValues = async (tableName: string, schema: string = 'public') => {
    const query = `
        SELECT
            c.column_name,
            t.typname AS enum_type,
            e.enumlabel AS enum_value
        FROM
            information_schema.columns c
        JOIN
            pg_catalog.pg_type t ON c.udt_name = t.typname
        JOIN
            pg_catalog.pg_enum e ON t.oid = e.enumtypid
        JOIN
            pg_catalog.pg_namespace n ON n.oid = t.typnamespace
        WHERE
            c.table_name = $1
            AND n.nspname = $2
            AND t.typtype = 'e';
    `;

    const enumData = await AppDataSource.query(query, [tableName, schema]);

    // Format the results into key-value pairs { label: value, id: value }
    const formattedData = enumData.reduce((acc: any, { column_name, enum_type, enum_value }: any) => {
        if (!acc[column_name]) {
            acc[column_name] = [];
        }
        acc[column_name].push({
            label: enum_value,
            id: enum_value,
        });
        return acc;
    }, {});

    return formattedData;
};

// Define the API endpoint
export const getEnumValues = async (req: Request, res: Response): Promise<void> => {
    try {
        const tableName = 'datifyy_users_information';  // Change as necessary

        // Fetch enum values for the table
        const enumValues = await fetchEnumValues(tableName);

        // Return the formatted data
        res.status(200).json({ data: enumValues });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};