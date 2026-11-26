// Single source of truth for all portfolio content.
// Edit this file to update text, projects, case studies, publications, skills or contact details.

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type Domain = "engineering" | "energy";

export interface KeyFact {
  label: string;
  value: string;
}

export interface MethodStep {
  title: string;
  detail: string;
}

export interface MediaSlotConfig {
  /** Shown on the placeholder and as the image caption once a file exists. */
  caption: string;
  /** Alt text for the real image. */
  alt: string;
}

export interface CaseStudy {
  /** Problem Statement & National/Regional Context: one paragraph per entry. */
  problem: string[];
  /** System Architecture & Methodology. */
  architecture: {
    summary: string;
    steps: MethodStep[];
  };
  /** Key Outcomes, Metrics & Policy/Clinical Impact. */
  outcomes: {
    facts: KeyFact[];
    impact: string[];
  };
  /**
   * Media slots. Drop files into public/images/projects/<slug>/ named
   * prototype.(jpg|jpeg|png|webp) and architecture.(jpg|jpeg|png|webp|svg)
   * and they replace the placeholders automatically on the next build.
   */
  media: {
    prototype: MediaSlotConfig;
    architecture: MediaSlotConfig;
  };
}

export interface Project {
  id: number;
  slug: string;
  domain: Domain;
  label: string; // e.g. "Engineering Project 1"
  title: string;
  subtitle: string;
  description: string; // card summary (unchanged CV wording)
  partner: string; // institutional partner / context
  tags: string[];
  highlight?: string; // optional small badge, e.g. "PhD Research"
  caseStudy: CaseStudy;
}

export type PublicationCategory = "Doctoral Research" | "National Policy" | "IAEA / SADC" | "Dataset & Schema";

export interface Publication {
  id: string;
  category: PublicationCategory;
  type: string; // e.g. "Doctoral Dissertation"
  title: string;
  subtitle?: string;
  status: string;
  organisations: string[];
  summary: string;
  targetJournals?: string[];
  countries?: string[];
  domain: Domain;
}

export interface StackColumn {
  domain: Domain;
  title: string;
  subtitle?: string;
  items: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  detail?: string;
  status?: string;
}

export interface Appointment {
  role: string;
  organisation: string;
  period: string;
  detail: string;
  domain: Domain;
}

/* ------------------------------------------------------------------ */
/* Profile & hero                                                      */
/* ------------------------------------------------------------------ */

export const profile = {
  name: "Alfred K. Pone",
  monogram: "ALFRED K. PONE",
  titles: {
    engineering: "Computer Engineer (Embedded Systems, IoT, Robotics & AI)",
    energy: "PhD Researcher & Energy Systems Modeller (Botswana IAEA Representative)",
  },
  location: "Gaborone, Botswana",
  email: "akpone88@gmail.com",
  phones: [
    { display: "+267 76528781", href: "tel:+26776528781" },
    { display: "76121018", href: "tel:+26776121018" },
  ],
  // TODO: replace with the real LinkedIn profile URL
  linkedin: "https://www.linkedin.com/in/your-profile",
  photo: {
    src: "/alfred-pone.jpg",
    alt: "Alfred K. Pone standing outside the Dr. Martin Luther King Jr. Library at night",
  },
};

export const hero = {
  domainPills: [
    { domain: "engineering" as Domain, label: "Computer Engineering · Embedded · IoT · Robotics · AI" },
    { domain: "energy" as Domain, label: "Energy Analysis · Botswana IAEA Representative" },
  ],
  headline: {
    lead: "Engineering Intelligent Hardware",
    connector: "&",
    trail: "Modelling National Energy Strategy.",
  },
  bio: [
    "I build at the intersection of hardware and national policy. Trained as a computer engineer with a BEng (Hons) in Computer Engineering from the UK, I design embedded, IoT, robotics and AI systems, from a brain-computer-interface exoskeleton to an autonomous anti-poaching drone.",
    "For more than 10 years I have worked as an Energy Associate Researcher at the Botswana Institute for Technology Research and Innovation (BITRI), and I serve as Botswana's IAEA Energy Planning Representative, contributing to least-cost planning and regional power integration across SADC. I am currently completing a PhD in Global Energy Policy at EUCLID University (GPA 3.8).",
  ],
  stats: [
    { value: "5+", label: "Flagship Hardware & AI Builds", domain: "engineering" as Domain, icon: "cpu" },
    { value: "10+", label: "Years at BITRI & IAEA Counterpart", domain: "energy" as Domain, icon: "zap" },
    { value: "PhD", label: "Candidate (Dissertation Stage)", domain: "energy" as Domain, icon: "graduation" },
  ],
  locationCard: {
    city: "Gaborone",
    country: "Botswana",
    coordinates: "24.63°S · 25.92°E",
    note: "Open to SADC, IAEA & international collaboration",
  },
};

/* ------------------------------------------------------------------ */
/* Projects & case studies                                             */
/* ------------------------------------------------------------------ */
// NOTE: "facts" hold only verified, non-numeric project facts. Add measured
// results (accuracy, trial counts, model outputs) as new facts once they
// are ready to publish.

export const projects: Project[] = [
  {
    id: 1,
    slug: "bci-lower-limb-exoskeleton",
    domain: "engineering",
    label: "Engineering Project 1",
    title: "ML-Powered Brain-Computer-Interface (BCI) Lower-Limb Exoskeleton",
    subtitle: "Thought-driven robotic gait assistance for post-stroke rehabilitation",
    description:
      "Machine learning-driven BCI lower-limb robotic exoskeleton for post-stroke patient rehabilitation, developed in collaboration with BIUST (led by Prof. Rodrigo Jamisola).",
    partner: "BIUST · led by Prof. Rodrigo Jamisola",
    tags: ["Brain-Computer Interface", "Machine Learning", "Robotics", "Embedded Control", "Python"],
    caseStudy: {
      problem: [
        "Stroke frequently leaves survivors with lower-limb weakness or hemiparesis, and regaining independent walking depends on long, repetitive, therapist-intensive rehabilitation. In Botswana and across much of Southern Africa, specialist neuro-rehabilitation capacity is limited and concentrated in a few urban centres.",
        "Conventional powered orthoses move the limb on a fixed schedule, so the patient's own intention to move is not part of the loop. Coupling the device to the patient's neural intent, read through a brain-computer interface, aims to make each movement an active, intention-driven therapy repetition.",
      ],
      architecture: {
        summary:
          "A closed-loop pipeline that turns EEG-recorded movement intent into safe, supervised joint actuation, developed with the robotics group at BIUST.",
        steps: [
          { title: "EEG acquisition", detail: "Scalp EEG is captured over the motor cortex while the patient attempts or imagines a leg movement." },
          { title: "Signal conditioning", detail: "Band-pass filtering, artefact handling and windowing prepare clean, time-aligned epochs for decoding." },
          { title: "Feature extraction & ML decoding", detail: "Motor-related EEG features feed a machine-learning classifier, implemented in Python, that distinguishes movement intent from rest." },
          { title: "Intent-to-command mapping", detail: "Decoded intent is translated into gait-phase commands for the exoskeleton, with confidence thresholds to suppress false triggers." },
          { title: "Embedded joint control", detail: "An embedded controller drives the hip/knee actuators through closed-loop position and torque control with joint-angle and torque limits." },
          { title: "Safety & clinician oversight", detail: "Mechanical stops, software limits and a clinician-accessible stop keep the human in charge of every session." },
        ],
      },
      outcomes: {
        facts: [
          { label: "Clinical focus", value: "Post-stroke lower-limb rehabilitation" },
          { label: "Control input", value: "EEG-based movement intent (BCI)" },
          { label: "Collaboration", value: "BIUST robotics research group" },
        ],
        impact: [
          "Brings active, intention-driven therapy within reach of local rehabilitation services rather than relying on imported systems.",
          "Builds regional capability at the intersection of neuro-engineering, machine learning and embedded robotics.",
          "Provides a platform for further clinical evaluation with rehabilitation specialists.",
        ],
      },
      media: {
        prototype: { caption: "Exoskeleton prototype / lab trial photo", alt: "BCI lower-limb exoskeleton prototype" },
        architecture: { caption: "EEG → ML decoder → embedded joint control pipeline", alt: "BCI exoskeleton control architecture diagram" },
      },
    },
  },
  {
    id: 2,
    slug: "anti-poaching-autonomous-drone",
    domain: "engineering",
    label: "Engineering Project 2",
    title: "AI-Powered Anti-Poaching Autonomous Drone",
    subtitle: "Onboard computer vision for wildlife protection",
    description:
      "Autonomous UAV equipped with onboard AI computer vision to detect poaching threats and support wildlife protection operations for the Botswana Defence Force (BDF).",
    partner: "Botswana Defence Force (BDF) · wildlife protection operations",
    tags: ["Edge AI", "Computer Vision", "UAV / Robotics", "Embedded Telemetry"],
    caseStudy: {
      problem: [
        "Botswana holds one of the world's largest elephant populations alongside rhino and other high-value species, spread across vast, remote conservation areas. Ground patrols alone cannot cover this terrain continuously, and poaching incidents are often detected too late to intervene.",
        "Aerial surveillance extends situational awareness, but streaming raw video from remote areas is bandwidth-intensive and depends on a human watching every frame. Moving detection onto the aircraft lets the drone flag threats itself and send only what matters.",
      ],
      architecture: {
        summary:
          "An autonomous UAV with an edge-AI vision payload that detects and geotags potential threats on board, relaying compact alerts and telemetry to the ground team.",
        steps: [
          { title: "Autonomous flight", detail: "A flight controller executes pre-planned patrol waypoints over designated areas, with return-to-home failsafes." },
          { title: "Imaging payload", detail: "An onboard camera captures the scene below for real-time analysis during patrol." },
          { title: "Edge AI inference", detail: "A companion computer runs computer-vision models on board to detect people, vehicles and other indicators of poaching activity." },
          { title: "Geotagging & alerting", detail: "Detections are fused with GPS and attitude data to estimate location, then packaged as lightweight alerts with image snippets." },
          { title: "Embedded telemetry link", detail: "Flight state, battery health and alerts are streamed to the ground station so operators can verify and respond." },
        ],
      },
      outcomes: {
        facts: [
          { label: "End user", value: "Botswana Defence Force (BDF)" },
          { label: "Processing", value: "Onboard edge-AI computer vision" },
          { label: "Mission", value: "Poaching-threat detection & wildlife protection" },
        ],
        impact: [
          "Extends surveillance coverage over remote terrain beyond what ground patrols alone can achieve.",
          "Onboard detection reduces reliance on continuous high-bandwidth video links and constant human monitoring.",
          "Supports faster, better-targeted response by anti-poaching units.",
        ],
      },
      media: {
        prototype: { caption: "UAV airframe / field deployment photo", alt: "Anti-poaching autonomous drone in the field" },
        architecture: { caption: "Flight controller, edge-AI vision and telemetry architecture", alt: "Anti-poaching drone system architecture diagram" },
      },
    },
  },
  {
    id: 3,
    slug: "molemisi-soil-analytics",
    domain: "engineering",
    label: "Engineering Project 3",
    title: "Molemisi — Automated Soil Analytics & Crop Recommender",
    subtitle: "IoT soil sensing and ML crop recommendations for farmers",
    description:
      "End-to-end IoT soil sensing hardware and ML recommender system that analyses soil parameters in real time to advise farmers on optimal crops for specific soil types and geographic locations.",
    partner: "Botswana agriculture · smallholder and commercial farmers",
    tags: ["IoT Hardware", "Embedded C/C++", "Sensor Fusion", "ML Recommender", "GIS"],
    caseStudy: {
      problem: [
        "Much of Botswana is semi-arid, with variable rainfall and soils that differ sharply over short distances. Planting decisions are often based on habit rather than measured soil conditions, which lowers yields and wastes scarce inputs such as water and fertiliser.",
        "Laboratory soil testing is slow and out of reach for many smallholders. Molemisi brings measurement to the field and turns readings into a practical recommendation: what to plant, here.",
      ],
      architecture: {
        summary:
          "Field-deployable sensor hardware feeds a recommender that combines live soil readings with location data to rank suitable crops.",
        steps: [
          { title: "Soil sensing hardware", detail: "Probes measure key soil parameters, including NPK nutrients, pH, moisture and temperature, under an embedded C/C++ microcontroller." },
          { title: "Sensor fusion & calibration", detail: "Readings are filtered, calibrated and combined into a consistent soil profile for each sample point." },
          { title: "IoT data link", detail: "Profiles are transmitted from the device to a backend for storage and analysis." },
          { title: "GIS context layer", detail: "Each sample is geolocated and enriched with spatial context such as agro-ecological zone and climate." },
          { title: "ML crop recommender", detail: "A machine-learning model scores crops against the soil profile and location to produce a ranked recommendation for the farmer." },
        ],
      },
      outcomes: {
        facts: [
          { label: "Users", value: "Farmers in Botswana" },
          { label: "Inputs", value: "Real-time soil parameters + location (GIS)" },
          { label: "Output", value: "Ranked crop recommendations per site" },
        ],
        impact: [
          "Gives farmers evidence-based planting decisions without waiting for laboratory results.",
          "Supports better use of water and fertiliser in a water-scarce country.",
          "Contributes to national food-security goals through locally developed agri-tech.",
        ],
      },
      media: {
        prototype: { caption: "Molemisi sensing unit / field test photo", alt: "Molemisi soil sensing device" },
        architecture: { caption: "Sensors → fusion → IoT → GIS + ML recommender", alt: "Molemisi system architecture diagram" },
      },
    },
  },
  {
    id: 4,
    slug: "montsamaisa-smart-walking-stick",
    domain: "engineering",
    label: "Engineering Project 4",
    title: "Montsamaisa — Smart AI-Powered Walking Stick for the Blind",
    subtitle: "Embedded AI obstacle detection with haptic and audio guidance",
    description:
      "Intelligent assistive mobility cane for visually impaired users combining ultrasonic/vision sensors and embedded AI for real-time obstacle detection and haptic/audio navigation.",
    partner: "Assistive technology for visually impaired users",
    tags: ["Embedded Systems", "Edge AI", "Ultrasonic & Vision Sensors", "Haptic Feedback"],
    caseStudy: {
      problem: [
        "A traditional white cane detects obstacles only at ground level and within arm's reach. Overhanging branches, open vehicle doors, signage and fast-approaching hazards are easily missed, which limits safe, independent mobility for blind and visually impaired people.",
        "Imported smart canes are expensive and rarely designed around local environments. Montsamaisa aims to deliver an affordable, locally built alternative.",
      ],
      architecture: {
        summary:
          "A self-contained embedded system in the cane that senses the path ahead, interprets it on device, and communicates through vibration and sound.",
        steps: [
          { title: "Ultrasonic ranging", detail: "Ultrasonic sensors measure distance to obstacles at different heights, including head-level hazards a standard cane misses." },
          { title: "Vision sensing", detail: "A compact camera module captures the scene for classifying obstacle types beyond simple distance." },
          { title: "Embedded AI inference", detail: "On-device models fuse range and vision data in real time to judge obstacle type and urgency, without needing connectivity." },
          { title: "Haptic feedback", detail: "Vibration patterns that vary in intensity and rhythm encode proximity and direction through the handle." },
          { title: "Audio guidance", detail: "Short audio cues provide additional context where vibration alone is not enough." },
        ],
      },
      outcomes: {
        facts: [
          { label: "Users", value: "Blind and visually impaired people" },
          { label: "Feedback", value: "Haptic vibration + audio cues" },
          { label: "Processing", value: "On-device (no connectivity required)" },
        ],
        impact: [
          "Extends detection above ground level to cover hazards a standard cane cannot reach.",
          "Supports safer, more independent mobility in everyday environments.",
          "Demonstrates affordable, locally engineered assistive technology.",
        ],
      },
      media: {
        prototype: { caption: "Montsamaisa cane prototype photo", alt: "Montsamaisa smart walking stick prototype" },
        architecture: { caption: "Ultrasonic + vision → embedded AI → haptic/audio", alt: "Montsamaisa system architecture diagram" },
      },
    },
  },
  {
    id: 5,
    slug: "covid-19-mechanical-ventilator",
    domain: "engineering",
    label: "Engineering Project 5",
    title: "Botswana COVID-19 Mechanical Hospital Ventilator",
    subtitle: "Rapid-response emergency ventilator from locally sourced materials",
    description:
      "Rapid-response mechanical hospital ventilator engineered using locally sourced materials in Botswana, adapted from the open-source MIT eVent emergency ventilator design.",
    partner: "Botswana national COVID-19 response · MIT eVent open-source design",
    tags: ["Microcontrollers", "Closed-Loop Control", "MIT eVent Design", "Biomedical Hardware"],
    caseStudy: {
      problem: [
        "In early 2020, the COVID-19 pandemic created a worldwide shortage of mechanical ventilators. Global supply chains were disrupted and wealthier countries competed for the limited stock, leaving countries like Botswana exposed.",
        "The open-source MIT Emergency Ventilator (eVent) design offered a starting point: automate a manual resuscitator bag with controlled, repeatable compression. The challenge was to engineer it rapidly using materials and components available locally in Botswana.",
      ],
      architecture: {
        summary:
          "An automated bag-valve-mask ventilator following the MIT eVent approach, with microcontroller-based closed-loop control of the breathing cycle.",
        steps: [
          { title: "Mechanical compression", detail: "A motor-driven mechanism compresses a standard manual resuscitator bag, following the MIT eVent architecture." },
          { title: "Locally sourced build", detail: "Frame and mechanical parts were adapted to materials and components that could be sourced and fabricated in Botswana." },
          { title: "Closed-loop control", detail: "A microcontroller regulates compression depth, rate and inspiratory-to-expiratory timing, using position feedback to deliver consistent breaths." },
          { title: "Clinician settings", detail: "Operators adjust key ventilation parameters, such as breath rate, tidal volume and I:E ratio, within safe bounds." },
          { title: "Alarms & safety", detail: "Fault detection and alarms address the safety considerations set out in the MIT eVent clinical guidance." },
        ],
      },
      outcomes: {
        facts: [
          { label: "Context", value: "COVID-19 emergency response" },
          { label: "Reference design", value: "MIT eVent (open source)" },
          { label: "Build", value: "Locally sourced materials, Botswana" },
        ],
        impact: [
          "Showed that critical medical hardware can be engineered locally during a supply crisis.",
          "Strengthened national preparedness and self-reliance for emergency medical equipment.",
          "Built local capability in biomedical hardware and closed-loop control.",
        ],
      },
      media: {
        prototype: { caption: "Ventilator prototype photo", alt: "Botswana COVID-19 mechanical ventilator prototype" },
        architecture: { caption: "MIT eVent closed-loop control block diagram", alt: "Ventilator closed-loop control diagram" },
      },
    },
  },
  {
    id: 6,
    slug: "clews-1000mw-export-model",
    domain: "energy",
    label: "Energy Research Project 6",
    highlight: "PhD Research",
    title: "Botswana CLEWS Nexus & 1,000 MW Power Export Trade-Off Model",
    subtitle: "Foreign exchange earned per unit of water: coal vs. solar PV exports",
    description:
      "First Climate-Land-Energy-Water Systems (CLEWS) model for Botswana comparing 1,000 MW of firm power exports (dry-cooled coal vs. utility-scale solar PV) in foreign exchange earned per unit of water consumed, tested against Southern African Power Pool (SAPP) Day-Ahead Market prices.",
    partner: "EUCLID University · Doctorate in Global Energy Policy",
    tags: ["MESSAGE-SPLAT", "MAED-2", "FINPLAN", "SIMPACTS", "QGIS", "Monte Carlo"],
    caseStudy: {
      problem: [
        "Botswana has large coal reserves and excellent solar resources, and is weighing a role as a power exporter within the Southern African Power Pool (SAPP). It is also one of the most water-scarce countries in the region, so every megawatt-hour exported carries a water cost.",
        "Energy, water and land are usually planned in separate silos. This research builds the first CLEWS (Climate-Land-Energy-Water Systems) model for Botswana to ask an integrated question: for 1,000 MW of firm exports, which pathway, dry-cooled coal or utility-scale solar PV, earns more foreign exchange per unit of water consumed?",
      ],
      architecture: {
        summary:
          "A five-tool modelling chain, linked through a common CLEWS data schema, with market prices from the SAPP Day-Ahead Market and probabilistic uncertainty analysis.",
        steps: [
          { title: "MAED-2: demand", detail: "Projects domestic electricity demand so exports are assessed on top of national needs." },
          { title: "MESSAGE-SPLAT: supply & nexus", detail: "Least-cost optimisation of the power system, extended with water and land accounting, for coal and solar PV export scenarios." },
          { title: "QGIS: spatial layer", detail: "Maps solar resource, land availability, water sources and transmission to ground the scenarios in real sites." },
          { title: "FINPLAN: financial viability", detail: "Tests the financing, cash flow and foreign-exchange profile of each export pathway." },
          { title: "SIMPACTS: external impacts", detail: "Estimates environmental and health impacts and their costs for each scenario." },
          { title: "SAPP DAM price testing", detail: "Export revenues are evaluated against Southern African Power Pool Day-Ahead Market prices." },
          { title: "Monte Carlo uncertainty", detail: "Key inputs such as prices, costs and water availability are sampled to test how robust the ranking is." },
        ],
      },
      outcomes: {
        facts: [
          { label: "Export capacity assessed", value: "1,000 MW firm power" },
          { label: "Pathways compared", value: "Dry-cooled coal vs. utility-scale solar PV" },
          { label: "Core indicator", value: "Foreign exchange earned per unit of water" },
          { label: "Market benchmark", value: "SAPP Day-Ahead Market prices" },
        ],
        impact: [
          "Provides the first CLEWS nexus evidence base for Botswana's power-export strategy.",
          "Puts water scarcity directly into investment decisions, beyond least-cost electricity alone.",
          "Offers a reusable template for other water-stressed SAPP member states.",
        ],
      },
      media: {
        prototype: { caption: "Study area map / QGIS spatial output", alt: "CLEWS study area map for Botswana" },
        architecture: { caption: "MAED-2 → MESSAGE-SPLAT → FINPLAN / SIMPACTS + QGIS + SAPP DAM", alt: "CLEWS five-tool modelling framework diagram" },
      },
    },
  },
  {
    id: 7,
    slug: "botswana-irp-sadc-planning",
    domain: "energy",
    label: "Energy Research Project 7",
    highlight: "IAEA AFRA",
    title: "Botswana Integrated Resource Plan (IRP) & SADC Regional Planning",
    subtitle: "Least-cost optimisation for national and regional power planning",
    description:
      "Techno-economic least-cost optimisation modelling informing Botswana's IRP and regional power integration across 8 SADC countries under the IAEA AFRA programme, alongside national Energy MIS and utility SCADA data schemas at BITRI.",
    partner: "BITRI · IAEA AFRA programme · Ministry of Minerals and Energy",
    tags: ["MESSAGE", "OSeMOSYS", "WASP", "ENPEP-BALANCE", "Python", "SCADA"],
    caseStudy: {
      problem: [
        "Botswana's Integrated Resource Plan sets the generation mix, timing and investment for the national power system over decades. Getting it wrong means stranded assets, higher tariffs or supply shortfalls, so decisions need transparent, defensible modelling.",
        "Power systems across SADC are increasingly interconnected through the Southern African Power Pool. National plans that ignore regional trade can miss cheaper options, which is why this work also supports regional planning and capacity building under the IAEA African Regional Cooperative Agreement (AFRA).",
        "The demand side matters too. The 2022/23 National Energy Use Survey (NEUS) found that 73.9% of households have electricity access, while biomass still supplies 66% of household final energy consumption (43,001.66 TJ per year). Plans for electrification and fuel switching therefore shape future load as much as new generation does.",
      ],
      architecture: {
        summary:
          "Techno-economic least-cost optimisation using IAEA and open-source planning tools, built on national energy data schemas developed at BITRI.",
        steps: [
          { title: "Data foundation", detail: "National Energy MIS and utility SCADA data schemas at BITRI structure demand, generation and network data for modelling." },
          { title: "Python data pipelines", detail: "Python scripts clean, transform and load data into the planning models consistently." },
          { title: "MESSAGE & OSeMOSYS", detail: "Least-cost capacity expansion over the planning horizon, comparing technology mixes, costs and constraints." },
          { title: "WASP", detail: "Generation expansion and reliability analysis to test the adequacy of candidate plans." },
          { title: "ENPEP-BALANCE", detail: "Energy market equilibrium analysis across the wider energy system." },
          { title: "Regional integration", detail: "Scenarios for cross-border trade and interconnection with SADC partners under the IAEA AFRA programme." },
        ],
      },
      outcomes: {
        facts: [
          { label: "National application", value: "Botswana Integrated Resource Plan (IRP)" },
          { label: "Regional scope", value: "8 SADC countries (IAEA AFRA)" },
          { label: "Institutions", value: "BITRI · IAEA · Ministry of Minerals and Energy" },
          { label: "Household electricity access (NEUS 2022/23)", value: "73.9%" },
        ],
        impact: [
          "Feeds techno-economic evidence into Botswana's national power-sector planning.",
          "Strengthens regional planning capacity and cooperation across SADC.",
          "Establishes reusable national energy data schemas for future planning cycles.",
        ],
      },
      media: {
        prototype: { caption: "Capacity expansion results / IRP scenario chart", alt: "Botswana IRP modelling results chart" },
        architecture: { caption: "Energy MIS / SCADA → Python → MESSAGE / OSeMOSYS / WASP / ENPEP", alt: "IRP modelling workflow diagram" },
      },
    },
  },
  {
    id: 8,
    slug: "neus-national-energy-use-survey",
    domain: "energy",
    label: "Energy Research Project 8",
    highlight: "National Statistics",
    title: "National Energy Use Survey (NEUS) 2022/23",
    subtitle: "Botswana's first national household energy use baseline",
    description:
      "First-of-its-kind national household energy survey conducted by the Department of Energy (Ministry of Minerals and Energy) with Statistics Botswana and BITRI, covering 6,702 households across 366 enumeration areas with a 99.4% response rate.",
    partner: "Ministry of Minerals and Energy · Statistics Botswana · BITRI",
    tags: ["Survey Design", "Energy Statistics", "Energy Balances", "CO₂ Accounting", "SDG 7", "Data Analysis"],
    caseStudy: {
      problem: [
        "Energy planning in Botswana lacked reliable household-level data. Without a baseline of how households actually use energy (for cooking, heating, cooling, lighting and transport) policies such as electrification subsidies, LPG promotion and renewable-energy targets were planned with limited evidence.",
        "The 2022/23 National Energy Use Survey was designed to close that gap, providing baseline statistics to strengthen energy planning and policy formulation and to track SDG 7, including Botswana's aim to raise the renewable share of the energy mix to 30% by 2030.",
      ],
      architecture: {
        summary:
          "A nationally representative household survey conducted by the Department of Energy with Statistics Botswana and BITRI, using international methodologies, between November 2022 and February 2023.",
        steps: [
          { title: "Stratified national sample", detail: "6,702 households across 366 enumeration areas, stratified by district and locality type (cities & towns, urban villages, rural villages)." },
          { title: "Fieldwork", detail: "Household data collection over two months, November 2022 to February 2023, achieving a 99.4% response rate." },
          { title: "End-use energy accounting", detail: "Consumption estimated by fuel and by end use (space heating and cooling, water heating, cooking, lighting) plus transport, agriculture and generators." },
          { title: "Energy balance & CO₂", detail: "Fuel quantities converted to terajoules for Total Final Consumption, and CO₂ emissions estimated by source and district." },
          { title: "Access, buildings & EE/RE barriers", detail: "Electricity access and NESC subsidy uptake, building characteristics, and household plans and barriers for efficiency and renewables." },
          { title: "Policy recommendations", detail: "Findings translated into recommendations on biomass, LPG, renewables, electrification and energy-efficiency regulation." },
        ],
      },
      outcomes: {
        facts: [
          { label: "Households surveyed", value: "6,702 · 99.4% response" },
          { label: "Household Total Final Consumption", value: "43,001.66 TJ per year" },
          { label: "Biomass share of consumption", value: "66.0% (28,360.8 TJ)" },
          { label: "Household electricity access", value: "73.9% (468,344 of 634,076)" },
          { label: "Grid connections subsidised (NESC)", value: "61%" },
          { label: "Household CO₂ emissions", value: "3,872.2 Gg CO₂ (82% from biomass)" },
          { label: "Main cooking fuels", value: "LPG 42.7% · firewood 32.8% · electricity 24.4%" },
          { label: "Households interested in EE/RE", value: "26% (top barrier: cost, 47%)" },
        ],
        impact: [
          "Establishes Botswana's first household energy baseline for the national energy balance, planning models and SDG 7 tracking.",
          "Evidence for promoting LPG over firewood in the roughly 10 districts where firewood still dominates cooking, cutting biomass use and CO₂.",
          "Supports continued electrification policy (73.9% access, 61% of connections NESC-subsidised) and extending free connections to low-income households.",
          "Recommends a dedicated biomass supply study, wider PV and biogas promotion, mandatory insulation in building regulations and enforced appliance efficiency labelling.",
        ],
      },
      media: {
        prototype: { caption: "NEUS 2022/23 Main Report cover (draft, May 2024)", alt: "Cover of the National Energy Use Survey Main Report" },
        architecture: { caption: "Sampling → end-use accounting → energy balance → policy", alt: "NEUS survey methodology diagram" },
      },
    },
  },
];

/** Source note for NEUS figures shown on the site. */
export const neusSource =
  "Source: National Energy Use Survey 2022/23 Main Report (draft, May 2024), Department of Energy, Ministry of Minerals and Energy, with Statistics Botswana and BITRI.";

/** Household Total Final Consumption by fuel (TJ), NEUS 2022/23. "Other" is the remainder of the reported total. */
export const neusEnergyMix = [
  { fuel: "Biomass", tj: 28360.8, share: 66.0 },
  { fuel: "Petrol", tj: 6280.1, share: 14.6 },
  { fuel: "Electricity", tj: 4576.5, share: 10.6 },
  { fuel: "Other fuels", tj: 3784.3, share: 8.8 },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/* ------------------------------------------------------------------ */
/* Publications, doctoral research & technical reports                 */
/* ------------------------------------------------------------------ */

export const publicationCategories: PublicationCategory[] = [
  "Doctoral Research",
  "National Policy",
  "IAEA / SADC",
  "Dataset & Schema",
];

export const publications: Publication[] = [
  {
    id: "dissertation",
    category: "Doctoral Research",
    type: "Doctoral Dissertation",
    title: "Beyond Siloed Planning: A CLEWS Nexus Assessment of Energy-Water-Land Trade-offs in Botswana's Power Sector Investment Strategy",
    subtitle: "Implications for Regional Integration within the Southern African Power Pool",
    status: "In progress · Proposal approved Aug 2026",
    organisations: ["EUCLID University"],
    summary:
      "Integrated climate-land-energy-water assessment of Botswana's power-sector investment options and their implications for SAPP regional integration.",
    targetJournals: ["Applied Energy", "Environmental Modelling & Software", "Energy Policy"],
    domain: "energy",
  },
  {
    id: "irp-inputs",
    category: "National Policy",
    type: "National Energy Policy Input",
    title: "Techno-Economic Least-Cost Optimisation Modelling Inputs to Botswana's Integrated Resource Plan (IRP)",
    status: "Policy input",
    organisations: ["BITRI", "Ministry of Minerals and Energy"],
    summary:
      "Least-cost capacity expansion modelling and analysis supporting Botswana's national Integrated Resource Plan.",
    domain: "energy",
  },
  {
    id: "neus-report",
    category: "National Policy",
    type: "National Survey Report",
    title: "National Energy Use Survey (NEUS) 2022/23: Main Report",
    subtitle: "Household energy consumption, access, CO₂ emissions and efficiency baseline for Botswana",
    status: "Draft main report · May 2024",
    organisations: ["Ministry of Minerals and Energy (Department of Energy)", "Statistics Botswana", "BITRI"],
    summary:
      "Botswana's first national energy use survey: 6,702 households, 99.4% response. Household final consumption of 43,001.66 TJ (66% biomass), 73.9% electricity access, and 3,872.2 Gg CO₂.",
    domain: "energy",
  },
  {
    id: "afra-outputs",
    category: "IAEA / SADC",
    type: "Regional Technical Cooperation",
    title: "SADC Regional Energy Planning & Capacity Building Outputs under the IAEA African Regional Cooperative Agreement (AFRA)",
    status: "Technical cooperation",
    organisations: ["IAEA", "AFRA"],
    summary: "Cross-border energy planning collaboration and capacity building across SADC member states.",
    countries: ["Botswana", "Lesotho", "Zambia", "Zimbabwe", "Mozambique", "Malawi", "Tanzania", "Eswatini", "DRC"],
    domain: "energy",
  },
  {
    id: "clews-template",
    category: "Dataset & Schema",
    type: "Open Modelling Deliverable",
    title: "Reusable SADC CLEWS Nexus Model Template, Input Data Schema & SAPP Day-Ahead Market Price Documentation",
    status: "Open deliverable",
    organisations: ["EUCLID University (PhD research)"],
    summary:
      "A reusable model template and documented data schema so other SADC planners can replicate and extend the CLEWS analysis.",
    domain: "engineering",
  },
];

/* ------------------------------------------------------------------ */
/* Stack, education, navigation                                        */
/* ------------------------------------------------------------------ */

export const stack: StackColumn[] = [
  {
    domain: "engineering",
    title: "Computer Engineering, Robotics & AI",
    items: [
      "Embedded Systems & Microcontrollers",
      "Robotics & Mechatronic Control",
      "IoT Hardware & Sensor Networks",
      "Edge AI & Computer Vision",
      "Brain-Computer Interfaces (BCI)",
      "Python (5+ Years) & C/C++",
      "Utility SCADA & Energy MIS",
      "QGIS Spatial Analytics",
    ],
  },
  {
    domain: "energy",
    title: "Energy Modelling, Planning & Policy",
    subtitle: "Certified IAEA & IAEA–IRENA",
    items: [
      "MESSAGE & MESSAGE-SPLAT",
      "OSeMOSYS & TIMES-Class Models",
      "MAED-2",
      "WASP",
      "FINPLAN & SIMPACTS",
      "ENPEP-BALANCE & CLEWS-Nexus",
      "Monte Carlo & Bayesian Uncertainty",
      "IAEA / SADC Regional Energy Policy",
    ],
  },
];

export const education: EducationItem[] = [
  {
    degree: "Doctorate in Global Energy Policy (DGEP / PhD)",
    institution: "EUCLID University",
    period: "In progress",
    status: "Dissertation stage",
    detail: "GPA 3.8 / 4.0",
  },
  {
    degree: "MBA in Management Information Systems",
    institution: "UNICAF University",
    period: "2020",
    detail: "Specialisation in Energy MIS",
  },
  {
    degree: "BEng (Hons) Computer Engineering",
    institution: "University of Glamorgan / University of South Wales, UK",
    period: "2011",
  },
];

export const appointments: Appointment[] = [
  {
    role: "Energy Associate Researcher",
    organisation: "Botswana Institute for Technology Research and Innovation (BITRI)",
    period: "2016 – Present",
    detail:
      "Energy systems research, national Energy MIS and utility SCADA data schemas, and least-cost planning support for Botswana.",
    domain: "engineering",
  },
  {
    role: "IAEA Energy Planning Representative (Country Counterpart)",
    organisation: "International Atomic Energy Agency · Botswana",
    period: "Current",
    detail:
      "Botswana's counterpart for IAEA energy planning, contributing to IRP modelling and regional power integration across SADC under the AFRA programme.",
    domain: "energy",
  },
];

/* ------------------------------------------------------------------ */
/* Company: Atoms and Bits (Pty) Ltd                                   */
/* ------------------------------------------------------------------ */

export const company = {
  name: "Atoms and Bits",
  legalName: "Atoms and Bits (Pty) Ltd",
  tagline: "AI-Powered Research Engineering",
  pitch:
    "Atoms and Bits is an AI-powered research engineering company founded and owned by Alfred K. Pone. We do research and development in smart mechatronics, hardware, software and AI, taking ideas from the physical world of atoms to the digital world of bits and back.",
  location: "Gaborone, Botswana",
  founder: "Alfred K. Pone, Founder & Owner",
  email: "akpone88@gmail.com",
  pillars: [
    {
      key: "mechatronics",
      title: "Smart Mechatronics",
      detail: "Robotic, electromechanical and assistive systems where sensing, actuation and intelligent control meet.",
      icon: "bot",
    },
    {
      key: "hardware",
      title: "Hardware Engineering",
      detail: "Embedded systems, microcontrollers, IoT sensor networks and rapid prototyping of electronic devices.",
      icon: "cpu",
    },
    {
      key: "software",
      title: "Software Engineering",
      detail: "Firmware, data platforms, dashboards and the applications that make hardware useful in the field.",
      icon: "code",
    },
    {
      key: "ai",
      title: "Artificial Intelligence",
      detail: "Machine learning, computer vision and edge AI that run where the data is generated.",
      icon: "brain",
    },
  ],
  process: [
    { step: "Research", detail: "Frame the problem and review the science, context and constraints." },
    { step: "Prototype", detail: "Build hardware, firmware and models quickly to test the idea." },
    { step: "Validate", detail: "Measure performance against real-world conditions and users." },
    { step: "Deliver", detail: "Hand over documented, maintainable systems and the know-how behind them." },
  ],
  /** Founder's track record (Alfred's own projects, shown as proof of capability). */
  founderProjects: [
    "bci-lower-limb-exoskeleton",
    "anti-poaching-autonomous-drone",
    "molemisi-soil-analytics",
    "montsamaisa-smart-walking-stick",
  ],
};

/* ------------------------------------------------------------------ */
/* Work profile                                                        */
/* ------------------------------------------------------------------ */

export interface Role {
  role: string;
  organisation: string;
  period: string;
  domain: Domain | "company";
  summary: string;
  highlights: string[];
  href?: string;
}

export const workProfile: Role[] = [
  {
    role: "Founder & Owner",
    organisation: "Atoms and Bits (Pty) Ltd",
    period: "Present",
    domain: "company",
    summary: "AI-powered research engineering company doing R&D in smart mechatronics, hardware, software and AI.",
    highlights: [
      "Leads research, design and prototyping across mechatronics, embedded hardware, software and AI.",
      "Brings the founder's track record in BCI robotics, edge-AI drones, IoT agri-tech and assistive devices.",
    ],
    href: "/atoms-and-bits",
  },
  {
    role: "IAEA Energy Planning Representative (Country Counterpart)",
    organisation: "International Atomic Energy Agency · Botswana",
    period: "Current",
    domain: "energy",
    summary: "Botswana's counterpart for IAEA energy planning and regional technical cooperation.",
    highlights: [
      "Contributes to IRP modelling and regional power integration across SADC under the IAEA AFRA programme.",
      "Certified in IAEA and IAEA–IRENA energy planning tools: MESSAGE, MAED-2, WASP, FINPLAN, SIMPACTS, ENPEP-BALANCE.",
    ],
  },
  {
    role: "Energy Associate Researcher",
    organisation: "Botswana Institute for Technology Research and Innovation (BITRI)",
    period: "2016 – Present",
    domain: "engineering",
    summary: "Energy systems research and national energy data infrastructure for Botswana.",
    highlights: [
      "Designs national Energy MIS and utility SCADA data schemas.",
      "Techno-economic least-cost optimisation inputs to Botswana's Integrated Resource Plan.",
      "BITRI was a partner institution, with the Department of Energy and Statistics Botswana, in the National Energy Use Survey 2022/23.",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export const navLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/research", label: "Research" },
  { href: "/experience", label: "Experience" },
  { href: "/education", label: "Education" },
];

export const companyNavLink = { href: "/atoms-and-bits", label: "Atoms & Bits" };
