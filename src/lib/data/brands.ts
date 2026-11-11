import type { Brand } from "./types";

export const BRANDS: Brand[] = [
  {
    slug: "raz",
    name: "Raz",
    category: "disposable",
    intro:
      "Raz disposables built their reputation on dense flavor and consistent draw, and they remain the single most asked-for brand at our Coral Springs counter.",
    history:
      "Raz emerged in the disposable wave when most brands prioritized puff count over flavor accuracy. Their formulation team tuned each release for clean fruit and beverage profiles that don't muddy as the device runs down, which is why Raz holds shelf space at premium retailers across South Florida.",
    distinct:
      "Where most large-format disposables lose flavor in the last quarter of the device, Raz holds taste through the final puff. The mesh coil construction is more consistent than most peers, and their flavor library leans toward cleaner fruit profiles instead of overly synthetic candy.",
    photos: [
      {
        src: "/brands/raz-vue-display.jpg",
        alt: "Raz Vue disposable vapes stacked on the counter at VaporTech USA in Coral Springs, in Triple Berry Lime, Strawberry Blast, White Gummy, Sour Apple Ice, Polar Ice and other flavors",
        width: 1206,
        height: 1435,
        caption: "The new Raz Vue, in stock at our Coral Springs counter.",
      },
    ],
    productHighlights: [
      "Raz Vue (50K normal mode, 25K boost mode, visible e-liquid)",
      "Raz CA6000 (6000 puff)",
      "Raz TN9000 (9000 puff)",
      "Raz DC25000 disposable with screen",
      "Full flavor library including Polar Ice, Blue Razz Ice, Mango Pineapple",
    ],
    faqs: [
      {
        question: "Are your Raz disposables authentic?",
        answer:
          "Yes. Every Raz device on our shelf comes from authorized distribution with batch tracking. Counterfeits are widespread online, and the difference in flavor and battery life is immediately obvious.",
      },
      {
        question: "Which Raz model lasts the longest?",
        answer:
          "The Raz Vue carries the highest puff count we stock, rated at 50K in normal mode and 25K in boost mode, with a window showing the e-liquid level. The DC25000 and TN9000 sit in the middle, and the CA6000 is the most affordable entry.",
      },
      {
        question: "Do you keep Raz in stock?",
        answer:
          "Daily restocks. Specific flavors move quickly, but we rotate inventory throughout the week and our staff can tell you exactly what arrived and what's about to.",
      },
    ],
    relatedBrandSlugs: ["lost-mary", "geek-bar", "yovo"],
    relatedCategorySlugs: ["disposable-vapes", "e-liquid"],
  },
  {
    slug: "lost-mary",
    name: "Lost Mary",
    category: "disposable",
    intro:
      "Lost Mary is the disposable that introduced a generation to mesh coil flavor accuracy at scale, and the OS5000 remains one of the most reliable devices on our floor.",
    history:
      "Lost Mary differentiated itself early with rounded ergonomics and a flavor library that leaned toward dessert and beverage profiles. The brand expanded fast across Europe and the United States and became a default reference point for the modern disposable category.",
    distinct:
      "The OS5000's housing fits the hand more naturally than most peers, and the flavor cycle is engineered to taper smoothly rather than fall off a cliff. Lost Mary also keeps a wider menthol and ice-forward selection than most disposable brands.",
    productHighlights: [
      "Lost Mary OS5000",
      "Lost Mary MO5000 (alternate model)",
      "Lost Mary BM600 (UK-spec smaller format)",
      "Library includes Blue Razz Ice, Watermelon Ice, Pink Lemonade, Strawberry Ice",
    ],
    faqs: [
      {
        question: "How long does a Lost Mary OS5000 last?",
        answer:
          "Roughly 5000 puffs at 13mL of e-liquid, which is typically a week to two weeks of use depending on draw frequency. The internal battery is rechargeable to ensure you finish the e-liquid.",
      },
      {
        question: "Are Lost Mary devices rechargeable?",
        answer:
          "Yes. The OS5000 has USB-C charging built in. You finish the e-liquid before the device is exhausted.",
      },
      {
        question: "Do you carry the latest Lost Mary flavors?",
        answer:
          "We restock from authorized distribution weekly and add new flavor releases as soon as they ship. Our Instagram lists current arrivals.",
      },
    ],
    relatedBrandSlugs: ["raz", "yovo", "geek-bar"],
    relatedCategorySlugs: ["disposable-vapes"],
  },
  {
    slug: "geek-bar",
    name: "Geek Bar",
    category: "disposable",
    intro:
      "Geek Bar built the modern disposable category. Their Pulse and Skyview lines remain reference-grade for flavor accuracy and battery longevity.",
    history:
      "Geek Bar launched as one of the first mass-market disposables and refined the format through multiple generations of devices. The Pulse introduced a screen and dual-mode operation, and the Skyview brought animated displays and high-puff-count formats that defined what a premium disposable looks like today.",
    distinct:
      "Build quality is the first thing experienced vapers notice. Geek Bar housings feel denser, the airflow is tuned tighter, and the flavor library spans a wider profile range than most competitors. The Pulse and Skyview lines also offer pulse mode for stronger throat hit on demand.",
    productHighlights: [
      "Geek Bar Pulse (15000 puff with screen)",
      "Geek Bar Skyview (25000 puff with animated screen)",
      "Geek Bar Meloso disposable line",
      "Flavor library spans 20 plus profiles",
    ],
    faqs: [
      {
        question: "What's the difference between Pulse and Skyview?",
        answer:
          "The Skyview is higher capacity and has an animated display. The Pulse is slightly more compact and uses a simpler readout. Both deliver excellent flavor; choose based on size preference and how often you want to recharge.",
      },
      {
        question: "Are Geek Bars worth the price?",
        answer:
          "Per puff, yes. The build quality and flavor consistency are noticeably better than budget disposables, and the puff counts on the Pulse and Skyview lines bring the cost-per-puff in line with cheaper options.",
      },
      {
        question: "Do you carry Geek Bar Pulse mode flavors?",
        answer:
          "Yes. We stock the full Pulse and Skyview flavor lineups available in current US distribution.",
      },
    ],
    relatedBrandSlugs: ["raz", "lost-mary", "funky-republic"],
    relatedCategorySlugs: ["disposable-vapes"],
  },
  {
    slug: "yovo",
    name: "Yovo",
    category: "disposable",
    intro:
      "Yovo is one of the newest names on our disposable wall. The JB 50000 pairs a see-through flavor pod with a compact rechargeable battery, and we keep more than 30 flavors available, all in stock.",
    history:
      "Yovo started with compact rechargeable disposables like the JB 8000 and moved up through higher-capacity releases including the Rama 16000, Ultra 18000, and Starwalk 40K. The JB 50000 is the current flagship: a two-piece design where the flavor pod and the battery come apart, so the device is built around swapping flavors.",
    distinct:
      "The JB 50000 is a mix and match system. The pod is rated at 50K puffs, runs a dual mesh coil, and has a clear window so you can see how much e-liquid is left. The 600mAh rechargeable battery is small enough for a pocket, and both airflow and wattage are adjustable, which is rare at this size.",
    photos: [
      {
        src: "/brands/yovo-jb50000-display.jpg",
        alt: "Yovo JB 50000 display on the counter at VaporTech USA in Coral Springs, with boxes of Triple Berry, Orange Ice, Mystic Berry Storm and Crimson Chill",
        width: 1200,
        height: 1600,
        caption:
          "Yovo JB 50000 at our Coral Springs counter. More than 30 flavors available, all in stock.",
      },
    ],
    productHighlights: [
      "Yovo JB 50000 (50K puff pod system)",
      "More than 30 flavors available, all in stock",
      "Dual mesh coil with visible e-liquid pod",
      "600mAh rechargeable battery, adjustable airflow and wattage",
      "Flavors include Triple Berry, Orange Ice, Blue Razz Ice, Sour Strawberry",
      "Exclusive flavors: Mystic Berry Storm and Crimson Chill",
    ],
    faqs: [
      {
        question: "How many Yovo flavors do you carry?",
        answer:
          "More than 30, and all of them are in stock at our Coral Springs store. The lineup includes Triple Berry, Orange Ice, Blue Razz Ice, and Sour Strawberry, plus exclusive flavors like Mystic Berry Storm and Crimson Chill.",
      },
      {
        question: "How does the Yovo JB 50000 work?",
        answer:
          "It comes in two parts: a flavor pod and a rechargeable battery. The pod is rated at 50K puffs with a dual mesh coil and a clear window for the e-liquid level. The 600mAh battery recharges and lets you adjust airflow and wattage.",
      },
      {
        question: "Can I change flavors on a Yovo?",
        answer:
          "Yes. The JB 50000 is designed to mix and match, so you can pair the battery with a different flavor pod. Ask our staff to show you how the pieces fit together.",
      },
    ],
    relatedBrandSlugs: ["raz", "geek-bar", "lost-mary"],
    relatedCategorySlugs: ["disposable-vapes"],
  },
  {
    slug: "funky-republic",
    name: "Funky Republic",
    category: "disposable",
    intro:
      "Funky Republic pushes the format toward higher puff counts and more vibrant flavor profiles. The Ti7000 is one of the strongest sellers in our store.",
    history:
      "Funky Republic launched with a focus on high-capacity disposables and a bolder flavor library. The Ti7000 became a fast favorite for users who wanted a longer-lasting device without stepping up to mod gear.",
    distinct:
      "The Ti7000 features a smart display showing battery and e-liquid level, plus a slightly tighter draw than most disposables in its class. Flavor profiles lean more vibrant and tropical, which appeals to summer-heavy markets like South Florida.",
    productHighlights: [
      "Funky Republic Ti7000",
      "Funky Lands Vi15000 collaboration",
      "Library includes Tropical Rainbow Blast, Raz Ice, Cherry Lemon",
    ],
    faqs: [
      {
        question: "What makes Funky Republic different?",
        answer:
          "A bolder flavor philosophy. Funky Republic leans more vibrant and tropical than most of the disposable wall, and the Ti7000 adds a smart display for battery and e-liquid level.",
      },
      {
        question: "Does the Ti7000 have a screen?",
        answer:
          "Yes. The Ti7000 includes a small display showing battery percentage and e-liquid level so you know when to charge or replace.",
      },
      {
        question: "What flavors are most popular?",
        answer:
          "Tropical Rainbow Blast and Raz Ice are our top sellers. Specific availability rotates weekly.",
      },
    ],
    relatedBrandSlugs: ["yovo", "lost-mary", "raz"],
    relatedCategorySlugs: ["disposable-vapes"],
  },
  {
    slug: "mr-fog",
    name: "Mr. Fog",
    category: "disposable",
    intro:
      "Mr. Fog is a workhorse disposable brand. The Switch and Max Air lines deliver reliable flavor at a price that keeps regulars coming back.",
    history:
      "Mr. Fog established itself in the early disposable era with a focus on practical reliability and accessible pricing. The brand expanded through the Switch (dual-flavor toggle) and Max Air (extended capacity) lines, both of which earned shelf space across mainstream retail.",
    distinct:
      "The Switch's dual-flavor toggle is unusual in the category and works as advertised. Mr. Fog also tends to keep flavors accurate to the package even at the lower price tier, which is rarer than it should be.",
    productHighlights: [
      "Mr. Fog Switch (dual flavor)",
      "Mr. Fog Max Air",
      "Mr. Fog Max Pro",
      "Library spans menthol, fruit, mint",
    ],
    faqs: [
      {
        question: "How does the Mr. Fog Switch work?",
        answer:
          "A small toggle on the device alternates between two pre-loaded flavors. The seal between the two reservoirs is tight enough that flavors don't blend.",
      },
      {
        question: "Are Mr. Fog devices rechargeable?",
        answer:
          "The Max Air and Max Pro models are rechargeable via USB-C. Older Switch units are not.",
      },
      {
        question: "Are Mr. Fog flavors accurate?",
        answer:
          "Yes. Especially in fruit and menthol profiles. Dessert flavors are good but occasionally less complex than premium-tier brands.",
      },
    ],
    relatedBrandSlugs: ["hyde", "esco-bar", "breeze"],
    relatedCategorySlugs: ["disposable-vapes"],
  },
  {
    slug: "hyde",
    name: "Hyde",
    category: "disposable",
    intro:
      "Hyde is a longtime disposable presence with a wide format catalog. The IQ, Edge, and Rebel lines all hold spots on our wall depending on what's currently in stock.",
    history:
      "Hyde was one of the earliest disposable brands to scale across the United States. The brand has cycled through multiple device generations, each adapting to the puff count and form factor demands of an evolving market.",
    distinct:
      "Hyde has range. The IQ stick format suits users who want simple. The Edge and Rebel lines bring rechargeability and higher capacities. Flavor is consistent across the line.",
    productHighlights: [
      "Hyde IQ",
      "Hyde Edge Rave",
      "Hyde Rebel Pro",
      "Hyde N-Bar",
    ],
    faqs: [
      {
        question: "Which Hyde lasts the longest?",
        answer:
          "The Rebel Pro and N-Bar are the highest-capacity formats currently available. The IQ stick is more compact and lower capacity but excellent for occasional use.",
      },
      {
        question: "Are all Hyde products rechargeable?",
        answer:
          "Most current Hyde models include USB-C charging. The IQ stick is not rechargeable. Check the model before buying if charging matters to you.",
      },
      {
        question: "Where are Hyde flavors strongest?",
        answer:
          "Fruit, ice, and menthol profiles are consistent. Dessert and beverage profiles are present but vary more across batches.",
      },
    ],
    relatedBrandSlugs: ["mr-fog", "esco-bar", "breeze"],
    relatedCategorySlugs: ["disposable-vapes"],
  },
  {
    slug: "esco-bar",
    name: "Esco Bar",
    category: "disposable",
    intro:
      "Esco Bar is the disposable that builds its identity around mesh coil clarity. The Mega and Mesh lines are core stock for South Florida customers who want clean fruit profiles.",
    history:
      "Esco Bar entered the disposable category with a focus on mesh coil construction at a time when most budget disposables still ran cotton-wrapped coils. The flavor accuracy that resulted made the brand a regular shelf-pick for retailers prioritizing taste consistency.",
    distinct:
      "Mesh coil consistency is Esco Bar's strongest argument. Flavor stays clean from first puff to last, and the brand keeps a tight flavor library focused on what actually sells.",
    productHighlights: [
      "Esco Bar Mega",
      "Esco Bar Mesh",
      "Esco Bar H2O (water-based formulation)",
      "Library focuses on fruit and ice profiles",
    ],
    faqs: [
      {
        question: "What is the Esco Bar H2O?",
        answer:
          "A water-based e-liquid formulation that some users find smoother than traditional propylene glycol or vegetable glycerin bases. Flavor profile and throat hit are slightly different from standard formulations.",
      },
      {
        question: "How long does an Esco Bar Mega last?",
        answer:
          "Roughly 5000 puffs depending on draw style. The Mesh line is similar capacity, with slight variation by model.",
      },
      {
        question: "Is Esco Bar good for fruit flavors?",
        answer:
          "Yes. Mesh coil construction is well-suited to clean fruit profiles, which is where Esco Bar's library is strongest.",
      },
    ],
    relatedBrandSlugs: ["mr-fog", "hyde", "breeze"],
    relatedCategorySlugs: ["disposable-vapes"],
  },
  {
    slug: "breeze",
    name: "Breeze",
    category: "disposable",
    intro:
      "Breeze is a staple in our disposable wall. Reliable, well-priced, and stocked across multiple capacity tiers.",
    history:
      "Breeze established its position by focusing on reliability over novelty. The Pro and Smoke lines have remained consistent product offerings over multiple years, which is unusual in a category that churns quickly.",
    distinct:
      "Breeze has held up. While many disposables come and go, Breeze still delivers what it promised three years ago: a pocketable disposable with accurate flavor at a reasonable price.",
    productHighlights: [
      "Breeze Pro",
      "Breeze Plus",
      "Breeze Smoke",
      "Flavor library focuses on classic fruit and menthol profiles",
    ],
    faqs: [
      {
        question: "Is Breeze rechargeable?",
        answer:
          "Some current Breeze models include USB-C charging. Older units are not. Check the specific model when buying.",
      },
      {
        question: "How does Breeze compare to Hyde?",
        answer:
          "Both are reliable mid-tier disposables. Breeze tends to run smoother on draw resistance; Hyde has more form factor variety. Pick the flavor profile that suits you.",
      },
      {
        question: "Do you stock current Breeze flavors?",
        answer:
          "Yes. We restock weekly from authorized distribution.",
      },
    ],
    relatedBrandSlugs: ["mr-fog", "hyde", "esco-bar"],
    relatedCategorySlugs: ["disposable-vapes"],
  },
  {
    slug: "yobo",
    name: "Yobo",
    category: "device",
    intro:
      "Yobo and the Yocan Yobo Trio sit in the dab device category. Portable, pocketable, and tuned for on-the-go concentrate use.",
    history:
      "Yocan has been making portable concentrate devices for years, and the Yobo line represents the brand's effort to make dab pens accessible without sacrificing build quality. The Trio is the current flagship that South Florida concentrate users ask for by name.",
    distinct:
      "Yobo devices use replaceable atomizer coils that match the concentrate type, and the build quality is genuinely solid for the price point. The Trio's three-power-setting system gives meaningful control over draw temperature.",
    productHighlights: [
      "Yobo Trio dab pen",
      "Replacement quartz and ceramic coils",
      "Dab tools and storage accessories",
    ],
    faqs: [
      {
        question: "What does the Yobo Trio dab?",
        answer:
          "Wax, shatter, crumble, and budder. It's not designed for distillate carts, which require a different battery format.",
      },
      {
        question: "How long does a coil last?",
        answer:
          "With regular cleaning, two to four weeks for daily use. Coils are replaceable and inexpensive.",
      },
      {
        question: "Is the Yobo Trio worth it?",
        answer:
          "For portable dabbing on a budget, yes. It won't replace a desktop e-rig for serious users, but it works well for daily portable use.",
      },
    ],
    relatedBrandSlugs: ["pax", "storz-bickel"],
    relatedCategorySlugs: ["thca", "delta-8"],
  },
  {
    slug: "mellow-fellow",
    name: "Mellow Fellow",
    category: "thc-derivative",
    intro:
      "Mellow Fellow runs one of the more transparent operations in the hemp-derived cannabinoid space. Their Delta-8 and HHC lines are core stock at our store.",
    history:
      "Mellow Fellow built its reputation on consistent batch testing and a willingness to publish full lab panels. The brand expanded across Delta-8, Delta-9, HHC, and various blended formulations while maintaining the lab transparency that earned its early customers.",
    distinct:
      "Lab panels for every batch, posted to their website. Effects descriptions are accurate to package, which is uncommon enough to matter.",
    productHighlights: [
      "Mellow Fellow Delta-8 carts and disposables",
      "HHC vape cartridges",
      "Blended cannabinoid edibles",
      "Live resin formulations",
    ],
    faqs: [
      {
        question: "Are Mellow Fellow products lab tested?",
        answer:
          "Yes, every batch. COAs are available in store and on the brand's website. Ask any staff member to pull the report for the batch you're buying.",
      },
      {
        question: "What's the difference between Delta-8 and HHC?",
        answer:
          "Both are minor cannabinoids with effects similar to Delta-9 THC. HHC is hexahydrocannabinol; users often describe it as slightly more sedative than Delta-8. Effect varies by individual.",
      },
      {
        question: "Are Mellow Fellow products legal in Florida?",
        answer:
          "Yes, hemp-derived products that meet the federal 0.3 percent Delta-9 THC threshold are currently legal. We monitor regulatory changes.",
      },
    ],
    relatedBrandSlugs: ["cake", "delta-extrax", "3chi"],
    relatedCategorySlugs: ["delta-8", "delta-9"],
  },
  {
    slug: "mood",
    name: "Mood",
    category: "thc-derivative",
    intro:
      "Mood Wellness builds hemp-derived edibles and tinctures focused on functional outcomes: sleep, focus, calm. Their Delta-9 and CBN lines are popular with users who don't want to smoke or vape.",
    history:
      "Mood Wellness positioned itself for the wellness-adjacent buyer who wanted hemp-derived effects without the smoke shop aesthetic. The brand's gummies and tinctures became a fast-moving SKU once functional cannabinoid blends caught on.",
    distinct:
      "Mood's edibles are dosed accurately and the formulations target specific outcomes. Their CBN sleep gummies in particular have repeat-buy data that backs up the marketing.",
    productHighlights: [
      "Mood Magic Mushroom Gummies (functional mushrooms, no psilocybin)",
      "CBN sleep gummies",
      "Delta-9 gummies",
      "Tinctures across cannabinoid blends",
    ],
    faqs: [
      {
        question: "Are Mood gummies psychoactive?",
        answer:
          "It depends on the formulation. Their Delta-9 line is psychoactive at advertised dose. CBN and CBD-only formulations are not. Check the label.",
      },
      {
        question: "Do Mood Magic Mushroom gummies contain psilocybin?",
        answer:
          "No. The functional mushroom blend uses lion's mane, reishi, cordyceps, and similar non-psychoactive species. They are not psilocybin products.",
      },
      {
        question: "What's the best Mood product for sleep?",
        answer:
          "The CBN sleep gummies are the most consistent feedback we get on this. Pair with a magnesium supplement for compounded effect, per customer reports.",
      },
    ],
    relatedBrandSlugs: ["tre-house", "cake", "hometown-hero"],
    relatedCategorySlugs: ["delta-9", "cbd"],
  },
  {
    slug: "cake",
    name: "Cake",
    category: "thc-derivative",
    intro:
      "Cake is one of the highest-volume hemp-derived brands in the country. Their disposables, carts, and edibles cover Delta-8, Delta-9, THCA, and live resin formulations.",
    history:
      "Cake scaled fast in the disposable hemp-derivative category. The brand has gone through multiple product generations and continues to release updated devices and live resin formulations targeted at users who want stronger effect.",
    distinct:
      "Cake's live resin disposables in particular deliver a fuller terpene profile than most peers. The brand stays current on regulatory shifts and rolls out compliant formulations as laws change.",
    productHighlights: [
      "Cake Delta-8 disposables",
      "Cake THCA live resin disposables",
      "Cake Delta-9 gummies",
      "Cake 510-thread vape cartridges",
    ],
    faqs: [
      {
        question: "Is Cake live resin different from Cake Delta-8?",
        answer:
          "Yes. Live resin uses a flash-frozen extraction process that preserves more of the terpene profile, producing a fuller-flavor experience. Standard Delta-8 distillate is more neutral.",
      },
      {
        question: "Do you carry Cake THCA products?",
        answer:
          "Yes, when available from authorized distribution. Specific Cake THCA SKUs vary based on regulation and distribution.",
      },
      {
        question: "Are Cake products lab tested?",
        answer:
          "Yes. Batch-specific COAs are available on the brand's website and in store on request.",
      },
    ],
    relatedBrandSlugs: ["mellow-fellow", "delta-extrax", "torch"],
    relatedCategorySlugs: ["delta-8", "thca", "delta-9"],
  },
  {
    slug: "delta-extrax",
    name: "Delta Extrax",
    category: "thc-derivative",
    intro:
      "Delta Extrax produces some of the most consistent vape cartridges in the hemp-derivative space, with formulations spanning Delta-8, Delta-10, THC-P, HHC, and live resin.",
    history:
      "Delta Extrax built its catalog around blended cannabinoid formulations, mixing classic Delta-8 with newer compounds like THC-P to deliver effects that pure single-cannabinoid products can't match. The brand's lab transparency is solid.",
    distinct:
      "Blended formulations are Delta Extrax's signature. The Pre-heat 2g cartridge format and the Lights Out blends in particular have earned repeat customers in our store.",
    productHighlights: [
      "Delta Extrax Lights Out blend cartridges",
      "Delta Extrax Pre-heat 2g carts",
      "Live Resin disposables",
      "Edibles across blended formulations",
    ],
    faqs: [
      {
        question: "What is THC-P?",
        answer:
          "THC-P is tetrahydrocannabiphorol, a cannabinoid found in trace amounts in cannabis and hemp. It's reported to be significantly more potent than Delta-9 THC. Most users find very small doses produce strong effects.",
      },
      {
        question: "What does the Lights Out blend do?",
        answer:
          "Lights Out is a sedative-leaning blend designed for evening or nighttime use. Specific cannabinoid content varies by SKU; check the package.",
      },
      {
        question: "How are blended cartridges different from single-cannabinoid carts?",
        answer:
          "Blends combine multiple cannabinoids to produce effects that no single compound delivers alone. They tend to feel more like full-spectrum cannabis than Delta-8 alone.",
      },
    ],
    relatedBrandSlugs: ["mellow-fellow", "cake", "3chi"],
    relatedCategorySlugs: ["delta-8", "delta-9"],
  },
  {
    slug: "3chi",
    name: "3CHI",
    category: "thc-derivative",
    intro:
      "3CHI is one of the original hemp-derived Delta-8 brands and remains a benchmark for clean distillate, accurate dosing, and full lab transparency.",
    history:
      "3CHI was among the first brands to bring hemp-derived Delta-8 to market at scale. Founded by chemists, the brand has maintained a focus on lab science and product purity through every category expansion.",
    distinct:
      "3CHI's distillate clarity and dosing accuracy set the standard for the category. Their Delta-8, Delta-9, and HHC formulations are reference points other brands measure themselves against.",
    productHighlights: [
      "3CHI Delta-8 vape cartridges",
      "3CHI Comfortably Numb (CBN/Delta-8 blend)",
      "3CHI Delta-9 gummies",
      "Pure cannabinoid distillates",
    ],
    faqs: [
      {
        question: "What is Comfortably Numb?",
        answer:
          "A blended formulation of CBN and Delta-8 designed for relaxation and sleep. One of the brand's most consistent customer-favorite products.",
      },
      {
        question: "Are 3CHI products lab tested?",
        answer:
          "Yes. Every batch publishes a full panel COA, available on the brand's website and in store on request.",
      },
      {
        question: "Is 3CHI worth the higher price?",
        answer:
          "For users who care about distillate quality and lab transparency, yes. The price reflects more thorough testing and cleaner extraction than budget brands.",
      },
    ],
    relatedBrandSlugs: ["mellow-fellow", "cake", "delta-extrax"],
    relatedCategorySlugs: ["delta-8", "delta-9"],
  },
  {
    slug: "urb",
    name: "Urb",
    category: "thc-derivative",
    intro:
      "Urb produces a wide range of hemp-derived products spanning disposables, carts, edibles, and pre-rolls. Solid mid-tier quality with consistent lab testing.",
    history:
      "Urb scaled its catalog quickly across multiple cannabinoid categories. The brand maintains lab transparency and adapts formulations as regulations and consumer preferences shift.",
    distinct:
      "Urb's pre-roll line and infused flower options stand out in the category. The brand keeps prices accessible while maintaining product quality that exceeds the budget tier.",
    productHighlights: [
      "Urb Delta-8 and THCA disposables",
      "Urb infused pre-rolls",
      "Urb edibles across cannabinoid blends",
      "Urb live resin carts",
    ],
    faqs: [
      {
        question: "What's in an Urb infused pre-roll?",
        answer:
          "Hemp flower infused with cannabinoid distillate or live resin, sometimes with a kief coating. Specific cannabinoid content varies by SKU; check the package.",
      },
      {
        question: "Is Urb worth the price?",
        answer:
          "Yes for the mid-tier. The quality is consistent, the lab testing is thorough, and the price stays accessible.",
      },
      {
        question: "Do you carry Urb pre-rolls?",
        answer:
          "When available from authorized distribution, yes. Specific SKUs rotate based on what's currently shipping.",
      },
    ],
    relatedBrandSlugs: ["3chi", "torch", "cake"],
    relatedCategorySlugs: ["delta-8", "thca"],
  },
  {
    slug: "tre-house",
    name: "TRĒ House",
    category: "thc-derivative",
    intro:
      "TRĒ House blends cannabinoids in formulations targeted at specific effects. The brand's gummies and disposables are popular with users who want predictable outcomes.",
    history:
      "TRĒ House built its identity around effect-targeted formulations rather than single-cannabinoid products. The brand has expanded through multiple gummy lines, vape cartridges, and disposables, each tuned to a specific use case.",
    distinct:
      "Effect-first product design. TRĒ House labels each product with the experience it's designed to produce, and the formulations actually deliver on those claims more often than not.",
    productHighlights: [
      "TRĒ House Delta-9 + HHC gummies",
      "TRĒ House Delta-8 + Live Resin disposables",
      "TRĒ House Magic THC mushroom gummies",
      "Cannabinoid-blended chocolate bars",
    ],
    faqs: [
      {
        question: "What's in TRĒ House Magic gummies?",
        answer:
          "Hemp-derived cannabinoids combined with functional mushroom blends. They do not contain psilocybin. Effects depend on the specific formulation.",
      },
      {
        question: "Are TRĒ House products federally compliant?",
        answer:
          "Yes. All formulations meet the federal 0.3 percent Delta-9 THC threshold under the 2018 Farm Bill.",
      },
      {
        question: "What's the difference between TRĒ House and Mood?",
        answer:
          "Both target specific effects with cannabinoid blends. TRĒ House leans more toward recreational format and flavor variety. Mood is more wellness-positioned.",
      },
    ],
    relatedBrandSlugs: ["mood", "cake", "hometown-hero"],
    relatedCategorySlugs: ["delta-9", "delta-8"],
  },
  {
    slug: "hometown-hero",
    name: "Hometown Hero",
    category: "thc-derivative",
    intro:
      "Hometown Hero is veteran-owned, Texas-based, and one of the most respected operators in the hemp-derived cannabinoid space. Their Delta-9 gummies are reference grade.",
    history:
      "Hometown Hero was founded by US military veterans and built its reputation on transparent lab testing and consistent product quality. The brand donates a percentage of revenue to veteran organizations and has been a vocal advocate for hemp regulatory clarity.",
    distinct:
      "Lab transparency and product consistency are this brand's signature. Their Delta-9 gummies dose accurately at the legal compliance threshold, and the formulation is one of the most consistent in the category.",
    productHighlights: [
      "Hometown Hero Delta-9 gummies",
      "Hometown Hero Delta-8 vape cartridges",
      "Hometown Hero CBD products",
      "Veteran-owned and operated",
    ],
    faqs: [
      {
        question: "Why is Hometown Hero priced higher than budget brands?",
        answer:
          "Because the lab testing is more thorough, the formulations are tighter, and the company maintains higher manufacturing standards. The product quality difference is noticeable.",
      },
      {
        question: "Are Hometown Hero gummies legal in Florida?",
        answer:
          "Yes. The Delta-9 gummies comply with the federal 2018 Farm Bill threshold of 0.3 percent Delta-9 THC by dry weight.",
      },
      {
        question: "Does Hometown Hero do anything for veterans?",
        answer:
          "Yes. The company is veteran-owned and donates a portion of every sale to veteran-focused organizations. Specific causes vary by year.",
      },
    ],
    relatedBrandSlugs: ["mood", "tre-house", "3chi"],
    relatedCategorySlugs: ["delta-9", "delta-8", "cbd"],
  },
  {
    slug: "torch",
    name: "Torch",
    category: "thc-derivative",
    intro:
      "Torch produces high-potency hemp-derived disposables and carts. Strong formulations for experienced users who want effect without compromise.",
    history:
      "Torch entered the category with high-cannabinoid concentrations and aggressive flavor profiles. The brand has expanded across blended formulations and live resin lines while maintaining its identity as a stronger-than-average option.",
    distinct:
      "Potency. Torch products tend to test on the higher end of cannabinoid concentration. Best for experienced users; first-timers should start small.",
    productHighlights: [
      "Torch Live Resin disposables",
      "Torch Diamond cannabinoid blends",
      "Torch THCA and Delta-9 formulations",
    ],
    faqs: [
      {
        question: "Is Torch stronger than other brands?",
        answer:
          "Generally yes. Torch tends to formulate at higher cannabinoid concentrations than most peers. Start with small puffs if you're new to the brand.",
      },
      {
        question: "Are Torch products legal in Florida?",
        answer:
          "Hemp-derived Torch formulations meeting the federal 0.3 percent Delta-9 THC threshold are legal under current law.",
      },
      {
        question: "What's a Torch Diamond?",
        answer:
          "A high-concentration cannabinoid product, typically a blend of multiple cannabinoids in concentrated form. Effects come on quickly and strongly.",
      },
    ],
    relatedBrandSlugs: ["cake", "delta-extrax", "3chi"],
    relatedCategorySlugs: ["delta-8", "thca"],
  },
  {
    slug: "flying-monkey",
    name: "Flying Monkey",
    category: "thc-derivative",
    intro:
      "Flying Monkey produces hemp-derived disposables and edibles with consistent quality and a tight flavor library. A strong mid-tier option.",
    history:
      "Flying Monkey grew out of the hemp-derivative wave with a focus on disposables and edibles. The brand maintains its position with consistent formulations and a smaller, curated flavor library rather than catalog sprawl.",
    distinct:
      "Quality consistency at the mid-tier price point. Flying Monkey products perform predictably batch over batch.",
    productHighlights: [
      "Flying Monkey Delta-8 disposables",
      "Flying Monkey Heavy Hitter line",
      "Flying Monkey gummies",
      "Live Resin and Diamond formulations",
    ],
    faqs: [
      {
        question: "What's in the Heavy Hitter line?",
        answer:
          "Higher-concentration cannabinoid blends targeted at experienced users. Specific cannabinoid composition varies by SKU.",
      },
      {
        question: "Is Flying Monkey lab tested?",
        answer:
          "Yes. Every batch publishes a COA available on the brand's website.",
      },
      {
        question: "How does Flying Monkey compare to Cake?",
        answer:
          "Similar tier and quality. Cake has wider distribution and more SKU variety. Flying Monkey has tighter consistency batch over batch in our experience.",
      },
    ],
    relatedBrandSlugs: ["cake", "torch", "urb"],
    relatedCategorySlugs: ["delta-8"],
  },
  {
    slug: "juul",
    name: "Juul",
    category: "device",
    intro:
      "Juul remains a pod system staple for users who established their nicotine routine on the platform. We carry the device and authorized refills.",
    history:
      "Juul defined the modern pod system. While the brand has navigated significant regulatory turbulence, the device and pod system continue to operate for adults who registered before product limitations took effect.",
    distinct:
      "The Juul pod design remains tightly integrated with the device, producing a consistent draw and reliable nicotine delivery. For users who prefer this format, no other system delivers the exact experience.",
    productHighlights: [
      "Juul device",
      "Juul pods (compliant flavor library)",
      "Juul charging accessories",
    ],
    faqs: [
      {
        question: "What flavors of Juul pods are available?",
        answer:
          "FDA-compliant flavors only, which currently includes tobacco and menthol. The flavor library has been narrowed by regulation.",
      },
      {
        question: "Are Juul pods refillable?",
        answer:
          "Officially no. Third-party refillable Juul-compatible pods exist but quality and safety vary widely. We do not stock unofficial refills.",
      },
      {
        question: "Should I switch from Juul to a disposable?",
        answer:
          "If flavor variety is what you want, yes. If your routine is built around the Juul draw, you may prefer to stay on the platform.",
      },
    ],
    relatedBrandSlugs: ["vuse"],
    relatedCategorySlugs: ["disposable-vapes", "e-liquid"],
  },
  {
    slug: "vuse",
    name: "Vuse",
    category: "device",
    intro:
      "Vuse is the other major US pod system. The Alto and Vibe lines deliver consistent nicotine experience for users who prefer pod format over disposables.",
    history:
      "Vuse, owned by Reynolds American, scaled the pod system category alongside Juul. The Alto became one of the highest-volume pod systems in the US and remains a default reference for the format.",
    distinct:
      "Vuse's draw activation is reliable, the pods seal cleanly, and the device build quality is solid. For users who want pod format from a major manufacturer, Vuse is the alternative to Juul.",
    productHighlights: [
      "Vuse Alto device",
      "Vuse Alto pods (compliant flavors)",
      "Vuse Vibe rechargeable",
    ],
    faqs: [
      {
        question: "What's the difference between Alto and Vibe?",
        answer:
          "The Alto is a smaller pod system with prefilled pods. The Vibe is a closed-system disposable-style device. Both target users who want simple, prefilled nicotine delivery.",
      },
      {
        question: "Are Vuse pods refillable?",
        answer:
          "No. Vuse Alto pods are sealed prefilled units. Use only authorized pods.",
      },
      {
        question: "Which Vuse flavors are still available?",
        answer:
          "FDA-compliant flavors only. Tobacco and menthol remain available. The flavor library has been narrowed by regulation.",
      },
    ],
    relatedBrandSlugs: ["juul"],
    relatedCategorySlugs: ["disposable-vapes", "e-liquid"],
  },
  {
    slug: "smok",
    name: "SMOK",
    category: "device",
    intro:
      "SMOK has been one of the dominant manufacturers of mods and tanks for over a decade. The Nord, RPM, and Novo pod lines plus the classic mod kits are all stocked.",
    history:
      "SMOK has produced mod gear since the early days of the modern vape industry. The brand's product catalog covers everything from beginner pod systems to high-wattage mod kits, and most users with sub-ohm devices have owned at least one SMOK at some point.",
    distinct:
      "Range and reliability. SMOK products span every price tier and use case, and the build quality holds up. The Nord and RPM pod lines in particular remain go-to options for users transitioning from disposables to refillables.",
    productHighlights: [
      "SMOK Nord 4, Nord 5, Nord GT",
      "SMOK RPM 5, RPM 100",
      "SMOK Novo line",
      "SMOK Mag, Morph, Arcfox mod kits",
    ],
    faqs: [
      {
        question: "What's the difference between Nord and RPM?",
        answer:
          "The RPM is more powerful and uses a different coil platform. The Nord is more compact and beginner-friendly. Both are excellent pod systems.",
      },
      {
        question: "Do you stock SMOK replacement coils?",
        answer:
          "Yes. We carry replacement coils for current Nord, RPM, Novo, and major mod kit lines. If we don't have your coil in stock, we can typically order it within a week.",
      },
      {
        question: "Is SMOK worth it over disposables?",
        answer:
          "Long-term, yes. Refillable systems are dramatically cheaper per puff than disposables, and you control the e-liquid.",
      },
    ],
    relatedBrandSlugs: ["geekvape", "vaporesso"],
    relatedCategorySlugs: ["e-liquid"],
  },
  {
    slug: "geekvape",
    name: "GeekVape",
    category: "device",
    intro:
      "GeekVape produces some of the most rugged hardware in the category. The Aegis line set the standard for waterproof, shockproof, dustproof mod construction.",
    history:
      "GeekVape introduced the Aegis line and effectively created the rugged-construction mod category. The brand has expanded across pod systems, sub-ohm tanks, and full mod kits while maintaining the durability focus that built its reputation.",
    distinct:
      "Aegis durability. These devices survive abuse that would destroy most competitors. If you're rough on equipment, GeekVape is the brand.",
    productHighlights: [
      "GeekVape Aegis Boost, Aegis Boost Pro",
      "GeekVape Aegis Legend mod",
      "GeekVape Wenax pod systems",
      "GeekVape Z series sub-ohm tanks",
    ],
    faqs: [
      {
        question: "Are Aegis mods really waterproof?",
        answer:
          "They're rated IP68 for dust and water resistance. They will survive splashes, rain, and brief submersion. Don't actively swim with one, but a drop in a pool isn't a death sentence.",
      },
      {
        question: "What's the difference between Aegis Boost and Aegis Legend?",
        answer:
          "The Boost is a pod system. The Legend is a full mod kit with replaceable batteries. Boost is simpler; Legend offers more power and customization.",
      },
      {
        question: "Do you stock Aegis Boost replacement pods?",
        answer:
          "Yes, plus replacement coils across the line.",
      },
    ],
    relatedBrandSlugs: ["smok", "vaporesso"],
    relatedCategorySlugs: ["e-liquid"],
  },
  {
    slug: "vaporesso",
    name: "Vaporesso",
    category: "device",
    intro:
      "Vaporesso has become a benchmark for build quality and chip design in the mod category. The XROS pod system and Luxe and Gen mod kits define the modern premium tier.",
    history:
      "Vaporesso has built its position over multiple device generations with a focus on advanced chipset design and clean industrial design. The brand's products consistently win community reviews for reliability and performance.",
    distinct:
      "Chip quality and refined ergonomics. Vaporesso devices feel and perform more like premium consumer electronics than most vape gear in the same price tier.",
    productHighlights: [
      "Vaporesso XROS 3, XROS 4 pod systems",
      "Vaporesso Luxe X, Luxe XR pod mods",
      "Vaporesso Gen 200, Gen 80 mod kits",
      "Vaporesso GTX coil platform",
    ],
    faqs: [
      {
        question: "What's the difference between XROS and Luxe?",
        answer:
          "XROS is a smaller, simpler pod system. Luxe is a more capable pod mod with adjustable wattage and longer battery life. Both use the same coil platform.",
      },
      {
        question: "Is the XROS 4 worth upgrading to from the XROS 3?",
        answer:
          "If you have an XROS 3 you're happy with, the upgrade is incremental. If you're starting fresh, get the XROS 4. Battery life and chipset are improved.",
      },
      {
        question: "Do you stock Vaporesso coils?",
        answer:
          "Yes. We carry the GTX coil platform across mesh and ceramic options for current Vaporesso devices.",
      },
    ],
    relatedBrandSlugs: ["smok", "geekvape"],
    relatedCategorySlugs: ["e-liquid"],
  },
  {
    slug: "raw",
    name: "RAW",
    category: "paper",
    intro:
      "RAW is the standard for unbleached, vegan rolling papers. We stock the full lineup including classics, organic hemp, and accessories.",
    history:
      "RAW launched in 1995 with a focus on unbleached, additive-free rolling papers. The brand became the dominant paper across smoke shops worldwide and has expanded into cones, tips, trays, and accessories while maintaining the original product philosophy.",
    distinct:
      "Unbleached, vegan, and clean burning. RAW papers don't add anything to the smoke that wasn't there to start. The slow burn and even draw are why they're the default for serious smokers.",
    productHighlights: [
      "RAW Classic and Organic Hemp papers (1 1/4, King Size, etc)",
      "RAW pre-rolled cones",
      "RAW filter tips",
      "RAW rolling trays and accessories",
    ],
    faqs: [
      {
        question: "What's the difference between RAW Classic and Organic Hemp?",
        answer:
          "Both are unbleached. Classic is a hemp and flax blend. Organic Hemp is 100 percent hemp and tends to burn slightly slower with a slightly different mouthfeel.",
      },
      {
        question: "Do you sell RAW cones?",
        answer:
          "Yes, in 1 1/4 and King Size, plus larger party sizes. We also stock the variety packs.",
      },
      {
        question: "Are RAW papers vegan?",
        answer:
          "Yes. The papers and the gum are both plant-derived.",
      },
    ],
    relatedBrandSlugs: ["zig-zag"],
    relatedCategorySlugs: ["cigars"],
  },
  {
    slug: "zig-zag",
    name: "Zig-Zag",
    category: "paper",
    intro:
      "Zig-Zag has been making rolling papers since 1879 and remains a top-shelf option across formats. We carry papers, cones, wraps, and the iconic blue and orange.",
    history:
      "Founded in France in 1879, Zig-Zag has evolved across multiple eras of smoking culture. The brand's interleaved paper format and signature mascot remain instantly recognizable, and the product range has expanded into cones, wraps, and accessories.",
    distinct:
      "Heritage and consistency. Zig-Zag papers burn evenly, stay closed when rolled correctly, and the brand has maintained product quality across more than a century. The wrap line is a major recent addition.",
    productHighlights: [
      "Zig-Zag Original (orange)",
      "Zig-Zag Ultra Thin (blue)",
      "Zig-Zag pre-rolled cones",
      "Zig-Zag hemp wraps",
    ],
    faqs: [
      {
        question: "What's the difference between Zig-Zag Orange and Blue?",
        answer:
          "Orange is the original heavier paper that burns slower. Blue is ultra-thin for users who want minimal paper character in the smoke. Both are reliable.",
      },
      {
        question: "Do you sell Zig-Zag wraps?",
        answer:
          "Yes. Zig-Zag hemp wraps come in multiple flavors and sizes.",
      },
      {
        question: "Are Zig-Zag papers natural?",
        answer:
          "Yes for the natural and ultra-thin lines. Some flavored or specialty SKUs use natural ingredients with added flavor; check the package.",
      },
    ],
    relatedBrandSlugs: ["raw", "backwoods"],
    relatedCategorySlugs: ["cigars"],
  },
  {
    slug: "backwoods",
    name: "Backwoods",
    category: "tobacco",
    intro:
      "Backwoods cigars are a category fixture and one of our highest-volume SKUs. We stock the full flavor lineup with daily restocks.",
    history:
      "Backwoods has been around since the early 1970s and built an unshakeable position in the cigarillo market. The natural leaf wrap and rustic design have become cultural icons, especially in the cigarillo and hip-hop intersection.",
    distinct:
      "The natural leaf wrap is the signature. Backwoods burn slower than most cigarillos, hold flavor better, and feel more substantial in the hand than machine-rolled paper-wrapped competitors.",
    productHighlights: [
      "Backwoods Honey Berry",
      "Backwoods Original",
      "Backwoods Honey Bourbon",
      "Backwoods Black Russian",
    ],
    faqs: [
      {
        question: "Which Backwoods flavor is most popular?",
        answer:
          "Honey Berry is the highest-volume flavor in our store, with Original close behind. Specific demand shifts seasonally.",
      },
      {
        question: "Do you sell single Backwoods or only packs?",
        answer:
          "Both. Singles are available, plus 5-packs and full boxes when in stock.",
      },
      {
        question: "Are Backwoods always fresh in your store?",
        answer:
          "Yes. Restocks happen multiple times per week and we monitor humidor freshness daily. If a stick has been on the shelf too long, we pull it.",
      },
    ],
    relatedBrandSlugs: ["zig-zag", "raw"],
    relatedCategorySlugs: ["cigars"],
  },
  {
    slug: "storz-bickel",
    name: "Storz & Bickel",
    category: "device",
    intro:
      "Storz and Bickel make the highest-end vaporizers in the world. The Volcano and Mighty define the desktop and portable categories respectively.",
    history:
      "German-engineered, medical-grade. Storz and Bickel has produced precision vaporizers for over two decades and the products are referenced in clinical studies. The build quality and convection heating accuracy set the benchmark for the category.",
    distinct:
      "Precision. These are the most accurate, longest-lasting vaporizers on the market, and the price reflects it. The Volcano in particular is iconic.",
    productHighlights: [
      "Volcano Hybrid (desktop)",
      "Volcano Classic (desktop)",
      "Mighty+ portable vaporizer",
      "Crafty+ portable vaporizer",
    ],
    faqs: [
      {
        question: "Are Storz and Bickel vaporizers worth the price?",
        answer:
          "For users who care about precision temperature control, longevity, and clean vapor production, yes. The build quality is genuinely uncompromised.",
      },
      {
        question: "What's the difference between Volcano Hybrid and Classic?",
        answer:
          "The Hybrid adds a whip option in addition to the balloon, plus app control and faster heat-up. The Classic is the analog original. Both produce identical vapor quality.",
      },
      {
        question: "Is the Mighty+ better than the Crafty+?",
        answer:
          "The Mighty+ has longer battery life and a slightly larger chamber. The Crafty+ is more portable. Vapor quality is comparable.",
      },
    ],
    relatedBrandSlugs: ["pax", "yobo"],
    relatedCategorySlugs: [],
  },
  {
    slug: "pax",
    name: "PAX",
    category: "device",
    intro:
      "PAX produces the most refined consumer-grade portable vaporizers on the market. The PAX 3 and PAX Mini set the standard for design and ease of use.",
    history:
      "PAX Labs launched with a focus on industrial design and discreet form factor. The PAX line has refined across multiple generations, and the brand remains the default reference for what a portable vaporizer should look and feel like.",
    distinct:
      "Industrial design and ease of use. PAX devices look like Apple-tier consumer electronics and operate accordingly. Long battery life, simple operation, dependable performance.",
    productHighlights: [
      "PAX 3 portable vaporizer",
      "PAX Mini",
      "PAX Plus",
      "PAX accessories and replacement screens",
    ],
    faqs: [
      {
        question: "What's the difference between PAX 3 and PAX Plus?",
        answer:
          "The Plus is the newer model with refined heating profiles and a slightly different chamber design. PAX 3 remains a strong option and is often available at lower price points.",
      },
      {
        question: "How long does the battery last?",
        answer:
          "Around 90 minutes of continuous use, longer with intermittent draws. Charging is via USB-C on current models.",
      },
      {
        question: "Do you stock PAX accessories?",
        answer:
          "Yes. Replacement screens, mouthpieces, and concentrate inserts.",
      },
    ],
    relatedBrandSlugs: ["storz-bickel", "yobo"],
    relatedCategorySlugs: [],
  },
];

export const BRAND_BY_SLUG = Object.fromEntries(
  BRANDS.map((b) => [b.slug, b]),
) as Record<string, Brand>;

export function getBrandBySlug(slug: string): Brand | undefined {
  return BRAND_BY_SLUG[slug];
}
