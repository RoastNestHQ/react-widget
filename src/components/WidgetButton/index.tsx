import { avoidElementClassName, buttonElmentClassName } from "../../utils/classNames";
import defaultCustomize from "../../utils/defaultCustomize";
import useRoastWidget from "../../hooks/useRoastWidget";
import clsx from "clsx";
import "./styles.css";
import SquareSolidPointerIcon from "../../icons/SquareSolidPointer";
import SquareDashPointerIcon from "../../icons/SquareDashPointer";

function WidgetButton() {
    const { active, customize, toggleActive, IslandHidden } = useRoastWidget();

    if (IslandHidden) return null;

    const islandMode = customize?.island?.mode ?? defaultCustomize?.island?.mode;

    if (islandMode === "icon") {
        return (
            <div
                data-placement={customize?.island?.placement || defaultCustomize.island?.placement}
                className={clsx(buttonElmentClassName, avoidElementClassName, customize?.island?.className)}
                onClick={toggleActive}
                data-active={active}
                data-mode="icon"
            >
                {active ? <SquareSolidPointerIcon /> : <SquareDashPointerIcon />}
            </div>
        );
    }

    return (
        <div
            data-placement={customize?.island?.placement || defaultCustomize.island?.placement}
            className={clsx(buttonElmentClassName, avoidElementClassName, customize?.island?.className)}
            onClick={toggleActive}
        >
            <p>{customize?.island?.label || defaultCustomize.island?.label}</p>
            <div className={clsx("switch-btn", customize?.island?.switchButton?.className)} data-active={active}>
                <span className={clsx("circle", customize?.island?.switchButton?.thumb?.className)} />
            </div>
        </div>
    );
}

export default WidgetButton;
