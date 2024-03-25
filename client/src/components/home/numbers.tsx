// Required data
const numbers = [
  {
    idx: 1,
    name: "Patients Reached",
    number: "1000+",
  },
  {
    idx: 2,
    name: "Cost Savings",
    number: "$10M",
  },
  {
    idx: 3,
    name: "Hours Available",
    number: "24/7",
  },
  {
    idx: 4,
    name: "Healthcare Providers",
    number: "100+",
  },
];

export default function Numbers() {
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
        {numbers.map((number) => (
          <div key={number.idx} className="text-center">
            <p className="text-5xl font-bold text-primary sm:text-6xl">
              {number.number}
            </p>
            <h4 className="sm:text-md text-md mt-2 font-semibold text-slate-700 sm:mt-3 dark:text-slate-200">
              {number.name}
            </h4>
          </div>
        ))}
      </div>
    </section>
  );
}
