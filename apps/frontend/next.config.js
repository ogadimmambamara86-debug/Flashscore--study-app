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

// Components, hooks, services (if used)
import BackgroundParticles from "@components/BackgroundParticles";
import Header from "@components/Header";
import OfflineManager from "@components/OfflineManager";
import { useOfflineStatus } from "@hooks/useOfflineStatus";