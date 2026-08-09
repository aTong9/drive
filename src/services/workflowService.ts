import davinciJson from "../../data/davinci-workflow.json" with { type: "json" };
import type { DavinciWorkflow } from "../types/domain.js";
export const davinciWorkflow = davinciJson as DavinciWorkflow;
