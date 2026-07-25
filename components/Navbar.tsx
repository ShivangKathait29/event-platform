"use client";

import Link from "next/link";
import Image from "next/image";
import posthog from "posthog-js";

const Navbar = () => {
    function handleNavClick(label: string) {
        posthog.capture("nav_link_clicked", { nav_label: label });
    }

    return (
        <header>
            <nav>
                <div className="logo">
                    <Link href="/" className="logo" onClick={() => handleNavClick("Home Logo")}>
                    <Image src="/icons/logo.png" alt="logo" width={20} height={20} />
                    <p>Event Platform</p>
                    </Link>
                </div>
                <ul>
                    <Link href="/" onClick={() => handleNavClick("Home")}>Home</Link>
                    <Link href="/" onClick={() => handleNavClick("Events")}>Events</Link>
                    <Link href="/" onClick={() => handleNavClick("Create")}>Create</Link>
                </ul>
            </nav>
        </header>
    )
}

export default Navbar
