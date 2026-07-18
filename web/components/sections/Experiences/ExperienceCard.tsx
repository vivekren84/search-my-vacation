type ExperienceCardProps = {
  icon: string;
  title: string;
  description: string;
};

export default function ExperienceCard({
  icon,
  title,
  description,
}: ExperienceCardProps) {
  return (
    <div className="group rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="text-5xl transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>

      <h3 className="mt-6 text-xl font-semibold text-gray-900">
        {title}
      </h3>

      <p className="mt-4 text-sm leading-7 text-gray-600">
        {description}
      </p>
    </div>
  );
}