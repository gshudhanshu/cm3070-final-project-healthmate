import {
  HomeIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

// Features data
const features = [
  {
    idx: 1,
    name: "Instant Medical Consultations",
    description:
      "Immediate access to doctors and healthcare advice with just one click.",
    icon: HomeIcon,
  },
  {
    idx: 2,
    name: "Comprehensive Health Services",
    description:
      "From primary care to chronic disease management, we cover all your health needs.",
    icon: UserGroupIcon,
  },
  {
    idx: 3,
    name: "Guaranteed Privacy & Security",
    description:
      "We ensure strict confidentiality and protection of your health data.",
    icon: ShieldCheckIcon,
  },
  {
    idx: 4,
    name: "User-Friendly Interface",
    description:
      "Ease of use for appointments and information at your fingertips.",
    icon: DevicePhoneMobileIcon,
  },
  {
    idx: 5,
    name: "Accessible Anywhere",
    description:
      "Healthcare without borders, available in the most remote locations.",
    icon: GlobeAltIcon,
  },
  {
    idx: 6,
    name: "Empowering Patient Education",
    description:
      "Learn about health conditions and prevention with our resource center.",
    icon: AcademicCapIcon,
  },
  {
    idx: 7,
    name: "Real-Time Communication",
    description:
      "Seamless video and audio chats for effective remote consultations.",
    icon: ChatBubbleOvalLeftEllipsisIcon,
  },
  {
    idx: 8,
    name: "Affordable Care Options",
    description:
      "Economical healthcare solutions to ease your medical expenses.",
    icon: CurrencyDollarIcon,
  },
];

export default function Features() {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-20 flex w-full flex-col text-center">
        <h1 className="mb-4 text-2xl font-bold text-slate-800 sm:text-3xl dark:text-slate-100">
          Empowering Your Health Journey
        </h1>
        <p className="mx-auto text-base leading-relaxed lg:w-2/3">
          Explore our key features designed to bring quality healthcare to your
          fingertips, no matter where you are.
        </p>
      </div>
      <div className="grid items-start gap-12 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div
            key={feature.idx}
            className="flex flex-col items-center text-slate-600 dark:text-slate-400 "
          >
            <div className="relative flex h-16 w-16 items-center justify-center rounded-xl bg-white before:absolute before:-inset-px before:-z-[1] before:rounded-xl before:bg-gradient-to-br before:from-green-500 before:via-transparent before:to-green-600 dark:bg-slate-900">
              <feature.icon className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-5 text-center">
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-100">
                {feature.name}
              </h3>
              <p className="mt-1">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
