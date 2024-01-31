import { useRouter, permanentRedirect } from "next/navigation";

export default function page() {
  permanentRedirect("/dashboard/messages");
}
