import { avoidElementClassName } from "../../utils/classNames";
import useRoastnestContext from "./useRoastnestContext";

const useRoastnest = () => {
    const { active, toggleActive, setIslandVisiblity, setUser } = useRoastnestContext();

    return {
        isWidgetActive: active,
        toggleWidget: toggleActive,
        avoidElementClassName,
        setIslandVisiblity,
        setUser,
    };
};

export default useRoastnest;
