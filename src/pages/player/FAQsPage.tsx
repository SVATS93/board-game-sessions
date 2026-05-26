import Shell from "@/components/layout/Shell"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Phase 2: Supabase query from faqs table
const FAQS = [
  {
    q: "How do I reserve a spot for a game session?",
    a: "Go to Schedule → Upcoming Games. Click the chevron on any game row to expand the details. You'll see the current booking status and a Reserve button. Click it, select whether you need a teaching session, and confirm. You'll appear in the players list once payment is confirmed.",
  },
  {
    q: "What does \"Needs teaching\" mean on the player tiles?",
    a: "When you reserve a game, you can indicate whether you already know the rules or need a walkthrough. Green tiles = players who know the game. Amber tiles = players who need a teaching session. This helps the session host plan the evening accordingly.",
  },
  {
    q: "How is the PHS score calculated?",
    a: "PHS Score = (40·√HR + 30·√GR + 30·√SR) × (1 + log(1 + D/30)), where HR = hours played per week, GR = unique games played per week, SR = unique gamers met per week, D = days since joining. The formula normalises for tenure so newer players can still compete with veterans.",
  },
  {
    q: "What happens if a session is full?",
    a: "You can join the waitlist by clicking \"Join waitlist\" on the game detail card. Your waitlist position will be shown in My Games. If a spot opens up (e.g. a cancellation), you'll be notified and bumped up in order.",
  },
  {
    q: "How do I update my profile details?",
    a: "Click \"My Profile\" in the left sidebar. You can update your first name, last name, mobile number, and email there. Hit the Update button to save changes.",
  },
  {
    q: "What games are available to play?",
    a: "Browse the full game collection in the Game Library section. You can see each game's BoardGameGeek stats, player count, time to play, complexity weight, and availability status.",
  },
  {
    q: "Can I cancel a booking?",
    a: "Please reach out through WhatsApp or Instagram (links in Community Guidelines) to request a cancellation. A formal cancellation policy will be added soon.",
  },
]

export default function FAQsPage() {
  return (
    <Shell title="FAQs">
      <div className="max-w-2xl space-y-4">
        <h1 className="font-display text-3xl tracking-wider text-foreground">FAQs</h1>
        <Accordion type="single" collapsible className="space-y-2">
          {FAQS.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="rounded-xl border border-border bg-card px-5 data-[state=open]:border-brand-cyan/40 transition-colors"
            >
              <AccordionTrigger className="text-sm font-semibold text-left hover:no-underline hover:text-brand-cyan py-4">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Shell>
  )
}
