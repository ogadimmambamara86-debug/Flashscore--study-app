import { Request, Response } from "express";
import { Match } from "../models/Match";

// GET all matches
export const getMatches = async (req: Request, res: Response) => {
  try {
    const matches = await Match.find().sort({ date: -1 });
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch matches" });
  }
};

// POST new match
export const createMatch = async (req: Request, res: Response) => {
  try {
    const match = new Match(req.body);
    await match.save();
    res.status(201).json(match);
  } catch (err) {
    res.status(400).json({ error: "Failed to create match" });
  }
};