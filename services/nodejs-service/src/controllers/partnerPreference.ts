import { Request, Response } from "express";
import { validate } from "class-validator";
import { AppDataSource } from "..";
import { DatifyyUserPartnerPreferences } from "../models/entities/DatifyyUserPartnerPreferences";
import { DatifyyUsersLogin } from "../models/entities/DatifyyUsersLogin";



/**
 * Get partner preferences by user ID
 */
export const getPartnerPreferences = async (req: Request, res: Response) => {
    const partnerPreferencesRepo = AppDataSource.getRepository(DatifyyUserPartnerPreferences);

  try {
    const userId = Number(req.user.id);

    if (!userId) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
    }
      
          
    const user = await AppDataSource.getRepository(DatifyyUsersLogin).findOne({
        where: { id: userId },
    });

    if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
    }

    const preferences = await partnerPreferencesRepo.findOne({
      where: { user: { id: userId } },
    });

      res.status(200).json(preferences);
      return;
  } catch (error) {
    console.error("Error fetching partner preferences:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
  }
};

/**
 * Partially update partner preferences using PATCH
 */
export const updatePartnerPreferences = async (req: Request, res: Response) => {
    const partnerPreferencesRepo = AppDataSource.getRepository(DatifyyUserPartnerPreferences);

  try {
      const userId = Number(req.user.id);
      
    const user = await AppDataSource.getRepository(DatifyyUsersLogin).findOne({
        where: { id: userId },
    });

    if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
    }

    if (!userId) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
    }

    let preferences = await partnerPreferencesRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!preferences) {
        preferences = new DatifyyUserPartnerPreferences();
        preferences.user = user;
        await partnerPreferencesRepo.save(preferences);
        preferences.user = user;
    }

    // Merge updated fields
    partnerPreferencesRepo.merge(preferences, req.body);

    // Validate data before saving
    const errors = await validate(preferences);
    if (errors.length > 0) {
        res.status(400).json({ error: "Validation failed", details: errors });
        return;
    }

    const updatedPreferences = await partnerPreferencesRepo.save(preferences);
      res.status(200).json(updatedPreferences);
      return;
  } catch (error) {
    console.error("Error updating partner preferences:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
  }
};

/**
 * Delete partner preferences (Optional)
 */
export const deletePartnerPreferences = async (req: Request, res: Response) => {
        const partnerPreferencesRepo = AppDataSource.getRepository(DatifyyUserPartnerPreferences);

  try {
    const userId = Number(req.params.userId);

    if (!userId) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
    }

    const preferences = await partnerPreferencesRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!preferences) {
        res.status(404).json({ error: "Preferences not found" });
        return;
    }

    await partnerPreferencesRepo.remove(preferences);
      res.status(200).json({ message: "Preferences deleted successfully" });
      return;
  } catch (error) {
    console.error("Error deleting partner preferences:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
  }
};
