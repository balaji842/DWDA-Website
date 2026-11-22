# Website images — names, sizes and AI prompts

Put each image in this folder (`frontend/public/images/`) with **exactly** the file name below.
The site picks it up automatically, with no code change. Until a file exists, that slot shows a designed illustration, never a broken image.

**Format:** WebP, quality about 80. Keep each file under 300 KB (the hero under 400 KB).
To convert: `npx @squoosh/cli --webp '{"quality":80}' your-image.png` or any image editor.

## Before you publish

- **Prefer real, consented photographs for the live site.** AI images of disabled people can look inaccurate or stereotyped. If you use AI images, check each one carefully: wheelchairs, hearing aids, white canes and hands are often drawn wrong.
- Show people **doing things** — studying, working, laughing, playing. Avoid pity, "brave" or "inspirational" framing.
- Choose people from Tamil Nadu: varied ages, genders and skin tones; everyday Tamil clothing; real local places.
- No text, logos, emblems, flags or real buses or brands in the image.
- The alt text is already written in the code (listed below) — if your image shows something different, update the alt text too.

**Style suffix to add to every prompt:**
`photorealistic, natural daylight, warm and hopeful mood, authentic Tamil Nadu setting, candid documentary style, shallow depth of field, no text, no logos, respectful and dignified representation`

---

| File | Size (px) | Where it appears |
|---|---|---|
| `hero.webp` | 1600 × 760 (about 2.1 : 1) | Home page, hero (right side). **Included now:** cropped from your mockup at low resolution — replace with a full-size version. |
| `disability-autism.webp` | 1200 × 750 | Home "four disabilities" card, Disabilities pages |
| `disability-cerebral-palsy.webp` | 1200 × 750 | same |
| `disability-intellectual.webp` | 1200 × 750 | same |
| `disability-multiple.webp` | 1200 × 750 | same |
| `service-udid.webp` | 800 × 600 | Home "Services for every need" |
| `service-early-intervention.webp` | 800 × 600 | same |
| `service-education.webp` | 800 × 600 | same |
| `service-devices.webp` | 800 × 600 | same |
| `service-employment.webp` | 800 × 600 | same |
| `service-rehabilitation.webp` | 800 × 600 | same |
| `service-social-security.webp` | 800 × 600 | same |

## Prompts

**hero.webp**
> A group of five young adults with different disabilities smiling together outdoors on a college campus in Chennai, Tamil Nadu: a young woman with Down syndrome, a young man wearing a hearing aid, a young woman using a manual wheelchair, a middle-aged woman with dark glasses holding a white cane, and a young man with cerebral palsy. Green trees and a heritage building softly blurred behind them, clear blue sky, wide horizontal composition with space on the left.

Alt text in code: *"A group of people with different disabilities smiling together on a college campus in Tamil Nadu"*

**disability-autism.webp**
> A calm, bright therapy room in Tamil Nadu. An 8-year-old Tamil boy sorts colourful picture cards on a low table with a kind female special educator in a cotton salwar. A visual daily timetable with simple pictures on the wall. Soft natural light, focused and happy expression.

**disability-cerebral-palsy.webp**
> A Tamil girl of about 10 with cerebral palsy, using a supportive walker, laughing with a physiotherapist during a session in a clean government rehabilitation centre. Parallel bars and therapy mats in the background, bright and hopeful.

**disability-intellectual.webp**
> A young Tamil woman in her early twenties with an intellectual disability, smiling as she arranges handmade paper bags in a vocational training workshop, with a supportive instructor nearby. Colourful products on shelves, warm light.

**disability-multiple.webp**
> A Tamil mother sitting beside her teenage son, who uses a supportive wheelchair and has multiple disabilities, at a day-care centre. A caregiver shows a tactile communication board. Warm, gentle, respectful moment of connection.

**service-udid.webp**
> Close-up of an adult's hands holding a plain blue identity card at a government office help desk in Tamil Nadu, with an official's hand pointing to a form. The card has no readable text or emblem.

**service-early-intervention.webp**
> A toddler playing with sensory toys on a soft mat while a therapist and the child's mother watch and encourage, in a bright early-intervention centre.

**service-education.webp**
> A Tamil schoolgirl with a hearing aid reading with a teacher in a bright inclusive classroom; classmates in school uniform softly blurred in the background.

**service-devices.webp**
> A young Tamil man trying a new lightweight wheelchair with a technician adjusting it, outdoors in a clean courtyard. Optionally a modern prosthetic leg in view.

**service-employment.webp**
> A young Tamil man using a wheelchair working confidently at a computer in a modern office, with a colleague beside him.

**service-rehabilitation.webp**
> An occupational therapist helping an adult woman practise grip strength with a therapy ball in a clean, well-lit rehabilitation home.

**service-social-security.webp**
> An elderly Tamil couple, one using a walking stick, smiling at the doorstep of their home in a village, receiving support from a friendly field officer.