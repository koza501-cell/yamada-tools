"use client";
import dynamic from "next/dynamic";
const RetirementSimulatorClient = dynamic(() => import("./client"), { ssr: false });
export default RetirementSimulatorClient;
