export interface FeatureComparison {
  category: string;
  items: {
    feature: string;
    zedu: {
      status: boolean | "partial";
      label: string;
      description?: string;
    };
    competitor: {
      status: boolean | "partial";
      label: string;
      description?: string;
    };
  }[];
}

export interface DeepDiveSection {
  title: string;
  subtitle: string;
  zeduHeading: string;
  zeduPoints: string[];
  competitorHeading: string;
  competitorPoints: string[];
}

export interface ComparisonFAQ {
  question: string;
  answer: string;
}

export interface ComparisonPageContent {
  slug: "zedu-vs-discord" | "zedu-vs-slack";
  competitorName: "Discord" | "Slack";
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  verdictTitle: string;
  verdictDescription: string;
  competitorSummary: {
    title: string;
    description: string;
    bestFor: string;
    strengths: string[];
    tradeoffs: string[];
  };
  zeduSummary: {
    title: string;
    description: string;
    bestFor: string;
    strengths: string[];
    tradeoffs: string[];
  };
  matrix: FeatureComparison[];
  deepDives: DeepDiveSection[];
  faqs: ComparisonFAQ[];
  ctaHeading: string;
  ctaDescription: string;
}

export const comparisonPages: Record<string, ComparisonPageContent> = {
  "zedu-vs-discord": {
    slug: "zedu-vs-discord",
    competitorName: "Discord",
    metaTitle: "Zedu vs Discord: Best Platform for Bootcamps & Cohorts",
    metaDescription:
      "Comparing Zedu and Discord for bootcamps, schools, and cohort learning. See how structured channels, built-in Buzz classrooms, and distraction-free spaces compare.",
    keywords: [
      "Discord alternative for bootcamps",
      "Discord vs Zedu",
      "cohort communication platform",
      "Discord alternative for education",
      "learning community software",
      "Discord for bootcamps",
      "education chat platform",
    ],
    heroBadge: "Platform Comparison",
    heroTitle: "Zedu vs Discord: The Better Platform for Bootcamps & Cohorts",
    heroSubtitle:
      "Discord revolutionized voice hangouts and gaming communities. But when running rigorous educational cohorts, bootcamps and schools need structured classrooms, noise-free learning, and dedicated cohort tooling.",
    verdictTitle: "The Quick Verdict",
    verdictDescription:
      "Choose Discord if you are hosting a casual gaming group or an open-ended hobbyist server where voice channels and bots take priority over structured lessons. Choose Zedu if you run a bootcamp, academy, or school that requires organized cohort channels, live Buzz audio/video classrooms, assignment tracking, and a professional distraction-free environment.",
    competitorSummary: {
      title: "Discord Overview",
      description:
        "Discord is a powerhouse for casual community hangouts and gaming servers, offering instantaneous voice chat and an extensive ecosystem of community bots.",
      bestFor: "Gaming guilds, hobbyist groups, and casual developer hangouts",
      strengths: [
        "Instant always-on drop-in voice and video channels",
        "Free tier with unlimited seats for general public servers",
        "Vast bot and webhook ecosystem for gaming and automation",
        "Widespread familiarity among younger digital natives",
      ],
      tradeoffs: [
        "Unstructured chat streams lead to lost assignments and missed announcements",
        "High distraction environment with gaming status alerts and server noise",
        "No native LMS, lecture scheduling, or assignment file hubs",
        "Lacks institutional privacy controls, attendance tracking, and FERPA alignment",
      ],
    },
    zeduSummary: {
      title: "Zedu Overview",
      description:
        "Zedu is purpose-built for education, bootcamps, and cohort-based academies, uniting structured curriculum channels, live Buzz classrooms, and resource hubs in one workspace.",
      bestFor: "Bootcamps, online academies, university cohorts, and educational communities",
      strengths: [
        "Cohort channels organized by syllabus modules, lessons, and project teams",
        "Native Buzz live audio/video classrooms with screen share & lecture archiving",
        "Noise-free, professional environment without gaming distractions or public ads",
        "Role-based permission architecture designed for instructors, mentors, and students",
        "Dedicated resource hubs and assignment collaboration spaces",
      ],
      tradeoffs: [
        "Focused exclusively on education and learning communities, not gaming servers",
        "Curated educational integration suite rather than endless hobbyist bot libraries",
      ],
    },
    matrix: [
      {
        category: "Learning & Cohort Structure",
        items: [
          {
            feature: "Cohort-Specific Module Channels",
            zedu: {
              status: true,
              label: "Built-in",
              description: "Channels map automatically to syllabus milestones and cohorts",
            },
            competitor: {
              status: "partial",
              label: "Manual Setup",
              description: "Requires tedious manual role gates and channel permission overrides",
            },
          },
          {
            feature: "Structured Homework & Resource Hubs",
            zedu: {
              status: true,
              label: "Native Feature",
              description: "Pinned lesson materials, assignment guidelines, and project folders",
            },
            competitor: {
              status: false,
              label: "Not Available",
              description: "Files quickly get buried in fast-scrolling chat history",
            },
          },
          {
            feature: "Noise-Free, Distraction-Free Workspace",
            zedu: {
              status: true,
              label: "100% Educational",
              description: "No game presence status, public discoverability, or off-topic spam",
            },
            competitor: {
              status: false,
              label: "High Distraction",
              description: "Students are surrounded by game notifications, friends list, and outside servers",
            },
          },
        ],
      },
      {
        category: "Live Classes & Collaboration",
        items: [
          {
            feature: "Integrated Live Classrooms (Buzz)",
            zedu: {
              status: true,
              label: "Native Buzz Classrooms",
              description: "HD video, screen sharing, classroom moderation, and session recaps",
            },
            competitor: {
              status: true,
              label: "Voice Channels",
              description: "Low-latency voice channels with screen share (quality capped on free tier)",
            },
          },
          {
            feature: "Curriculum Lecture Recordings & Archives",
            zedu: {
              status: true,
              label: "Permanent Access",
              description: "Recorded classroom sessions remain indexed and accessible for review",
            },
            competitor: {
              status: false,
              label: "Third-Party Tools",
              description: "Requires external bots or recording software with complex storage setups",
            },
          },
          {
            feature: "Instructor & Mentor Moderation Tools",
            zedu: {
              status: true,
              label: "Education-Specific",
              description: "Dedicated TA/mentor queues, hand-raising, and cohort role hierarchies",
            },
            competitor: {
              status: "partial",
              label: "Generic Moderation",
              description: "Basic server kicks, bans, and timeout roles designed for online communities",
            },
          },
        ],
      },
      {
        category: "Administration, Privacy & Pricing",
        items: [
          {
            feature: "Institutional Privacy & Safety",
            zedu: {
              status: true,
              label: "Enterprise-Ready",
              description: "Private organization boundary without unsolicited direct messages from strangers",
            },
            competitor: {
              status: false,
              label: "Public Platform",
              description: "Open DM model opens students up to external phishing, spam, and unmonitored DMs",
            },
          },
          {
            feature: "Pricing Model for Cohorts",
            zedu: {
              status: true,
              label: "Predictable Education Pricing",
              description: "Flat, cohort-friendly plans without per-seat penalty for growing student counts",
            },
            competitor: {
              status: "partial",
              label: "Freemium + Server Boosts",
              description: "Free core tier, but high video quality and storage require expensive recurring server boosts",
            },
          },
        ],
      },
    ],
    deepDives: [
      {
        title: "Structure: Why Chat Feeds Fail Educational Cohorts",
        subtitle:
          "In a bootcamp, missing an announcement or lecture link directly hurts graduation rates.",
        zeduHeading: "Zedu's Cohort Architecture",
        zeduPoints: [
          "Cohorts are organized by modules and tracks, preventing lesson links from getting buried in conversation.",
          "Important announcements and assignments stay prominently anchored to their respective classes.",
          "Mentors and TAs can easily locate student questions and follow up without searching through thousands of chat messages.",
        ],
        competitorHeading: "Discord's General Chat Model",
        competitorPoints: [
          "Linear chat channels scroll rapidly; students miss critical assignment updates amidst casual chatter.",
          "Thread creation is clunky and threads automatically archive after periods of inactivity.",
          "Organizers spend hours crafting complex permission matrices for roles that break across cohort transitions.",
        ],
      },
      {
        title: "Environment: Focus vs. Constant Gaming Distractions",
        subtitle:
          "Learning requires sustained concentration. Platforms designed for leisure undermine focus.",
        zeduHeading: "A Dedicated Learning Atmosphere",
        zeduPoints: [
          "Students sign into a clean, professional platform designed for academic and technical growth.",
          "No gaming activity badges, no popups from outside servers, and zero unrelated social distractions.",
          "Builds professional communication habits that prepare students for workplace engineering teams.",
        ],
        competitorHeading: "Discord's Entertainment Ecosystem",
        competitorPoints: [
          "Students receive notifications from dozens of gaming, meme, and hobbyist servers alongside school channels.",
          "Friends list shows who is playing games in real time, pulling focus away from cohort assignments.",
          "Unsolicited DMs from random server members create privacy, safety, and harassment vulnerabilities.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why are bootcamps moving away from Discord to Zedu?",
        answer:
          "While Discord is cost-effective for informal groups, bootcamps struggle with student retention and disorganization. Important announcements get buried, students are easily distracted by gaming alerts, and instructors lack native tools for lecture recordings and cohort tracking. Zedu solves this with purpose-built cohort channels, integrated Buzz classrooms, and a professional learning atmosphere.",
      },
      {
        question: "Can Zedu replace Discord voice channels for live lectures?",
        answer:
          "Yes. Zedu includes Buzz, an integrated live classroom and audio/video collaboration space. Buzz offers high-definition video, screen sharing, mentor breakouts, and session recording specifically optimized for lectures and team programming.",
      },
      {
        question: "Is Zedu more private and secure than Discord for schools?",
        answer:
          "Absolutely. Discord operates on an open server model where students frequently receive spam and unsolicited direct messages. Zedu provides a closed, institutionally governed workspace where only enrolled students, mentors, and administrators can communicate.",
      },
      {
        question: "How difficult is it to migrate our bootcamp from Discord to Zedu?",
        answer:
          "Migration is straightforward. You can configure your cohort tracks, invite instructors, mentors, and students with one-click links or bulk email invites, and start hosting classes on day one without needing complex bot setups.",
      },
    ],
    ctaHeading: "Upgrade Your Bootcamp Beyond Discord",
    ctaDescription:
      "Join modern bootcamps and online academies giving students an organized, distraction-free environment to learn, build, and graduate.",
  },
  "zedu-vs-slack": {
    slug: "zedu-vs-slack",
    competitorName: "Slack",
    metaTitle: "Zedu vs Slack: The Smart Communication Choice for Bootcamps",
    metaDescription:
      "Comparing Zedu and Slack for cohort education and bootcamps. Discover why bootcamps switch from expensive per-user Slack seats to Zedu's education-first platform.",
    keywords: [
      "Slack alternative for bootcamps",
      "Slack alternative for learning communities",
      "Slack vs Zedu",
      "bootcamp communication platform",
      "Slack pricing for education",
      "cohort learning management",
      "Slack alternatives",
    ],
    heroBadge: "Platform Comparison",
    heroTitle: "Zedu vs Slack: Why Bootcamps & Academies Choose Zedu",
    heroSubtitle:
      "Slack is the gold standard for corporate enterprise teams. But for cohort-based bootcamps and learning communities, prohibitive per-seat pricing and 90-day message limits make Slack financially unsustainable.",
    verdictTitle: "The Quick Verdict",
    verdictDescription:
      "Choose Slack if you are an enterprise software company coordinating cross-functional corporate departments with hundreds of enterprise SaaS integrations. Choose Zedu if you run a bootcamp, school, or learning community that needs affordable cohort-based pricing, permanent message history, integrated live video classrooms, and student collaboration hubs.",
    competitorSummary: {
      title: "Slack Overview",
      description:
        "Slack is the industry leader for enterprise workplace collaboration, featuring rich third-party app integrations and polished conversational threading.",
      bestFor: "Enterprise corporate teams and established B2B knowledge-work companies",
      strengths: [
        "Unrivaled ecosystem of 2,600+ third-party SaaS integrations",
        "Polished threading model and fine-grained notification settings",
        "Enterprise-grade SOC2 compliance and single sign-on (SSO)",
        "Widely adopted standard across professional corporate workplaces",
      ],
      tradeoffs: [
        "Prohibitive per-user/month billing that severely penalizes large student cohorts",
        "Free tier aggressively deletes message history and files after only 90 days",
        "Lacks native full-classroom video software (Huddles are limited, requiring paid Zoom)",
        "No education-specific tooling for syllabi, homework submissions, or student progress",
      ],
    },
    zeduSummary: {
      title: "Zedu Overview",
      description:
        "Zedu is engineered from the ground up for cohort learning and educational academies, offering flat, predictable pricing, permanent message archiving, and built-in live video classrooms.",
      bestFor: "Bootcamps, online academies, coding schools, and cohort learning programs",
      strengths: [
        "Flat, education-friendly pricing that does not penalize growing student cohorts",
        "Permanent message, lecture, and file history retention across all cohorts",
        "Built-in Buzz live audio/video classrooms eliminating the need for expensive Zoom licenses",
        "Structured cohort channels mapped to curriculum modules and project sprints",
        "Designed specifically for the mentor-instructor-student dynamic",
      ],
      tradeoffs: [
        "Focused on education workflows rather than corporate HR/payroll integrations",
        "Specialized tool suite tailored for learning rather than generic enterprise office work",
      ],
    },
    matrix: [
      {
        category: "Pricing & Economic Scalability",
        items: [
          {
            feature: "Per-Student Seat Pricing",
            zedu: {
              status: true,
              label: "Flat / Cohort-Friendly",
              description: "Designed for education; student volume does not skyrocket your monthly bill",
            },
            competitor: {
              status: false,
              label: "$7.25–$12.50+ /user/month",
              description: "Paying per seat for hundreds of transient students creates unsustainable overhead",
            },
          },
          {
            feature: "Message & Resource History Retention",
            zedu: {
              status: true,
              label: "Permanent History",
              description: "All cohort resources, discussions, and code snippets remain permanently accessible",
            },
            competitor: {
              status: false,
              label: "90-Day Auto-Deletion",
              description: "Free tier wipes student questions and lesson materials after 90 days",
            },
          },
          {
            feature: "Bundled Live Video Classrooms",
            zedu: {
              status: true,
              label: "Included with Buzz",
              description: "Full live classes, screen sharing, and recordings included without extra licenses",
            },
            competitor: {
              status: "partial",
              label: "Huddles Only / External Zoom",
              description: "Slack Huddles lack classroom moderation, forcing bootcamps to buy costly Zoom licenses",
            },
          },
        ],
      },
      {
        category: "Learning Workflows & Structure",
        items: [
          {
            feature: "Cohort & Module Channel Layout",
            zedu: {
              status: true,
              label: "Native Structure",
              description: "Channels logically organized by cohort intake, module, and study group",
            },
            competitor: {
              status: "partial",
              label: "Generic Channels",
              description: "Flat channel lists easily become cluttered with hundreds of stale channels",
            },
          },
          {
            feature: "Assignment & Project Collaboration",
            zedu: {
              status: true,
              label: "Built-in Hubs",
              description: "Dedicated spaces for assignment prompts, deliverables, and mentor code review",
            },
            competitor: {
              status: false,
              label: "Requires Integrations",
              description: "Must stitch together third-party bots and external tools",
            },
          },
          {
            feature: "Mentor & TA Office Hour Queues",
            zedu: {
              status: true,
              label: "Education-Centric",
              description: "Streamlined assistance requests so mentors can easily support struggling students",
            },
            competitor: {
              status: false,
              label: "Unstructured DMs",
              description: "Mentors get inundated with chaotic private messages without queue tracking",
            },
          },
        ],
      },
      {
        category: "Administration & Operations",
        items: [
          {
            feature: "Automated Cohort Onboarding & Archiving",
            zedu: {
              status: true,
              label: "One-Click Archiving",
              description: "Transition completed cohorts to alumni groups without breaking links or permissions",
            },
            competitor: {
              status: "partial",
              label: "Manual Management",
              description: "Admins must manually archive channels and deactivate student guest accounts",
            },
          },
          {
            feature: "Enterprise App Integrations",
            zedu: {
              status: "partial",
              label: "Education-Focused",
              description: "Integrates with modern learning and development workflows",
            },
            competitor: {
              status: true,
              label: "2,600+ Integrations",
              description: "Unmatched library of corporate enterprise productivity software",
            },
          },
        ],
      },
    ],
    deepDives: [
      {
        title: "Cost Analysis: Why Slack Becomes Unaffordable for Bootcamps",
        subtitle:
          "Per-seat SaaS models make sense for corporate staff, but fail drastically with rolling student intakes.",
        zeduHeading: "Zedu's Scalable Education Pricing",
        zeduPoints: [
          "Flat, predictable pricing models tailored to educational programs and community sizes.",
          "Onboard hundreds of students per cohort without recalculating monthly overhead per head.",
          "Keep alumni in read-only or community channels without incurring ongoing per-seat charges.",
        ],
        competitorHeading: "Slack's Per-Seat Billing Penalty",
        competitorPoints: [
          "A bootcamp with 200 active students pays $1,450 to $2,500 every single month just for Slack Pro/Business.",
          "Admins waste hours deactivating graduated students to avoid surprise invoice spikes.",
          "The alternative free tier wipes message history and file uploads after 90 days, ruining the learning archive.",
        ],
      },
      {
        title: "Learning Experience: Built for Students, Not Corporate Executives",
        subtitle:
          "Corporate knowledge-work software does not address the pedagogical needs of instructors and learners.",
        zeduHeading: "A Purpose-Built Learning Platform",
        zeduPoints: [
          "Built-in Buzz video classrooms remove the need to manage separate Zoom room links and credentials.",
          "Cohort channels keep lesson discussions, assignments, and study groups cleanly compartmentalized.",
          "Mentors can triage student help requests effectively rather than getting overwhelmed in private DMs.",
        ],
        competitorHeading: "Slack's Corporate Focus",
        competitorPoints: [
          "Slack is optimized for corporate meetings, sales notifications, and executive announcements.",
          "Slack Huddles are lightweight informal chats, not full-featured interactive lecture halls.",
          "Students feel like they are navigating a corporate office rather than an engaging educational campus.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why should our bootcamp choose Zedu over Slack?",
        answer:
          "Slack is built for corporate teams and charges per active user ($7.25–$12.50+/mo), which becomes prohibitively expensive when managing cohorts of 50 to 500+ students. Furthermore, Slack's free plan deletes message history after 90 days. Zedu offers predictable education pricing, permanent lesson archives, and integrated Buzz video classrooms so you don't have to purchase Zoom licenses.",
      },
      {
        question: "Does Zedu have a 90-day message history limit like Slack's free plan?",
        answer:
          "No! Zedu retains your cohort messages, shared links, code snippets, and learning resources permanently, ensuring students can always review past lesson materials throughout their learning journey and beyond.",
      },
      {
        question: "Can Zedu replace both Slack and Zoom for our bootcamp?",
        answer:
          "Yes. Zedu combines organized cohort messaging channels with Buzz, an integrated live audio and video classroom system. You can conduct live lectures, screen shares, and mentor breakouts directly inside Zedu without paying for a separate Zoom or Google Meet workspace.",
      },
      {
        question: "Can we migrate our existing Slack channels to Zedu?",
        answer:
          "Yes. Setting up your cohort tracks and channels on Zedu takes only a few minutes. You can invite your instructors, teaching assistants, and students with one click.",
      },
    ],
    ctaHeading: "Stop Paying Corporate Per-Seat Tax on Students",
    ctaDescription:
      "Switch to Zedu and give your bootcamp an organized, affordable platform with permanent history and built-in live classrooms.",
  },
};

export const allComparisonSlugs = Object.keys(comparisonPages);
