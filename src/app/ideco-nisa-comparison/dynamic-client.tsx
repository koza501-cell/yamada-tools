"use client";
import dynamic from "next/dynamic";
const IdecoNisaComparisonClient = dynamic(() => import("./client"), { ssr: false });
export default IdecoNisaComparisonClient;
