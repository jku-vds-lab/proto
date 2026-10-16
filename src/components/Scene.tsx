import { motion } from 'framer-motion'
import { type ReactNode } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* The page's type scale, top to bottom. Adding the section leads on 2026-08-10 put
   a 3xl/4xl heading directly above the 4xl/5xl scene titles it governed, so the
   headline was a step smaller than its own subheads. The scale is now strictly
   descending and nothing else should be inserted into it without moving a level:

     hero title            5xl / 7xl
     section heading       4xl / 5xl   ← SectionHeader, and `lead` scenes below
     subsection / scene    3xl / 4xl
     in-scene subhead      2xl / 3xl

   And the vertical rhythm, at md. A scene's top padding is deliberately smaller
   than its bottom, so a heading placed between two scenes falls toward the one it
   names instead of floating midway:

     scene → scene              6rem + 4rem = 10rem
     scene → section heading    6rem + 4rem = 10rem, then 4rem down to its scene
     scene → subsection heading 6rem + 1.5rem, then 4rem down to its scene

   `lead` marks a scene that IS a section — introduction, conclusion, references,
   acknowledgements have no separate lead above them, so they carry section size. */
export function SceneShell({
  number,
  kicker,
  title,
  children,
  id,
  lead = false,
}: {
  number: string
  /* optional: a section whose title already IS its name (Acknowledgements) would
     otherwise print the same word twice, six pixels apart */
  kicker?: string
  /* optional: a scene that is the only one under a SubsectionHeader would print a
     second headline for the same content. It keeps its number and kicker. */
  title?: ReactNode
  children: ReactNode
  id?: string
  lead?: boolean
}) {
  return (
    <section id={id} className="relative mx-auto w-full max-w-6xl px-6 pt-12 pb-20 md:pt-16 md:pb-24">
      <Reveal>
        <div className="scene-number">{number}</div>
        {kicker && (
          <div className="mt-2 font-mono2 text-xs tracking-[0.2em] uppercase text-foreground/40">{kicker}</div>
        )}
        {title && (
          <h2
            className={`font-display mt-4 max-w-3xl leading-[1.08] font-light ${
              lead ? 'text-4xl md:text-5xl' : 'text-3xl md:text-4xl'
            }`}
          >
            {title}
          </h2>
        )}
      </Reveal>
      <div className={title ? 'mt-10' : 'mt-6'}>{children}</div>
    </section>
  )
}

/* One heading per section, named exactly as the NavRail names it (2026-08-11,
   Giray). Before this, a section announced itself three times over: a PartDivider
   rule carrying the rail's label, then an <h2> paraphrasing it, then the first
   scene's kicker prefixing it again. The rail's label is now the only name, the
   divider's caption became this subtitle, and the scene kickers dropped their
   section prefix. Titles live in Home.tsx beside the section structure, so the
   rail and the page cannot drift apart. */
export function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  /* No leading rule, and no ml on the subtitle. The rule cost w-10 + gap-4 = 3.5rem
     of indent, which pushed every section heading that far right of the body text it
     introduces — the one element on the page not sharing the prose's left edge. */
  return (
    <div className="mx-auto mt-16 w-full max-w-6xl px-6">
      <Reveal>
        <h2 className="font-display max-w-4xl text-4xl leading-tight font-light md:text-5xl">{title}</h2>
        {sub && <p className="mt-4 max-w-2xl text-[15px] leading-6 text-foreground/50">{sub}</p>}
      </Reveal>
    </div>
  )
}

/* SubsectionHeader was removed 2026-08-11 (Giray). It rendered a step below the
   scene titles it introduced, so the stabilization heading came out smaller than
   "Fixed in the first third of denoising." would have been — an inverted hierarchy
   again. That heading now uses SectionHeader like every other one; its subordinate
   position is carried by where it sits and by having no NavRail stop, not by size. */

export function TierNote({ tier, text }: { tier: 'evidence' | 'illustration' | 'sim'; text: string }) {
  void tier // badges removed per design feedback; the note text stays as a quiet footnote
  return <p className="font-mono2 text-[11px] leading-5 text-foreground/45">{text}</p>
}

export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-border bg-card/80 p-6 shadow-[0_0_60px_-20px_rgba(0,0,0,0.8)] md:p-8 ${className}`}>
      {children}
    </div>
  )
}

/* Term pop-ups (2026-10-16, Giray). The five "glossary · X" InfoBoxes used to sit
   folded shut under the paragraph that first used the term: a reader who did not
   know the word had to notice the box, stop, and click it open — and a reader who
   did not notice it went on without the definition. The definitions now ride on
   the words themselves. Each term's FIRST encounter in the page's running prose is
   dotted-underlined and opens this pop-up on hover or keyboard focus; headings,
   kickers and titles never carry one, and later mentions carry no decoration.
   InfoBox had no other consumers and is gone. The five placements: prompt guidance
   + seed (Introduction), embedding (Part I section lead), text encoder (scene 04's
   first sentence), annotator (scene 07's first sentence).
   Styled as the page's own card idiom rather than the inverted shadcn pill; the
   arrow's bg/fill are overridden through the content class. */
export function GlossaryTerm({ term, def, children }: { term: string; def: ReactNode; children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          tabIndex={0}
          className="cursor-help underline decoration-dotted decoration-foreground/60 underline-offset-4 outline-none transition-colors hover:decoration-amber-200/80 focus-visible:decoration-amber-200/80"
        >
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        sideOffset={10}
        className="w-72 max-w-[80vw] rounded-lg border border-border bg-background p-3 text-left text-[12px] leading-5 tracking-normal text-foreground/70 normal-case shadow-xl [&_svg]:bg-background [&_svg]:fill-background"
      >
        <span className="mb-1.5 block font-mono2 text-[9px] tracking-widest text-foreground/40 uppercase">
          glossary · {term}
        </span>
        {def}
      </TooltipContent>
    </Tooltip>
  )
}
