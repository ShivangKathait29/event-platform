import Link from "next/link"
import Image from "next/image"
const Navbar = () => {
    return (
        <header>
            <nav>
                <div className="logo">
                    <Link href="/" className="logo">
                    <Image src="/icons/logo.png" alt="logo" width={20} height={20} />
                    <p>Event Platform</p>
                    </Link>
                </div>
                <ul>
                    <Link href="/">Home</Link>
                    <Link href="/">Events</Link>
                    <Link href="/">Create</Link>
                </ul>
            </nav>
        </header>
    )
}

export default Navbar