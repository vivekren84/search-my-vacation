import { travelExperiences } from "@/config/experiences.config";
import ExperienceCard from "./ExperienceCard";

export default function Experiences() {
  return (
    <section
      id="experiences"
      className="bg-white py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Where will your next story begin?
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            Discover journeys inspired by the experiences you've been dreaming
            about.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {travelExperiences.map((experience) => (
            <ExperienceCard
              key={experience.id}
              icon={experience.icon}
              title={experience.title}
              description={experience.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}