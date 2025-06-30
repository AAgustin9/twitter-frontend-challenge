import { ReactNode } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
    children: ReactNode;
    containerId?: string;
}

const PortalHelper = ({ children, containerId = "portal-root" }: PortalProps) => {
    const container = document.getElementById(containerId);
    return container ? createPortal(children, container) : null;
};

export default PortalHelper;