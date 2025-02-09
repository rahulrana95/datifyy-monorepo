import { Request, Response } from "express";
import { AppDataSource } from "..";

const parseEnumValues = (enumString: string): string[] => {
    return enumString.slice(1, -1).split(",");
};

export const getAllTables = async (req: Request, res: Response) => {
    try {
        const result = await AppDataSource.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        `);

        const tables = result.map((row: { table_name: string }) => row.table_name);

        res.status(200).json({ success: true, tables });
        return; // ✅ Explicit return after res
    } catch (error) {
        console.error("Error fetching tables:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
        return; // ✅ Explicit return after res
    }
};

export const getAllEnums = async (req: Request, res: Response) => {
    try {
        const result = await AppDataSource.query(`
            SELECT t.typname AS enum_name, 
                   array_agg(e.enumlabel) AS enum_values
            FROM pg_type t
            JOIN pg_enum e ON t.oid = e.enumtypid
            JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
            WHERE n.nspname = 'public'
            GROUP BY t.typname
            ORDER BY t.typname;
        `);

        // Transform result to ensure enum_values is an array of strings
        const formattedEnums = result.map((row: { enum_name: string; enum_values: string }) => ({
            enum_name: row.enum_name,
            enum_values: parseEnumValues(row.enum_values), // Already an array
        }));

        res.status(200).json({ success: true, enums: formattedEnums });
        return; // ✅ Explicit return after res
    } catch (error) {
        console.error("Error fetching enums:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
        return; // ✅ Explicit return after res
    }
};


export const updateEnums = async (req: Request, res: Response) => {
    try {
        const { enums } = req.body;

        if (!Array.isArray(enums) || enums.length === 0) {
            res.status(400).json({ success: false, message: "Invalid input data" });
            return;
        }

        const updatedEnums = [];

        for (const { name, values } of enums) {
            if (!name || !Array.isArray(values) || values.length === 0) {
                continue; // Skip invalid enum objects
            }

            // Fetch existing enum values
            const existingEnum = await AppDataSource.query(
                `SELECT unnest(enum_range(NULL::${name})) AS value`
            );

            const existingValues = existingEnum.map((row: any) => row.value);
            const valuesToAdd = values.filter((val) => !existingValues.includes(val));

            if (valuesToAdd.length === 0) {
                updatedEnums.push({ name, message: "No new values to add." });
                continue;
            }

            // Add new values to ENUM type
            for (const value of valuesToAdd) {
                await AppDataSource.query(`ALTER TYPE ${name} ADD VALUE IF NOT EXISTS '${value}'`);
            }

            // Fetch updated enum values
            const updatedEnum = await AppDataSource.query(
                `SELECT unnest(enum_range(NULL::${name})) AS value`
            );

            updatedEnums.push({
                name,
                updatedValues: updatedEnum.map((row: any) => row.value),
            });
        }

        res.status(200).json({
            success: true,
            message: "Enums updated successfully.",
            enums: updatedEnums,
        });
        return;
    } catch (error) {
        console.error("Error updating enums:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
        return;
    }
};
