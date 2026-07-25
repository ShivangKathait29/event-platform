import Link from "next/link"

interface Props {
    title: string;
    image: string;
}
const EventCard = ({title, image}: Props) => {
    return (
        <div className="event-card">
            <div className="event-card-image">
                <img src={image} alt={title} />
            </div>
            <div className="event-card-content">
                <h3 className="event-card-title">Event Card Title</h3>
                <p className="event-card-description">Event Card Description</p>
                <Link href="/" className="event-card-button">Read More</Link>
            </div>
        </div>
    )
}

export default EventCard
