import { useContext } from "react";
import { RoastnestContext } from "../context";

const useRoastnestContext = () => {
	const context = useContext(RoastnestContext);
	if (!context) throw new Error("useRoastnestContext must be used within a RoastnestProvider");
	return context;
};

export default useRoastnestContext;
