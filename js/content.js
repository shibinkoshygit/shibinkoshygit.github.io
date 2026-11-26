/* =====================================================================
   CONTENT.JS — everything the site says lives in this one file.
   Edit text here, save, commit, push. No build step.

   Conventions
   - Text wrapped in `backticks` is shown as inline code.
   - A field called `placeholder` renders a dashed "to be supplied" box.
     Replace it with the real value (see README.md for each one).
   - Search this file for "PLACEHOLDER" to find everything still missing.
   ===================================================================== */

window.SITE = {
  /* ---------- Identity ---------- */
  name: "Shibin Koshy",
  initials: "SK",
  location: "Montréal, QC, Canada",
  email: "shibinkoshy12345@gmail.com",
  github: "https://github.com/shibinkoshygit",
  linkedin: "https://www.linkedin.com/in/shibinkoshy",

  // PUBLIC copy of your CV — must never contain a phone number or street address.
  cv: "assets/Shibin_Koshy_CV.pdf",

  // Portrait shown in the hero (4:5).
  photo: "assets/img/shibin-cutout.webp",
  // true = the photo has a transparent background and blends into the page.
  // Set to false for a normal rectangular photo.
  photoCutout: true,

  /* ---------- Hero ---------- */
  hero: {
    eyebrow: "Software engineer · ML & computer vision",
    headline: "Software engineer with depth in machine learning and computer vision.",
    sub: "Master's student at Concordia University in Montréal. Recent work: fixing a critical CVE in a ~1M-line Java codebase, an end-to-end CNN that steers a simulated car, and a published paper on network routing.",
    facts: [
      { label: "Based in", value: "Montréal, QC" },
      { label: "Graduating", value: "December 2026" },
      { label: "Looking for", value: "SWE & ML internships, new-grad roles" }
    ]
  },

  /* ---------- About (first person) ---------- */
  about: [
    "I'm a Master's student in Applied Computer Science at Concordia University in Montréal, finishing in December 2026.",
    "Most of what I build sits where software engineering meets machine learning. I've fixed a critical dependency vulnerability and refactored duplicated code in a million-line Java codebase, trained a CNN to steer a simulated car from raw camera frames, and co-authored a published paper on routing optimisation.",
    "I care about being able to explain why a decision was made, not only what was built — the project pages below are written that way.",
    "I'm looking for software engineering and ML internships and new-grad roles."
  ],

  /* ---------- Featured projects (shown in this order) ----------
     size: "full" | "wide" | "half" | "narrow"  → card width in the grid
     visual: what the card shows at the top
       { type: "image", src, alt, position? }
       { type: "stats", items: [{ value, label }] }
       { type: "flow",  steps: ["a", "b"] }
       { type: "tokens", items: ["a", "b"] }
       { type: "placeholder", label }
     media: shown inside the detail view
       { type: "image", src, alt, caption? }
       { type: "frames", caption, frames: [{ src, alt, label }] }
       { type: "youtube", id: "VIDEO_ID", title }
       { type: "code", caption, code }
       { type: "placeholder", label }
  ---------------------------------------------------------------- */
  projects: [
    {
      id: "xwiki",
      size: "full",
      year: "2026",
      title: "XWiki Platform — Software Maintenance & Security",
      context: "Coursework · Concordia University · Java",
      summary: "Fixed a CVSS 9.8 transitive-dependency vulnerability and removed a 161-line code clone in a ~1M-line open-source Java codebase.",
      tags: ["Java", "Maven", "Snyk", "PMD CPD", "Refactoring"],
      visual: {
        type: "stats",
        items: [
          { value: "9.8", label: "CVSS score of the CVE fixed" },
          { value: "−232", label: "duplicated lines removed (+7)" },
          { value: "~1M", label: "lines in the codebase" }
        ]
      },
      media: [
        {
          type: "code",
          caption: "Shape of the fix: pin the patched version once, in the root `pom.xml`",
          code: "<dependencyManagement>\n  <dependencies>\n    <dependency>\n      <groupId>commons-collections</groupId>\n      <artifactId>commons-collections</artifactId>\n      <version>3.2.2</version>\n    </dependency>\n  </dependencies>\n</dependencyManagement>"
        }
      ],
      problem: [
        "XWiki Platform is an open-source Java codebase of roughly a million lines. The coursework was to analyse it with industry tooling and make maintenance changes that hold up to review.",
        "Two concrete problems came out of that analysis: a critical vulnerable library arriving through a transitive dependency, and a large block of duplicated code between two mail script services."
      ],
      built: [
        "**Security fix.** Snyk showed that `securityfilter:2.0` pulled in `commons-collections:3.1` as a transitive dependency. That version is affected by CVE-2015-7501, a CVSS 9.8 critical deserialisation vulnerability that allows remote code execution. I forced `commons-collections:3.2.2` through Maven `dependencyManagement` in the root POM.",
        "**Clone removal.** PMD CPD detected a 161-line / 502-token duplication between two mail script services. I refactored them onto a shared inheritance hierarchy."
      ],
      decisions: [
        {
          what: "Fix the version in the root POM's `dependencyManagement`, not module by module.",
          why: "The vulnerable jar arrived transitively, so no module declared it directly. Managing the version at the root applies the patched release across every module in one place, and keeps applying if another module later pulls in the same library."
        },
        {
          what: "Remove the clone with inheritance rather than copying fixes into both classes.",
          why: "The two services shared the same logic line for line. Putting it in one place means a future change is made once, and the public behaviour of both services stays the same."
        },
        {
          what: "Let the tools find the problems, then verify by hand.",
          why: "Snyk and PMD CPD give a reproducible starting point — a named CVE and an exact token count — so the change can be justified with evidence instead of opinion."
        }
      ],
      result: [
        "The patched `commons-collections:3.2.2` now resolves across all modules in place of 3.1.",
        "The clone refactor removed 232 lines and added 7, with behaviour preserved.",
        "Both pull requests were merged into the course forks of the repository used for this class. They were not submitted to the official upstream XWiki project."
      ],
      stack: ["Java", "Maven", "Snyk", "PMD / CPD", "Git", "GitHub pull requests"],
      links: [
        { label: "PR #13 — CVE-2015-7501 fix", url: "https://github.com/shibinkoshygit/xwiki-platform/pull/13" },
        { label: "PR #6 — code clone refactor", url: "https://github.com/shibinkoshygit/xwiki-platform/pull/6" }
      ]
    },

    {
      id: "self-driving-car",
      size: "half",
      year: "2021",
      title: "Self-Driving Car — End-to-End Behavioural Cloning",
      context: "B.Tech minor project · SRM IST · Python",
      summary: "A CNN that maps raw camera frames straight to a steering angle and drives a simulated car, with no hand-coded lane detection.",
      tags: ["Python", "Keras / TensorFlow", "OpenCV", "Flask"],
      visual: {
        type: "image",
        src: "assets/img/car-center.webp",
        alt: "Centre-camera training frame from the driving simulator: a road curving left between hills and a lake."
      },
      media: [
        {
          type: "frames",
          caption: "One moment of training data, as seen by the three-camera rig",
          frames: [
            { src: "assets/img/car-left.webp", alt: "Left-camera view of the simulator road.", label: "left" },
            { src: "assets/img/car-center.webp", alt: "Centre-camera view of the simulator road.", label: "centre" },
            { src: "assets/img/car-right.webp", alt: "Right-camera view of the simulator road.", label: "right" }
          ]
        },
        // PLACEHOLDER: replace with { type: "youtube", id: "VIDEO_ID", title: "..." }
        // or { type: "image", src: "assets/img/car-driving.gif", alt: "..." }
        { type: "placeholder", label: "GIF or video of the car driving itself goes here" }
      ],
      problem: [
        "Rule-based driving needs explicit lane detection, path planning and control logic, and it breaks on conditions the rules didn't anticipate.",
        "Behavioural cloning takes a different route: drive the course yourself, record what the cameras saw and what you did, and train a network to map one directly to the other."
      ],
      built: [
        "**Data collection** in the Udacity simulator using a three-camera rig (left, centre, right).",
        "**Preprocessing pipeline:** crop, resize, RGB→YUV conversion, plus flip, shift, shadow and brightness augmentation.",
        "**Model:** a CNN following the NVIDIA end-to-end architecture, regressing from an image to a single steering angle.",
        "**Live inference:** a Flask/SocketIO server that receives frames from the simulator and sends steering predictions back, with a PI controller holding the target speed."
      ],
      decisions: [
        {
          what: "Learn steering end to end instead of building a lane detector.",
          why: "The point of the project was to test whether a network could learn the whole perception-to-control mapping from examples, without any hand-written rules about what a lane looks like."
        },
        {
          what: "Augment with flips, shifts, shadows and brightness changes.",
          why: "The track turns mostly left, so a model trained on the raw recordings learns a left bias. Flipping balances left and right turns; the other augmentations make the model less dependent on the exact lighting and position it saw."
        },
        {
          what: "Convert to YUV and crop the frame.",
          why: "YUV is the colour space the NVIDIA architecture was designed around, and cropping removes parts of the image that carry no steering information."
        },
        {
          what: "Hold speed with a PI controller rather than predicting throttle.",
          why: "It keeps the learning problem to one output — steering — and leaves speed to a simple, predictable controller."
        }
      ],
      result: [
        "The trained model drives the car in the simulator from camera input alone, with predictions served live over the Flask/SocketIO server."
      ],
      stack: ["Python", "Keras / TensorFlow", "OpenCV", "Flask", "SocketIO", "Udacity simulator"],
      links: []
    },

    {
      id: "iov-routing",
      size: "half",
      year: "2022",
      title: "Routing Optimization in IoV Software-Defined Networks — Published Paper",
      context: "B.Tech capstone · SRM IST · Team of three",
      summary: "Reduced an NP-hard multi-constraint routing problem to a single objective solvable in polynomial time, and benchmarked five traffic-forecasting models.",
      tags: ["Research", "LSTM", "XGBoost", "ARIMA", "Prophet"],
      visual: {
        type: "stats",
        items: [
          { value: "NP-hard", label: "problem, reduced to one polynomial-time objective" },
          { value: "5", label: "forecasting models benchmarked" }
        ]
      },
      media: [],
      problem: [
        "Paper: “A Behavior-based and Provable Approach for Routing Optimization in IoV Software Defined Network.”",
        "In an Internet-of-Vehicles network, routes have to satisfy several quality-of-service constraints at once, and backup paths should not share links with the primary path. Selecting multi-constrained disjoint paths is NP-hard."
      ],
      built: [
        "Used the **analytic hierarchy process** to reduce the multi-objective problem to a single objective that can be solved in polynomial time.",
        "Benchmarked five forecasting models on network traffic data: **Autoregression, ARIMA, Prophet, XGBoost and LSTM**.",
        "Selected between models on RMSE, with ADF stationarity testing and ACF/PACF analysis in the pipeline."
      ],
      decisions: [
        {
          what: "Collapse the objectives with the analytic hierarchy process.",
          why: "AHP turns several competing constraints into one weighted objective, which is what moves the problem from NP-hard to something solvable in polynomial time."
        },
        {
          what: "Compare classical and learned forecasting models side by side.",
          why: "Running statistical models (Autoregression, ARIMA, Prophet) against XGBoost and an LSTM on the same data shows whether the heavier models actually earn their complexity."
        },
        {
          what: "Test stationarity before fitting.",
          why: "ARIMA-family models assume a stationary series; the ADF test and ACF/PACF plots check that assumption and guide the model order instead of guessing it."
        }
      ],
      result: [
        "The work was written up and published as a paper by the team of three."
      ],
      // PLACEHOLDER: replace with a sentence or two on which parts were yours, then delete `contributionPlaceholder`.
      contributionPlaceholder: "My specific contribution to the team's work goes here",
      stack: ["Python", "TensorFlow / Keras", "XGBoost", "statsmodels", "Prophet", "Jupyter"],
      links: [
        // PLACEHOLDER: replace with { label: "Read the paper", url: "https://..." }
        { placeholder: "Paper link — where it was published + URL or PDF" }
      ]
    },

    {
      id: "vr-audio-feedback",
      size: "wide",
      year: "2024",
      title: "Audio Feedback for VR Grab Interaction",
      context: "Immersive Technologies · Concordia University · Unreal Engine 5",
      summary: "A spatial warning sound that fires when a VR grab attempt fails, driven by a proximity sensor on the player's hand.",
      tags: ["Unreal Engine 5", "Blueprints", "VR", "HCI"],
      visual: {
        type: "image",
        src: "assets/img/vr-scene.webp",
        alt: "Unreal Engine viewport showing two grabbable blocks on a table, each surrounded by wireframe spheres marking its sound range."
      },
      media: [
        // PLACEHOLDER: replace with { type: "youtube", id: "VIDEO_ID", title: "VR audio feedback demo" }
        { type: "placeholder", label: "Demo video goes here (YouTube, unlisted)" },
        {
          type: "image",
          src: "assets/img/vr-editor.webp",
          alt: "Unreal Engine 5 editor with the VR scene open: grabbable objects with spherical sound-attenuation volumes, and the project's audio assets in the content browser.",
          caption: "The scene in the Unreal Engine 5 editor, with sound ranges visible around the grabbable objects"
        },
        {
          type: "image",
          src: "assets/img/vr-metasound.webp",
          alt: "Node graph named Proximity_detector in the Unreal Engine MetaSound editor, wiring triggers, an envelope and an oscillator to a mono output.",
          caption: "The `Proximity_detector` sound graph that generates the warning cue"
        }
      ],
      problem: [
        "In VR you often reach for an object and miss, and the only signal that the grab failed is visual — easy to overlook when your attention is on the object, not your hand.",
        "Published HCI research on auditory collision notification suggests sound is an effective channel for exactly this kind of feedback."
      ],
      built: [
        "A **spatial warning-sound system** in Unreal Engine 5 that fires when the player's grab attempt fails.",
        "A **proximity sensor Blueprint** mounted on the player's hand that detects near-misses.",
        "In earlier assignments for the same course: interaction primitives (a robotic arm and a laser pointer) and a depth-pass material effect."
      ],
      decisions: [
        {
          what: "Use audio rather than another visual cue.",
          why: "The visual channel is already busy during a grab. The design follows published HCI research on auditory collision notification rather than inventing a cue from scratch."
        },
        {
          what: "Put the sensor on the hand, not on each object.",
          why: "One sensor on the player's hand detects a near-miss against any grabbable object, so new objects work without extra setup."
        },
        {
          what: "Make the sound spatial.",
          why: "A positioned sound tells the player where the missed object is, not just that a miss happened."
        }
      ],
      result: [
        "A working VR scene where a failed grab produces an immediate spatial warning sound."
      ],
      stack: ["Unreal Engine 5", "Blueprints", "VR Template"],
      links: []
    },

    {
      id: "flicklytics",
      size: "narrow",
      year: "2025",
      title: "Flicklytics & Reactive NotiLytics — Movie Analytics Platform",
      context: "SOEN 6441 · Concordia University · Team of five",
      summary: "Set up the team's GitHub Actions CI and build badging, and documented the TMDb API integration both apps were built on.",
      tags: ["Java", "Play Framework", "GitHub Actions", "REST"],
      visual: { type: "flow", steps: ["push", "build", "test", "badge"] },
      media: [],
      problem: [
        "Five people pushing to one Java/Play Framework codebase need a shared, automatic answer to “does it still build and pass?” — and a shared understanding of the external API everything depends on."
      ],
      built: [
        "My part of this team project was the engineering groundwork:",
        "The team's **GitHub Actions CI pipeline** and build-status badging, so every push was automatically verified.",
        "**Documentation of the TMDb REST API integration** that both applications were built on."
      ],
      decisions: [
        {
          what: "Run CI on every push.",
          why: "A broken build is cheapest to fix when it's caught at the push that caused it, before anyone else builds on top of it."
        },
        {
          what: "Show build status with a badge in the repository.",
          why: "It makes the state of the main branch visible to the whole team without anyone having to open the Actions tab."
        },
        {
          what: "Write the API integration down once.",
          why: "Both applications depended on the same TMDb integration, so one shared reference avoids five slightly different readings of it."
        }
      ],
      result: [
        "Every push to the team repository was automatically verified, with build status visible on the repo."
      ],
      stack: ["Java", "Play Framework", "GitHub Actions", "TMDb REST API"],
      links: []
    },

    {
      id: "image-processing",
      size: "half",
      year: "2024",
      title: "Image Processing from First Principles",
      context: "Image Processing · Concordia University · Python",
      summary: "Core image-processing algorithms implemented from the underlying maths instead of library calls, up to content-aware seam carving.",
      tags: ["Python", "Computer vision", "Algorithms"],
      visual: {
        type: "tokens",
        items: ["Otsu segmentation", "Adaptive thresholding", "Histogram equalisation", "Laplacian edges", "Hybrid images", "Seam carving"]
      },
      media: [],
      problem: [
        "Calling a library function for thresholding or edge detection hides the part worth understanding. The goal here was to implement each algorithm from its mathematical definition."
      ],
      built: [
        "**Otsu's segmentation** by maximising inter-class variance.",
        "**Adaptive thresholding** with mean and Gaussian windows.",
        "**Histogram equalisation**, **Laplacian edge detection** and **hybrid images**.",
        "A **content-aware seam carving class** with protection and removal masks."
      ],
      decisions: [
        {
          what: "Implement from the maths, not from library calls.",
          why: "Writing the inter-class variance search or the equalisation mapping by hand shows exactly where each algorithm's behaviour comes from — and where it fails."
        },
        {
          what: "Give seam carving protection and removal masks.",
          why: "Plain seam carving only follows low-energy paths. Masks let the caller keep a region intact or force seams through an object to remove it."
        },
        {
          what: "Offer both mean and Gaussian windows for adaptive thresholding.",
          why: "They weight the neighbourhood differently, so having both makes the trade-off visible on the same image."
        }
      ],
      result: [
        "A set of working implementations covering segmentation, thresholding, equalisation, edge detection, hybrid images and content-aware resizing."
      ],
      stack: ["Python", "Jupyter"],
      links: []
    },

    {
      id: "neural-style-transfer",
      size: "half",
      year: "2025",
      title: "Neural Style Transfer",
      context: "Concordia University · Team of three · PyTorch",
      summary: "Gatys et al. style transfer, compared across VGG-16, VGG-19 and ResNet-18 backbones and Adam vs L-BFGS.",
      tags: ["PyTorch", "CNNs", "Computer vision"],
      // PLACEHOLDER: replace with { type: "image", src: "assets/img/nst.webp", alt: "..." }
      visual: { type: "placeholder", label: "Before / after style transfer images go here" },
      media: [
        // PLACEHOLDER: replace with { type: "image", src: "...", alt: "...", caption: "..." }
        { type: "placeholder", label: "Before / after style transfer images go here" }
      ],
      problem: [
        "Style transfer renders the content of one image in the visual style of another. The method works, but its output depends heavily on choices the original paper leaves open: which network, which layers, which weights, which optimiser."
      ],
      built: [
        "An implementation of **Gatys et al.** style transfer: content features taken from intermediate layers, style represented with Gram matrices.",
        "A comparison across **VGG-16, VGG-19 and ResNet-18** backbones.",
        "Experiments varying the content layers, the style/content weight ratio, and the optimiser (**Adam vs L-BFGS**)."
      ],
      decisions: [
        {
          what: "Represent style with Gram matrices.",
          why: "A Gram matrix captures which features occur together while discarding where they occur — which is what separates “style” from “content”."
        },
        {
          what: "Vary one factor at a time.",
          why: "Backbone, layer choice, weight ratio and optimiser all change the output. Changing them separately is the only way to say which one caused a difference."
        },
        {
          what: "Include a non-VGG backbone.",
          why: "Most style-transfer work uses VGG. Adding ResNet-18 tests whether that is a requirement or a habit."
        }
      ],
      result: [
        "A working implementation and a side-by-side comparison of backbones, layers, weight ratios and optimisers."
      ],
      stack: ["Python", "PyTorch", "VGG-16 / VGG-19", "ResNet-18"],
      links: []
    }
  ],

  /* ---------- Smaller work (compact grid) ---------- */
  smallerWork: [
    {
      title: "Stock price prediction — model comparison",
      text: "Six forecasting models compared on NSE data.",
      meta: "2021 · Python"
    },
    {
      title: "Concurrent banking system",
      text: "A concurrent banking system written in Erlang for COMP 6411.",
      meta: "Erlang",
      url: "https://github.com/shibinkoshygit/comp6411-erlang-banking"
    },
    // PLACEHOLDER: replace each with { title, text, meta, url? } — or delete the line.
    { placeholder: "Warzone / Risk Java game — one-line description" },
    { placeholder: "Distributed systems / ZooKeeper project — one-line description" }
  ],

  /* ---------- Experience & education ---------- */
  experience: [
    {
      role: "Machine Learning Intern",
      org: "SmartKnower",
      when: "Jan – Feb 2021",
      where: "Chennai, India",
      points: [
        "Built and evaluated ML models for image classification, sentiment analysis and stock price prediction in Python.",
        "Worked in a team to improve model accuracy and training efficiency."
      ]
    }
  ],
  education: [
    {
      role: "Master of Applied Computer Science",
      org: "Concordia University",
      when: "2023 – present",
      where: "Montréal, Canada",
      note: "In progress · expected December 2026",
      coursework: [
        "Software Design Methodologies", "Software Comprehension & Maintenance",
        "Advanced Programming Practices", "Distributed System Design",
        "Applied Artificial Intelligence", "Pattern Recognition",
        "Image Processing", "Immersive Technologies"
      ]
    },
    {
      role: "B.Tech, Computer Science and Engineering",
      org: "SRM Institute of Science and Technology",
      when: "2018 – 2022",
      where: "Chennai, India",
      note: "CGPA 8.46 / 10"
    }
  ],

  /* ---------- Skills ---------- */
  skills: [
    { group: "Languages", items: ["Java", "Python", "C/C++", "SQL", "JavaScript", "R", "Erlang"] },
    { group: "ML & CV", items: ["TensorFlow", "Keras", "PyTorch", "scikit-learn", "XGBoost", "OpenCV", "scikit-image", "LSTM / CNN architectures", "Prophet", "statsmodels"] },
    { group: "Engineering", items: ["Git", "GitHub Actions", "Maven", "JUnit", "Docker", "REST APIs", "Flask", "Snyk", "PMD / CPD", "SonarQube", "Refactoring", "Code review"] },
    { group: "Systems", items: ["Distributed systems", "Apache ZooKeeper", "Microservices", "Concurrency"] },
    { group: "Other", items: ["Unreal Engine 5 (Blueprints)", "Jupyter", "Linux"] }
  ],
  spokenLanguages: ["English (IELTS 7.0, CEFR C1)", "Malayalam", "Hindi"],

  /* ---------- Contact ---------- */
  contact: {
    heading: "Let's talk.",
    text: "I'm looking for software engineering and ML internships and new-grad roles. Email is the fastest way to reach me."
  }
};
