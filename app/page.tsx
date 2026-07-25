import EventCard from "@/components/EventCard";
import ExploreBtn  from "@/components/ExploreBtn";
import { events } from "@/lib/constants";

const Page = () => {
  return (
    <section>
      <h1 className="text-center">The Hub for Every Dev <br /> Event You Can't Miss</h1>
      <p className="text-center mt-5">Hackathons, Meetups, and Conferences, All in One Place</p>
      <ExploreBtn/>

      <div className="mt-20">
        <h3 className="text-2xl font-semibold mb-6">Featured Events</h3>
        <ul className="list-none grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <li key={event.slug}> 
          <EventCard {...event}/>
          </li>
        ))}
        </ul>   
      </div>
    </section>
  )
}

export default Page;