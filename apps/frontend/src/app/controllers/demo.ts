import { User } from "@shared/models/user";
import { Match } from "@shared/models/match";

const sampleUser: User = {
  id: "1",
  name: "Daberev",
  email: "daberev@example.com",
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const sampleMatch: Match = {
  id: "m1",
  homeTeam: { id: "t1", name: "Team A", country: "Nigeria", createdAt: new Date(), updatedAt: new Date() },
  awayTeam: { id: "t2", name: "Team B", country: "Ghana", createdAt: new Date(), updatedAt: new Date() },
  matchDate: new Date(),
  competition: "Super League",
  status: "scheduled",
  createdAt: new Date(),
  updatedAt: new Date(),
};