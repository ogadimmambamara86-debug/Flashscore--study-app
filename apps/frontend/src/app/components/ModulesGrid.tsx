"use client";

import React, { useState, useEffect } from "react";

// Controllers
import LaunchController from "@controllers/LaunchController";
import OddsController from "@controllers/OddsController";
import MarketController from "@controllers/MarketController";
import RiskController from "@controllers/RiskController";
import NotificationController from "@controllers/NotificationController";
import DataController from "@controllers/DataController";

// Shared types (example)
import { Module } from "@shared/types/Module";
// import { Prediction } from "@shared/models/Prediction"; // if needed

// Components, hooks, services (if used)
import BackgroundParticles from "@components/BackgroundParticles";
import Header from "@components/Header";
import { useOfflineStatus } from "@hooks/useOfflineStatus";
import OfflineManager from "@components/OfflineManager";