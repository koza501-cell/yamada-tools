"use client";
import dynamic from "next/dynamic";
const NisaSimulatorClient = dynamic(() => import("./client"), { ssr: false });
export default NisaSimulatorClient;
