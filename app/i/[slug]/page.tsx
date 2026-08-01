import { notFound } from "next/navigation";
import { getGuestBySlug } from "@/lib/guests";
import Invitation from "@/components/invitation";

/* Cada invitado ve su propio estado de RSVP, así que nada de caché. */
export const dynamic = "force-dynamic";

export default async function InvitationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guest = await getGuestBySlug(slug);
  if (!guest) notFound();

  return (
    <Invitation
      guestName={guest.name}
      slug={guest.slug}
      seats={guest.seats}
      initialConfirmed={guest.confirmed}
    />
  );
}
