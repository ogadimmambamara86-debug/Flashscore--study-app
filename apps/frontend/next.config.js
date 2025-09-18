"use client";

import React, { useState, useEffect } from "react";

// Corrected imports using aliases
import LaunchController from "@controllers/LaunchController";
import OddsController from "@controllers/OddsController";
import MarketController from "@controllers/MarketController";
import RiskController from "@controllers/RiskController";
import NotificationController from "@controllers/NotificationController";
import DataController from "@controllers/DataController";

// If you have any shared types/models
import { Module } from "@shared/types/Module";
// import { Prediction } from "@shared/models/Prediction"; // example

// Now the rest of your component code stays the same