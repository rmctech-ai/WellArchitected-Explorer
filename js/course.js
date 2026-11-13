window.COURSE = {
 "short": "WA",
 "key": "wellarchitected-explorer-v1",
 "prompt": "$",
 "termTitle": "aws cli",
 "where": "CLI",
 "lab": "war",
 "handsOn": "Review Board challenge",
 "errRe": "HRI|\\bFAILED\\b|error occurred|Error:|^[45]\\d\\d\\b|Failure:",
 "cats": [
  [
   "all",
   "ALL"
  ],
  [
   "core",
   "FRAMEWORK"
  ],
  [
   "dp",
   "DESIGN PRINCIPLES"
  ],
  [
   "pil",
   "SIX PILLARS"
  ],
  [
   "rev",
   "REVIEW"
  ]
 ],
 "catTitle": {
  "core": "THE FRAMEWORK",
  "dp": "THE 16 DESIGN PRINCIPLES",
  "pil": "THE SIX PILLARS",
  "rev": "WELL-ARCHITECTED REVIEW"
 },
 "kinds": {
  "cli": [
   "AWS CLI",
   "#1d5bd8"
  ],
  "wa": [
   "WA TOOL",
   "#7c3aed"
  ],
  "ops": [
   "OPERATIONS",
   "#0d9488"
  ],
  "err": [
   "FAILURE",
   "#e11d48"
  ]
 },
 "layers": [
  "FRAMEWORK",
  "ELASTICITY",
  "DECOUPLING",
  "DATA",
  "RESILIENCE",
  "PILLARS",
  "REVIEW"
 ],
 "levels": [
  [
   0,
   "GUESSING CAPACITY"
  ],
  [
   150,
   "CLOUD CURIOUS"
  ],
  [
   400,
   "PRINCIPLE KEEPER"
  ],
  [
   800,
   "PILLAR WALKER"
  ],
  [
   1300,
   "DESIGN REVIEWER"
  ],
  [
   2000,
   "SOLUTIONS ARCHITECT"
  ],
  [
   2900,
   "WELL-ARCHITECTED"
  ]
 ]
};
COURSE.errRe = new RegExp(COURSE.errRe, "i");
