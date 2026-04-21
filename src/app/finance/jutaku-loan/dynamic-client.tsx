"use client";
import dynamic from "next/dynamic";
const JutakuLoanClient = dynamic(() => import("./client"), { ssr: false });
export default JutakuLoanClient;
