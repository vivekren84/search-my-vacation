"use client";

import { useEffect, useState } from "react";

import { passportStampConfig } from "@/config/journey-passport.config";

import styles from "./JourneyPassport.module.css";

export function PassportStamp() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const timer = window.setTimeout(() => setVisible(true), 80); return () => window.clearTimeout(timer); }, []);
  const today = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date()).toUpperCase();
  return <div className={`${styles.stamp} ${visible ? styles.stampVisible : ""}`} aria-label={`Journey Passport stamp: ${passportStampConfig.message}, ${today}, ${passportStampConfig.city}`}><span>{passportStampConfig.brand}</span><strong>{passportStampConfig.title}</strong><b>{passportStampConfig.message}</b><span>{today}</span><span>{passportStampConfig.city}</span></div>;
}
