import React from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { HamburgerMenuIcon, EnvelopeClosedIcon, GearIcon } from "@radix-ui/react-icons";
import "./CollapsibleSidebar.css";
import {
    HomeIcon,
    CalendarIcon, /* For Events */
    ClipboardIcon, /* For Waitlist */
} from "@radix-ui/react-icons";
import { Link, useLocation } from "react-router-dom";

const CollapsibleSidebar: React.FC = () => {
    const [open, setOpen] = React.useState(false);
    const location = useLocation();

    return (
        <div className="sidebar-container">
            <Collapsible.Root open={open} onOpenChange={setOpen} className={`${open ? 'sidebar-open' : 'sidebar'}`}>
                {/* Toggle Button */}
                <Collapsible.Trigger asChild>
                    <button className="toggle-button">
                        <HamburgerMenuIcon />
                    </button>
                </Collapsible.Trigger>

                {/* Collapsible Content */}
                <Collapsible.Content className="sidebar-content">
                    <nav>
                        <ul>
                            <li className={location.pathname === "/admin" ? "active" : ""}>
                                <Link to="/admin">
                                    <HomeIcon /> <span>Home</span>
                                </Link>
                            </li>
                            <li className={location.pathname === "/admin/events" ? "active" : ""}>
                                <Link to="/admin/events">
                                    <CalendarIcon /> <span>Events</span>
                                </Link>
                            </li>
                            <li className={location.pathname === "/admin/waitlist" ? "active" : ""}>
                                <Link to="/admin/waitlist">
                                    <ClipboardIcon /> <span>WaitList</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </Collapsible.Content>
            </Collapsible.Root>
        </div>
    );
};

export default CollapsibleSidebar;
