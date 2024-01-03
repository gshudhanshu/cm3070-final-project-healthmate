import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

const faqs = [
  {
    idx: 1,
    question: "How do I sign up for Health Mate services?",
    answer:
      "Signing up is simple. Click the 'Sign Up' button, provide the required information, and you'll be all set to schedule your first consultation.",
  },
  {
    idx: 2,
    question: "What medical services does Health Mate provide?",
    answer:
      "Our platform offers primary care, chronic disease management, mental health services, and health education.",
  },
  {
    idx: 3,
    question: "Is my health information secure with Health Mate?",
    answer:
      "Yes, your privacy is our priority. We adhere to HIPAA regulations to ensure your data's security and confidentiality.",
  },
  {
    idx: 4,
    question: "What equipment do I need for a telemedicine appointment?",
    answer:
      "You'll need a device with a camera and internet connectivity, such as a computer, tablet, or smartphone.",
  },
  {
    idx: 5,
    question: "Can I access Health Mate from anywhere?",
    answer:
      "Absolutely, our services are available to anyone with an internet connection, regardless of location.",
  },
  {
    idx: 6,
    question: "How much does it cost to use Health Mate?",
    answer:
      "We strive to offer affordable care. Visit our 'Pricing' page for details on costs and subscription options.",
  },
  {
    idx: 7,
    question: "What if I need a prescription?",
    answer:
      "Our providers can prescribe medications, which you can pick up from your local pharmacy.",
  },
  {
    idx: 8,
    question: "How do I make an appointment?",
    answer:
      "Log in to your dashboard, click 'Schedule Appointment,' choose a provider, and select a suitable time.",
  },
  {
    idx: 9,
    question: "What if I'm having technical issues?",
    answer:
      "Our support team is here to help. Reach out via our 'Help' section or call our support line.",
  },
  {
    idx: 10,
    question: "Is Health Mate suitable for emergency situations?",
    answer:
      "No, it is not for emergencies. In urgent cases, contact your local emergency services immediately.",
  },
];

export default function Faqs() {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-20 flex w-full flex-col text-center">
        <h1 className="mb-4 text-2xl font-bold text-slate-800 sm:text-3xl">
          Frequently Asked Questions
        </h1>
        <p className="mx-auto text-base leading-relaxed lg:w-2/3">
          Find quick answers to common queries about accessing and using our
          telemedicine services.
        </p>
      </div>
      <div>
        {faqs.map((faq) => (
          <Accordion
            key={faq.idx}
            type="single"
            collapsible
            className="m-auto w-full max-w-2xl"
          >
            <AccordionItem className="text-center" value="item-1">
              <AccordionTrigger className="flex justify-center gap-2 text-center">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-center">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </section>
  );
}
