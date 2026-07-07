import { RoastnestContextType } from "../shared/types";
import { createContext } from "react";

export const RoastnestContext = createContext<RoastnestContextType | undefined>(undefined);
