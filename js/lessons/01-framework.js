window.LESSONS = window.LESSONS || [];
/* ---- helpers shared by all lesson files ---- */
window.WAY = function (o, ind) {           /* tiny YAML dumper for lab starters */
  ind = ind || ''; let s = '';
  for (const k in o) { const v = o[k]; if (v === undefined || v === null) continue;
    if (Array.isArray(v)) s += `${ind}${k}:\n` + v.map(x => `${ind}  - "${x}"\n`).join('');
    else if (typeof v === 'object') s += `${ind}${k}:\n` + WAY(v, ind + '  ') + (ind ? '' : '\n');
    else s += `${ind}${k}: ${v}\n`; }
  return s;
};
window.WA_GOOD = () => ({
  workload: { name: 'invoiceiq', env: 'prod', public: true, critical: true, global_users: true, read_heavy: true },
  components: {
    cdn: { type: 'cloudfront' }, lb: { type: 'alb' },
    web: { type: 'ec2', role: 'web', instance: 'm7g.large', azs: 2, autoscaling: true, stateful: false, graviton: true, pricing: 'savings-plan', steady: true, cpu_avg: 45 },
    queue: { type: 'sqs' }, worker: { type: 'lambda', role: 'worker', graviton: true }, cache: { type: 'elasticache' },
    db: { type: 'aurora', role: 'database', multi_az: true, backups: true, encrypted: true, public: false },
    files: { type: 's3', encrypted: true, public: false, lifecycle: true }
  },
  links: ['cdn -> lb : sync', 'lb -> web : sync', 'web -> cache : sync', 'web -> db : sync', 'web -> queue : async', 'queue -> worker : async', 'worker -> files : sync'],
  operations: { iac: true, deploy: 'pipeline', monitoring: true, alarms: true, runbooks: true, game_days: true },
  security: { root_mfa: true, least_privilege: true, cloudtrail: true, tls: true, waf: true, guardduty: true, secrets: 'secrets-manager' },
  cost: { budgets: true, tagging: true, schedule: true },
  reliability: { dr: 'warm-standby' }
});
/* WA_START(patch): the good workload with parts broken. patch is {section: {key: value|null}} or a function(o) */
window.WA_START = function (patch) {
  const o = WA_GOOD();
  if (typeof patch === 'function') patch(o);
  else for (const sec in patch || {}) { const p = patch[sec]; if (Array.isArray(p)) { o[sec] = p; continue; }
    if (sec === 'components') { for (const n in p) { if (p[n] === null) delete o.components[n]; else o.components[n] = Object.assign({}, o.components[n] || {}, p[n]); for (const k in o.components[n] || {}) if (o.components[n][k] === null) delete o.components[n][k]; } }
    else { o[sec] = Object.assign({}, o[sec] || {}, p); for (const k in o[sec]) if (o[sec][k] === null) delete o[sec][k]; } }
  return WAY(o);
};
/* WAFIX(r, ids, extra): challenge check, every id must be gone and the review must run */
window.WAFIX = function (r, ids, extra) {
  if (!r.ok) return 'the review must run: ' + r.error;
  const left = ids.filter(id => r.has(id));
  if (left.length) return 'still flagged: ' + left.join(', ') + ' (see the fix under each finding)';
  return extra ? extra(r) : true;
};
window.WA_COMP = (r, name) => (r.ctx && r.ctx.byName[name]) || null;

window.WA_PILLARS = { type: 'graph', nodes: [
  { id: 'wl', x: 470, y: 245, icon: 'cloud', label: 'Your workload', sub: 'apps + infra + people' },
  { id: 'ops', x: 140, y: 85, icon: 'gear', label: 'Operational Excellence', sub: 'run & improve' },
  { id: 'sec', x: 470, y: 60, icon: 'shield', label: 'Security', sub: 'protect' },
  { id: 'rel', x: 800, y: 85, icon: 'process', label: 'Reliability', sub: 'recover & meet demand' },
  { id: 'perf', x: 140, y: 405, icon: 'cpu', label: 'Performance Efficiency', sub: 'right resources, fast' },
  { id: 'cost', x: 470, y: 430, icon: 'list', label: 'Cost Optimization', sub: 'value for money' },
  { id: 'sus', x: 800, y: 405, icon: 'globe', label: 'Sustainability', sub: 'less impact', at: 1 },
  { id: 'tool', x: 840, y: 245, icon: 'search', label: 'WA Tool', sub: 'free review in console', at: 4 },
  { id: 'gdp', x: 110, y: 245, icon: 'book', label: 'Design principles', sub: 'the cloud way', at: 2 }
], edges: [{ a: 'wl', b: 'ops' }, { a: 'wl', b: 'sec' }, { a: 'wl', b: 'rel' }, { a: 'wl', b: 'perf' }, { a: 'wl', b: 'cost' }, { a: 'wl', b: 'sus', at: 1 }, { a: 'tool', b: 'wl', at: 4 }, { a: 'gdp', b: 'wl', at: 2 }] };

/* ============ 01 THE FRAMEWORK ============ */
LESSONS.push({
  id: 'framework', num: 1, cat: 'core', layer: 1, mins: 12,
  title: 'What is Well-Architected?', short: 'Six pillars, one way to judge a design',
  overview: `<p>The <b>AWS Well-Architected Framework</b> is AWS's collected experience from reviewing thousands of customer architectures, written down as <b>six pillars</b>, design principles and a set of questions. It gives you a consistent way to ask "is this design good?", and to find the risky parts before your customers do.</p><p>Lessons 2–9 teach the cloud <b>design principles</b> (the habits behind every good design). Lessons 10–15 walk the six <b>pillars</b>. Lesson 16 runs a real <b>review</b>.</p>`,
  hook: `<b>Six pillars, one question each: can we run it, protect it, trust it, make it fast, afford it, and sustain it?</b>`,
  why: `The Well-Architected Framework is part of CCP Domain 1 (Cloud Concepts) and is the backbone of the Solutions Architect Associate exam. In interviews, "how would you make this more reliable / cheaper / more secure?" is a Well-Architected question.`,
  scene: WA_PILLARS,
  steps: [
    { t: 'Why a framework?', sub: 'Measure designs the same way every time',
      body: `<p>Two engineers can build the same app very differently. The framework gives both of them the <b>same yardstick</b>: a set of questions per pillar ("How do you back up data?", "How do you detect and investigate security events?") and the best practices behind them.</p><p>It is <b>not an audit</b> and not a pass/fail certificate. It's a conversation that ends with a list of risks and an improvement plan.</p>`,
      analogy: `It's the <b>building inspector's checklist</b>: it doesn't design your house, but it tells you the fire exits are blocked before there's a fire.`,
      hook: `<b>Not an audit. A conversation that ends in a risk list.</b>`,
      words: ['Well-Architected Framework', 'best practices', 'questions', 'risk', 'improvement plan'],
      flow: { from: 'wl', to: 'sec', label: 'ASK', detail: ['How do you protect your data?', 'How do you recover from failure?'], color: 'blue' }, focus: ['wl'],
      cmds: [{ c: 'aws wellarchitected list-lenses --query "LensSummaries[].LensName"', o: '[\n    "AWS Well-Architected Framework",\n    "Serverless Lens",\n    "SaaS Lens",\n    "Generative AI Lens"\n]', k: 'wa' }] },
    { t: 'The six pillars', sub: 'Ops · Security · Reliability · Performance · Cost · Sustainability',
      body: `<p><b>Operational Excellence</b>: run and monitor systems, improve processes.<br><b>Security</b>: protect data, systems and assets.<br><b>Reliability</b>: perform correctly and recover from failure.<br><b>Performance Efficiency</b>: use resources efficiently as demand changes.<br><b>Cost Optimization</b>: deliver value at the lowest price.<br><b>Sustainability</b>: minimize environmental impact (added in 2021, the newest pillar).</p>`,
      analogy: `The pillars are the <b>six legs of a sturdy table</b>: cut one short and everything on top wobbles.`,
      hook: `<b>"OS-RPCS" → Ops, Security, Reliability, Performance, Cost, Sustainability.</b> Sustainability is the newest (6th).`,
      words: ['operational excellence', 'security', 'reliability', 'performance efficiency', 'cost optimization', 'sustainability'],
      flow: { from: 'wl', to: 'sus', label: '6 PILLARS', detail: ['sustainability = newest pillar'], color: 'green' }, focus: ['ops', 'sec', 'rel', 'perf', 'cost', 'sus'],
      cloud: `<b>CCP trap</b>: "Which pillar focuses on recovering from failure and meeting demand?" → Reliability, not Performance. "Using resources efficiently as demand changes?" → Performance Efficiency.`,
      cmds: [{ c: 'aws wellarchitected get-lens --lens-alias wellarchitected --query "Lens.PillarSummaries[].PillarName"', o: '[ "Operational Excellence", "Security", "Reliability",\n  "Performance Efficiency", "Cost Optimization", "Sustainability" ]', k: 'wa' }] },
    { t: 'General design principles', sub: 'The habits the cloud makes possible',
      body: `<p>Before the pillars, AWS lists general principles that only make sense in the cloud:</p><p>• <b>Stop guessing your capacity needs</b> (scale with demand).<br>• <b>Test systems at production scale</b> (create a full copy, then delete it).<br>• <b>Automate</b> to make experimentation easier.<br>• <b>Allow for evolutionary architectures</b> (designs change over time).<br>• <b>Drive architectures using data</b>.<br>• <b>Improve through game days</b> (practice failures).</p><p>Tutorials Dojo's cheat sheet extends this to 16 principles from AWS's "architecting for the cloud" guidance. Lessons 2–9 cover all 16.</p>`,
      analogy: `On-premises is <b>buying a car</b>: you guess how many seats you'll ever need. The cloud is <b>ride-hailing</b>: order a bigger car only when the whole family comes.`,
      hook: `<b>"Stop guessing, test big, automate, evolve, use data, play game days."</b>`,
      words: ['stop guessing capacity', 'production scale', 'automation', 'evolutionary architecture', 'data-driven', 'game days'],
      flow: { from: 'gdp', to: 'wl', label: 'PRINCIPLES', detail: ['capacity follows demand', 'experiments are cheap'], color: 'purple' }, focus: ['gdp', 'wl'],
      cmds: [{ c: 'aws autoscaling describe-auto-scaling-groups --query "AutoScalingGroups[0].[MinSize,DesiredCapacity,MaxSize]"', o: '[ 2, 2, 10 ]', k: 'cli' }] },
    { t: 'Pillars trade off', sub: 'Except security and operations',
      body: `<p>Real designs balance the pillars. Multi-Region active/active is wonderfully <b>reliable</b> but costs more; a smaller instance is <b>cheaper</b> but may hurt <b>performance</b>. A dev environment may trade reliability for cost.</p><p>Security and Operational Excellence are generally <b>not</b> traded away: you never get "a little less secure to save money".</p>`,
      analogy: `It's a <b>budget for a family trip</b>: you can trade hotel stars for a longer stay, but you don't trade away the seatbelts.`,
      hook: `<b>Trade cost ↔ reliability ↔ performance. Never trade away security.</b>`,
      words: ['trade-off', 'business requirements', 'RTO/RPO', 'cost vs reliability'],
      flow: { from: 'cost', to: 'rel', label: 'TRADE-OFF', detail: ['multi-Region = more reliable, more $'], color: 'amber' }, focus: ['cost', 'rel', 'perf'],
      cmds: [{ c: 'aws ce get-cost-and-usage --time-period Start=2026-11-01,End=2026-11-30 --granularity MONTHLY --metrics UnblendedCost', o: '{ "ResultsByTime": [ { "Total": { "UnblendedCost": { "Amount": "184.20", "Unit": "USD" } } } ] }', k: 'cli' }] },
    { t: 'The tools', sub: 'WA Tool, lenses, Trusted Advisor',
      body: `<p>The <b>AWS Well-Architected Tool</b> is free in the console: define a workload, answer the questions per pillar, get <b>high risk issues (HRI)</b> and <b>medium risk issues (MRI)</b> plus an improvement plan, and save milestones to track progress.</p><p><b>Lenses</b> add domain questions (Serverless, SaaS, Machine Learning, Generative AI…). <b>Trusted Advisor</b> automatically checks your account for cost, security, fault tolerance, performance and service limits.</p>`,
      analogy: `The WA Tool is a <b>doctor's annual check-up form</b>; lenses are the <b>specialist add-ons</b> (eyes, heart); Trusted Advisor is the <b>smartwatch</b> that watches you all the time.`,
      hook: `<b>WA Tool = you answer questions. Trusted Advisor = AWS checks your account automatically.</b>`,
      words: ['Well-Architected Tool', 'HRI', 'MRI', 'lens', 'milestone', 'Trusted Advisor'],
      flow: { from: 'tool', to: 'wl', label: 'REVIEW', detail: ['3 HRI · 5 MRI', 'improvement plan'], color: 'red' }, focus: ['tool', 'wl'],
      cmds: [{ c: 'aws wellarchitected create-workload --workload-name invoiceiq --environment PRODUCTION --lenses wellarchitected --aws-regions ap-southeast-1 --review-owner raul --description "Invoice pipeline"', o: '{ "WorkloadId": "a1b2c3d4e5f6", "WorkloadArn": "arn:aws:wellarchitected:ap-southeast-1:111122223333:workload/a1b2c3d4e5f6" }', k: 'wa' }] }
  ],
  summary: { title: 'You know the framework', sub: '6 pillars, design principles, review tools', text: `<p>Well-Architected is AWS's yardstick for designs: six pillars (Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, Sustainability), general design principles such as "stop guessing capacity", trade-offs between pillars (never on security), and the free Well-Architected Tool that turns answers into HRIs, MRIs and an improvement plan.</p>` },
  quiz: [
    { q: 'Which pillar was added most recently?', a: ['Cost Optimization', 'Reliability', 'Sustainability', 'Operational Excellence'], c: 2, why: 'Sustainability became the sixth pillar in 2021.' },
    { q: 'A Well-Architected review is best described as…', a: ['A compliance audit with a certificate', 'A conversation that finds risks and produces an improvement plan', 'An automated penetration test', 'A billing report'], c: 1, why: 'It is not an audit; it finds risks and improvement actions.' },
    { q: 'Which AWS service automatically checks your account for cost, security and fault-tolerance improvements?', a: ['AWS Well-Architected Tool', 'AWS Trusted Advisor', 'AWS Artifact', 'AWS Config'], c: 1, why: 'Trusted Advisor runs automated checks; the WA Tool is questionnaire-based.' },
    { q: '"Stop guessing your capacity needs" is a…', a: ['Security pillar rule', 'General design principle', 'Pricing model', 'Support plan feature'], c: 1, why: 'It is one of the general design principles of the framework.' }
  ],
  challenge: { task: 'Run the review on the starter workload, then fix two findings: turn on operations.monitoring and security.cloudtrail so no-monitoring and no-trail disappear.',
    hint: 'Under operations: add  monitoring: true   and under security: add  cloudtrail: true  then RUN REVIEW again.',
    starter: WA_START({ operations: { monitoring: false, alarms: null }, security: { cloudtrail: false } }),
    check: r => WAFIX(r, ['no-monitoring', 'no-trail']) },
  next: `The first design principle is the one the cloud was built for: <b>scalability</b>. Next: scale up vs scale out, why stateless servers matter, and where to keep session data.`,
  cheat: [['OS-RPCS', 'the six pillars'], ['Sustainability', 'newest pillar (2021)'], ['HRI / MRI', 'high / medium risk issue'], ['WA Tool', 'free, questionnaire review'], ['Trusted Advisor', 'automated account checks'], ['lens', 'extra domain questions']]
});

window.WA_SCALE = { type: 'graph', nodes: [
  { id: 'users', x: 90, y: 240, icon: 'users', label: 'Users', sub: 'traffic grows' },
  { id: 'alb', x: 290, y: 240, icon: 'api', label: 'Load balancer', sub: 'ELB / ALB' },
  { id: 'w1', x: 520, y: 110, icon: 'server', label: 'web-1', sub: 'AZ a' },
  { id: 'w2', x: 520, y: 240, icon: 'server', label: 'web-2', sub: 'AZ b' },
  { id: 'w3', x: 520, y: 370, icon: 'server', label: 'web-3', sub: 'added by ASG', at: 1 },
  { id: 'sess', x: 800, y: 170, icon: 'disk', label: 'Session store', sub: 'ElastiCache / DynamoDB', at: 3 },
  { id: 'big', x: 800, y: 380, icon: 'hardware', label: 'Bigger box', sub: 'scale UP', at: 0 }
], edges: [{ a: 'users', b: 'alb' }, { a: 'alb', b: 'w1' }, { a: 'alb', b: 'w2' }, { a: 'alb', b: 'w3', at: 1 }, { a: 'w1', b: 'sess', at: 3 }, { a: 'w2', b: 'sess', at: 3 }, { a: 'w3', b: 'sess', at: 3 }] };

/* ============ 02 SCALABILITY ============ */
LESSONS.push({
  id: 'scalability', num: 2, cat: 'dp', layer: 2, mins: 13,
  title: 'Scalability', short: 'Scale out, stay stateless',
  overview: `<p>A scalable system handles more load by <b>adding resources</b>, without redesign. In AWS you can scale <b>vertically</b> (a bigger instance) or <b>horizontally</b> (more instances). Horizontal scaling only works well when servers are <b>stateless</b>, so any server can answer any request.</p>`,
  hook: `<b>Scale UP = bigger box (has a ceiling). Scale OUT = more boxes (needs stateless).</b>`,
  why: `"Elasticity" and "scalability" are among the most tested CCP cloud concepts, and stateless design is the first thing an architect checks in a review.`,
  scene: WA_SCALE,
  steps: [
    { t: 'Scale up (vertical)', sub: 'Bigger instance, same design',
      body: `<p><b>Vertical scaling</b> means changing to a larger instance type (more CPU and RAM): t3.medium → m7g.2xlarge. It's simple and needs no code change.</p><p>But it has a <b>ceiling</b> (the biggest instance), usually needs a <b>stop/start</b>, and one big server is still a <b>single point of failure</b>.</p>`,
      analogy: `Scaling up is <b>buying a bigger jeepney</b>: easy, but there's a largest model, and if it breaks down everybody walks.`,
      hook: `<b>Up = bigger, simple, has a ceiling, still one box.</b>`,
      words: ['vertical scaling', 'scale up', 'instance type', 'ceiling', 'downtime'],
      flow: { from: 'w2', to: 'big', label: 'RESIZE', detail: ['t3.medium → m7g.2xlarge', 'stop → change type → start'], color: 'amber' }, focus: ['big', 'w2'],
      cmds: [{ c: 'aws ec2 modify-instance-attribute --instance-id i-0abc --instance-type "{\\"Value\\": \\"m7g.2xlarge\\"}"', o: 'An error occurred (IncorrectInstanceState): The instance \'i-0abc\' is not in the \'stopped\' state.', k: 'err' }] },
    { t: 'Scale out (horizontal)', sub: 'More instances behind a load balancer',
      body: `<p><b>Horizontal scaling</b> adds more instances and spreads requests across them with <b>Elastic Load Balancing</b>. <b>EC2 Auto Scaling</b> adds instances when CPU or requests rise and removes them when load falls.</p><p>No real ceiling, and losing one instance is no longer an outage. This is <b>elasticity</b>: capacity follows demand automatically.</p>`,
      analogy: `Scaling out is <b>a fleet of jeepneys</b> with a dispatcher (load balancer): rush hour, send more; midnight, park them.`,
      hook: `<b>Out = more boxes + load balancer + Auto Scaling = elasticity.</b>`,
      words: ['horizontal scaling', 'scale out', 'Elastic Load Balancing', 'EC2 Auto Scaling', 'elasticity'],
      flow: { from: 'alb', to: 'w3', label: 'NEW INSTANCE', detail: ['CPU 78% > target 50%', 'ASG desired 2 → 3'], color: 'green' }, focus: ['alb', 'w1', 'w2', 'w3'],
      cmds: [{ c: 'aws autoscaling put-scaling-policy --auto-scaling-group-name web-asg --policy-name cpu50 --policy-type TargetTrackingScaling --target-tracking-configuration "PredefinedMetricSpecification={PredefinedMetricType=ASGAverageCPUUtilization},TargetValue=50"', o: '{ "PolicyARN": "arn:aws:autoscaling:ap-southeast-1:111122223333:scalingPolicy:...:policyName/cpu50" }', k: 'cli' }] },
    { t: 'The state problem', sub: 'Why sticky servers break scaling',
      body: `<p>If web-1 keeps Raul's login session in its own memory, his next request must go back to web-1. When Auto Scaling removes web-1, Raul is logged out. Servers that hold state are <b>pets</b>: you can't replace them freely.</p><p>Sticky sessions (session affinity) hide the problem but make load uneven and failures painful.</p>`,
      analogy: `A stateful server is <b>a cashier who keeps your receipt in their pocket</b>: if they go on break, your purchase is gone.`,
      hook: `<b>State on the server = a pet. Stateless = cattle you can replace.</b>`,
      words: ['stateful', 'stateless', 'session', 'sticky sessions', 'pets vs cattle'],
      flow: { from: 'alb', to: 'w1', label: 'STICKY', detail: ['session only on web-1', 'web-1 removed → logged out'], color: 'red' }, focus: ['w1'],
      warn: `Sticky sessions are a crutch, not a design. In a review, "session state on the instance" is flagged as a reliability risk.`,
      cmds: [{ c: 'curl -s https://shop.example.com/cart -b session=abc123', o: '401 Unauthorized: session not found (served by web-3)', k: 'err' }] },
    { t: 'Go stateless', sub: 'Push state out of the server',
      body: `<p>Move session and shared state to a <b>shared store</b>: <b>ElastiCache</b> (in-memory Redis/Valkey) or <b>DynamoDB</b>; user files to <b>S3</b>; tokens in the client (signed JWT). Now every server is identical and any server can answer any request.</p><p>Stateless servers can scale out, scale in, be replaced, and be spread across AZs.</p>`,
      analogy: `Now receipts go into the <b>store's shared system</b>: any cashier can look up your purchase.`,
      hook: `<b>Sessions → ElastiCache or DynamoDB. Files → S3. Servers → identical.</b>`,
      words: ['session store', 'ElastiCache', 'DynamoDB', 'S3', 'JWT', 'shared state'],
      flow: { from: 'w3', to: 'sess', label: 'GET SESSION', detail: ['session:abc123 → user raul', 'any server can answer'], color: 'teal' }, focus: ['w1', 'w2', 'w3', 'sess'],
      cmds: [{ c: 'redis-cli -h sessions.abc.cache.amazonaws.com GET session:abc123', o: '"{\\"user\\":\\"raul\\",\\"cart\\":3}"', k: 'cli' }] },
    { t: 'Distributed processing', sub: 'Split big jobs into small parallel ones',
      body: `<p>Scalability also applies to <b>data processing</b>: instead of one giant job, split the work into chunks processed in parallel (many Lambda functions, EMR/Spark, AWS Batch). Fifty workers on 2% each finish far faster than one worker on 100%.</p>`,
      analogy: `<b>Fifty people folding fliers</b> finish before lunch; one person folds until midnight.`,
      hook: `<b>Big job → many small parallel jobs.</b>`,
      words: ['distributed processing', 'parallel', 'EMR', 'AWS Batch', 'Lambda fan-out'],
      flow: { from: 'alb', to: 'w2', label: 'PARALLEL', detail: ['10,000 invoices → 50 chunks'], color: 'purple' }, focus: ['w1', 'w2', 'w3'],
      cmds: [{ c: 'aws batch submit-job --job-name ocr --job-queue invoices --job-definition ocr:3 --array-properties size=50', o: '{ "jobName": "ocr", "jobId": "8f1e...", "arraySize": 50 }', k: 'cli' }] }
  ],
  summary: { title: 'You can design for scale', sub: 'Out beats up, stateless beats sticky', text: `<p>Vertical scaling is simple but capped and still a single box. Horizontal scaling with a load balancer and Auto Scaling gives elasticity, as long as servers are stateless: sessions in ElastiCache or DynamoDB, files in S3. Big jobs scale by splitting into parallel pieces.</p>` },
  quiz: [
    { q: 'Adding more EC2 instances behind a load balancer is…', a: ['Vertical scaling', 'Horizontal scaling', 'Right-sizing', 'Caching'], c: 1, why: 'More instances = scaling out (horizontal).' },
    { q: 'Why do stateless web servers matter for Auto Scaling?', a: ['They are cheaper per hour', 'Any instance can be added or removed without losing user data', 'They do not need security groups', 'They run only on Lambda'], c: 1, why: 'No local state means instances are replaceable.' },
    { q: 'Best place to keep shared web session data?', a: ['Instance store volume', 'ElastiCache or DynamoDB', 'An EBS snapshot', 'The load balancer access log'], c: 1, why: 'A shared, fast store keeps servers stateless.' },
    { q: 'A drawback of scaling vertically:', a: ['Requires a load balancer', 'Has an upper limit and is still a single point of failure', 'Requires code changes', 'Only works with containers'], c: 1, why: 'There is a largest instance, and one box can still fail.' }
  ],
  challenge: { task: 'Make the web tier scale out: spread it over 2 AZs, turn on autoscaling, make it stateless, and add a load balancer component (type: alb).',
    hint: 'In web set azs: 2, autoscaling: true, stateful: false. Then add a component named lb with type: alb (and a link "lb -> web : sync").',
    starter: WA_START({ components: { lb: null, cdn: null, web: { azs: 1, autoscaling: false, stateful: true } }, links: ['web -> cache : sync', 'web -> db : sync', 'web -> queue : async', 'queue -> worker : async', 'worker -> files : sync'], workload: { global_users: false } }),
    check: r => WAFIX(r, ['single-az', 'no-autoscaling', 'stateful-web', 'no-lb'], r => WA_COMP(r, 'web') ? true : 'keep the web component') },
  next: `Scaling out works best when servers are disposable. Next: <b>disposable resources instead of fixed servers</b>: golden AMIs, bootstrapping, containers and immutable infrastructure.`,
  cheat: [['scale up', 'bigger instance, has a ceiling'], ['scale out', 'more instances + ELB + Auto Scaling'], ['elasticity', 'capacity follows demand'], ['stateless', 'no session on the server'], ['session store', 'ElastiCache / DynamoDB'], ['target tracking', 'keep CPU at e.g. 50%']]
});

window.WA_DISPOSE = { type: 'graph', nodes: [
  { id: 'code', x: 100, y: 240, icon: 'code', label: 'Code + IaC', sub: 'Git repo' },
  { id: 'ami', x: 320, y: 110, icon: 'disk', label: 'Golden AMI', sub: 'pre-baked image' },
  { id: 'boot', x: 320, y: 370, icon: 'script', label: 'Bootstrap', sub: 'user data / SSM', at: 1 },
  { id: 'v1', x: 600, y: 160, icon: 'server', label: 'Fleet v1', sub: 'running' },
  { id: 'v2', x: 600, y: 330, icon: 'server', label: 'Fleet v2', sub: 'new, immutable', at: 3 },
  { id: 'bin', x: 850, y: 160, icon: 'box', label: 'Terminated', sub: 'never patched in place', at: 3 },
  { id: 'ctr', x: 850, y: 330, icon: 'pkg', label: 'Container image', sub: 'ECR → ECS / EKS', at: 2 }
], edges: [{ a: 'code', b: 'ami' }, { a: 'code', b: 'boot', at: 1 }, { a: 'ami', b: 'v1' }, { a: 'boot', b: 'v1', at: 1 }, { a: 'ami', b: 'v2', at: 3 }, { a: 'v1', b: 'bin', at: 3 }, { a: 'code', b: 'ctr', at: 2 }] };

/* ============ 03 DISPOSABLE RESOURCES ============ */
LESSONS.push({
  id: 'disposable', num: 3, cat: 'dp', layer: 2, mins: 12,
  title: 'Disposable Resources', short: 'Servers you can throw away',
  overview: `<p>On-premises, a server is a long-lived asset: you name it, patch it, nurse it for five years. In the cloud, servers are <b>temporary and replaceable</b>. You launch them from a known recipe, and when something changes you <b>replace</b> them instead of fixing them by hand.</p>`,
  hook: `<b>Don't fix servers. Replace them from a recipe.</b>`,
  why: `Disposable, immutable infrastructure is what makes Auto Scaling, blue/green deployments and fast recovery possible. It's a core idea behind CloudFormation, containers and every CI/CD pipeline.`,
  scene: WA_DISPOSE,
  steps: [
    { t: 'Golden images', sub: 'Bake everything in ahead of time',
      body: `<p>A <b>golden image</b> is an AMI (or container image) with the OS, patches, agents and your app already installed. New instances boot in seconds, already configured, and every instance is identical.</p><p><b>EC2 Image Builder</b> automates building, testing and patching these images.</p>`,
      analogy: `A golden AMI is <b>frozen ready-to-cook food</b>: heat it and serve; no chopping every time a customer walks in.`,
      hook: `<b>Golden AMI = fast boot, identical servers.</b>`,
      words: ['golden image', 'AMI', 'EC2 Image Builder', 'pre-baked', 'launch template'],
      flow: { from: 'ami', to: 'v1', label: 'LAUNCH', detail: ['ami-0golden (patched Nov 10)', 'boots in 40 s'], color: 'green' }, focus: ['ami', 'v1'],
      cmds: [{ c: 'aws ec2 create-image --instance-id i-0builder --name web-golden-2026-11-10', o: '{ "ImageId": "ami-0golden1234567" }', k: 'cli' }] },
    { t: 'Bootstrapping', sub: 'Configure at launch time',
      body: `<p><b>Bootstrapping</b> configures an instance when it starts: a <b>user data</b> script, Systems Manager documents, or configuration tools. It's flexible (pull the latest config) but slower to boot than a fully baked image.</p><p>Most teams use a <b>hybrid</b>: bake the slow, stable parts into the AMI, bootstrap the environment-specific settings.</p>`,
      analogy: `Bootstrapping is <b>cooking from a recipe card</b> each time: always fresh, takes longer.`,
      hook: `<b>Bake what's slow and stable; bootstrap what changes.</b>`,
      words: ['bootstrapping', 'user data', 'Systems Manager', 'hybrid', 'configuration'],
      flow: { from: 'boot', to: 'v1', label: 'USER DATA', detail: ['#!/bin/bash', 'aws ssm get-parameter /shop/prod/config'], color: 'blue' }, focus: ['boot', 'v1'],
      cmds: [{ c: 'cat userdata.sh', o: '#!/bin/bash\naws ssm get-parameter --name /shop/prod/env --query Parameter.Value --output text > /etc/shop.env\nsystemctl start shop', k: 'cli' }] },
    { t: 'Containers', sub: 'The same idea, smaller',
      body: `<p>A <b>container image</b> packages the app and its dependencies. Push it to <b>ECR</b>, run it on <b>ECS</b>, <b>EKS</b> or <b>Fargate</b> (serverless containers). Containers start in seconds and are disposable by design: a crashed task is simply replaced.</p>`,
      analogy: `A container is a <b>lunchbox</b>: the meal and its utensils travel together and look the same in any kitchen.`,
      hook: `<b>Image in ECR → tasks on ECS/EKS/Fargate → replaced, never repaired.</b>`,
      words: ['container', 'ECR', 'ECS', 'EKS', 'Fargate'],
      flow: { from: 'code', to: 'ctr', label: 'BUILD', detail: ['docker build → push to ECR'], color: 'purple' }, focus: ['code', 'ctr'],
      cmds: [{ c: 'aws ecs update-service --cluster shop --service web --force-new-deployment', o: '{ "service": { "serviceName": "web", "desiredCount": 3, "deployments": [ { "status": "PRIMARY", "rolloutState": "IN_PROGRESS" } ] } }', k: 'cli' }] },
    { t: 'Immutable infrastructure', sub: 'Replace, never patch in place',
      body: `<p>With <b>immutable infrastructure</b>, a running server is never changed. A new version means a new image and a new fleet (v2); traffic shifts to v2 and v1 is terminated. Rollback = shift traffic back.</p><p>No configuration drift, no "it works on web-3 but not web-5", and every change goes through code and a pipeline.</p>`,
      analogy: `Like <b>printing a new menu</b> instead of crossing out prices with a pen: every copy is clean and identical.`,
      hook: `<b>New version = new fleet. Old fleet → terminated. Rollback = switch back.</b>`,
      words: ['immutable infrastructure', 'blue/green', 'configuration drift', 'rollback', 'replace'],
      flow: { from: 'v1', to: 'bin', label: 'RETIRE', detail: ['traffic → v2 (100%)', 'v1 terminated'], color: 'amber' }, focus: ['v1', 'v2', 'bin'],
      cmds: [{ c: 'aws autoscaling start-instance-refresh --auto-scaling-group-name web-asg --preferences MinHealthyPercentage=90', o: '{ "InstanceRefreshId": "0a1b2c3d-..." }', k: 'ops' }] },
    { t: 'Infrastructure as code', sub: 'The recipe for everything',
      body: `<p>The whole environment (VPC, load balancer, Auto Scaling group, database) is described in <b>CloudFormation</b>, <b>CDK</b> or <b>Terraform</b>. You can create a full copy for testing, then delete it, and rebuild production the same way after a disaster.</p>`,
      analogy: `IaC is the <b>architect's blueprint</b>: lose the house, build an identical one from the same drawings.`,
      hook: `<b>If it isn't in code, it's a pet.</b>`,
      words: ['infrastructure as code', 'CloudFormation', 'CDK', 'Terraform', 'reproducible'],
      flow: { from: 'code', to: 'ami', label: 'IaC', detail: ['template → full environment'], color: 'teal' }, focus: ['code'],
      cloud: `See <b>IaC Explorer</b> for the hands-on CloudFormation course.`,
      cmds: [{ c: 'aws cloudformation deploy --template-file shop.yaml --stack-name shop-test && aws cloudformation delete-stack --stack-name shop-test', o: 'Successfully created/updated stack - shop-test', k: 'cli' }] }
  ],
  summary: { title: 'Your servers are disposable', sub: 'Recipes, not pets', text: `<p>Launch from golden images (fast, identical) or bootstrap with user data (flexible), or mix both. Containers make disposability the default. Immutable infrastructure replaces fleets instead of patching them, and IaC turns the whole environment into a repeatable recipe.</p>` },
  quiz: [
    { q: 'A pre-configured AMI with OS, patches and app installed is a…', a: ['Snapshot policy', 'Golden image', 'Launch log', 'Security baseline'], c: 1, why: 'Golden images let instances boot fully configured.' },
    { q: 'With immutable infrastructure, how do you deploy a new version?', a: ['SSH in and update each server', 'Launch new instances from a new image and retire the old ones', 'Resize the instance', 'Edit the AMI of running instances'], c: 1, why: 'Replace, never modify in place.' },
    { q: 'A script that runs when an EC2 instance first boots is…', a: ['User data', 'An IAM role', 'A security group', 'An Elastic IP'], c: 0, why: 'User data bootstraps configuration at launch.' },
    { q: 'Main benefit of disposable resources?', a: ['Servers never fail', 'Consistent, reproducible servers that can be replaced quickly', 'No need for monitoring', 'Free compute'], c: 1, why: 'Replaceability and consistency.' }
  ],
  challenge: { task: 'Stop hand-building servers: set operations.iac: true, deploy with a pipeline (deploy: pipeline or blue-green), and move web off the old t2 generation to a current instance (for example m7g.large).',
    hint: 'operations: iac: true and deploy: blue-green;  web: instance: m7g.large',
    starter: WA_START({ operations: { iac: false, deploy: 'manual' }, components: { web: { instance: 't2.large' } } }),
    check: r => WAFIX(r, ['no-iac', 'manual-deploy', 'old-gen']) },
  next: `Disposable servers need something to create and replace them without you. Next: <b>automation</b>: Auto Scaling, EventBridge, Systems Manager and alarms that act on their own.`,
  cheat: [['golden AMI', 'pre-baked image, fast boot'], ['user data', 'bootstrap at launch'], ['immutable', 'replace, never patch'], ['instance refresh', 'roll the ASG to a new image'], ['ECR → ECS/EKS/Fargate', 'containers'], ['IaC', 'CloudFormation / CDK / Terraform']]
});

window.WA_AUTO = { type: 'graph', nodes: [
  { id: 'cw', x: 130, y: 240, icon: 'eye', label: 'CloudWatch', sub: 'metrics & logs' },
  { id: 'alarm', x: 340, y: 120, icon: 'bell', label: 'Alarm', sub: 'CPU > 80%', at: 1 },
  { id: 'eb', x: 340, y: 360, icon: 'pipe', label: 'EventBridge', sub: 'events & schedules', at: 2 },
  { id: 'asg', x: 600, y: 90, icon: 'server', label: 'Auto Scaling', sub: 'add / replace', at: 1 },
  { id: 'lam', x: 600, y: 240, icon: 'lambda', label: 'Lambda', sub: 'custom action', at: 2 },
  { id: 'ssm', x: 600, y: 390, icon: 'gear', label: 'Systems Manager', sub: 'patch & run', at: 3 },
  { id: 'sns', x: 850, y: 160, icon: 'bell', label: 'SNS → on-call', sub: 'humans last', at: 4 }
], edges: [{ a: 'cw', b: 'alarm', at: 1 }, { a: 'alarm', b: 'asg', at: 1 }, { a: 'cw', b: 'eb', at: 2 }, { a: 'eb', b: 'lam', at: 2 }, { a: 'eb', b: 'ssm', at: 3 }, { a: 'alarm', b: 'sns', at: 4 }] };

/* ============ 04 AUTOMATION ============ */
LESSONS.push({
  id: 'automation', num: 4, cat: 'dp', layer: 2, mins: 12,
  title: 'Automation', short: 'Let the system react without you',
  overview: `<p>In a traditional data center, a human notices a problem and fixes it. In the cloud, almost every reaction can be <b>automated</b>: an alarm triggers scaling, an event triggers a function, a schedule patches a fleet. Humans design the automation and handle what's truly new.</p>`,
  hook: `<b>Detect → decide → act, with no human in the loop for known problems.</b>`,
  why: `Automation improves reliability (faster recovery), security (consistent controls) and cost (scale down at night). "Automate" appears in the design principles of several pillars.`,
  scene: WA_AUTO,
  steps: [
    { t: 'Observe first', sub: 'You can only automate what you can see',
      body: `<p><b>Amazon CloudWatch</b> collects metrics (CPU, latency, errors), logs and custom application metrics. Without monitoring, no automation can trigger and no human gets alerted.</p>`,
      analogy: `CloudWatch is the <b>dashboard of a car</b>: no fuel gauge, no warning light, no chance to react.`,
      hook: `<b>No metric → no alarm → no automation.</b>`,
      words: ['CloudWatch', 'metrics', 'logs', 'custom metrics', 'dashboard'],
      focus: ['cw'],
      cmds: [{ c: 'aws cloudwatch get-metric-statistics --namespace AWS/EC2 --metric-name CPUUtilization --dimensions Name=AutoScalingGroupName,Value=web-asg --statistics Average --period 300 --start-time 2026-11-14T00:00Z --end-time 2026-11-14T00:10Z', o: '{ "Datapoints": [ { "Average": 82.4, "Unit": "Percent" } ] }', k: 'ops' }] },
    { t: 'Alarms that act', sub: 'Scaling and recovery on their own',
      body: `<p>A <b>CloudWatch alarm</b> watches a metric and acts when it crosses a threshold: tell <b>Auto Scaling</b> to add instances, <b>recover</b> an impaired EC2 instance automatically, or reboot it. Auto Scaling also replaces instances that fail health checks.</p>`,
      analogy: `A <b>smoke detector wired to sprinklers</b>: it doesn't just beep, it puts the fire out.`,
      hook: `<b>Alarm → action (scale, recover, reboot), not just an email.</b>`,
      words: ['CloudWatch alarm', 'EC2 auto recovery', 'health check', 'scaling action'],
      flow: { from: 'alarm', to: 'asg', label: 'SCALE', detail: ['CPU > 80% for 5 min', '+2 instances'], color: 'green' }, focus: ['alarm', 'asg'],
      cmds: [{ c: 'aws cloudwatch put-metric-alarm --alarm-name web-recover --namespace AWS/EC2 --metric-name StatusCheckFailed_System --dimensions Name=InstanceId,Value=i-0abc --statistic Maximum --period 60 --evaluation-periods 2 --threshold 1 --comparison-operator GreaterThanOrEqualToThreshold --alarm-actions arn:aws:automate:ap-southeast-1:ec2:recover', o: '', k: 'ops' }] },
    { t: 'Event-driven automation', sub: 'EventBridge + Lambda',
      body: `<p><b>Amazon EventBridge</b> routes events from AWS services, SaaS apps and your code, and runs <b>schedules</b>. A rule can call <b>Lambda</b> when a bucket becomes public, an instance launches untagged, or every night at 8 PM to stop dev servers.</p>`,
      analogy: `EventBridge is a <b>building's intercom</b>: "door opened on floor 3" goes straight to the right guard.`,
      hook: `<b>EventBridge = if this happens (or at this time), do that.</b>`,
      words: ['EventBridge', 'event rule', 'schedule', 'Lambda', 'event-driven'],
      flow: { from: 'eb', to: 'lam', label: 'RULE MATCH', detail: ['cron(0 12 ? * MON-FRI *)', 'stop dev instances'], color: 'purple' }, focus: ['eb', 'lam'],
      cmds: [{ c: 'aws events put-rule --name stop-dev-nightly --schedule-expression "cron(0 12 ? * MON-FRI *)"', o: '{ "RuleArn": "arn:aws:events:ap-southeast-1:111122223333:rule/stop-dev-nightly" }', k: 'cli' }] },
    { t: 'Fleet operations', sub: 'Systems Manager does the chores',
      body: `<p><b>AWS Systems Manager</b> automates server chores: Patch Manager installs patches on a schedule, Run Command runs a script on 500 instances at once, Automation runbooks handle known incidents, Session Manager replaces SSH. Managed platforms like <b>Elastic Beanstalk</b> automate deployment, scaling and health monitoring for you.</p>`,
      analogy: `Systems Manager is the <b>building maintenance crew</b> with a master schedule.`,
      hook: `<b>Patch, run, remediate, connect: Systems Manager.</b>`,
      words: ['Systems Manager', 'Patch Manager', 'Run Command', 'Automation runbook', 'Elastic Beanstalk'],
      flow: { from: 'eb', to: 'ssm', label: 'PATCH', detail: ['maintenance window Sun 02:00', '120 instances patched'], color: 'teal' }, focus: ['ssm'],
      cmds: [{ c: 'aws ssm send-command --document-name AWS-RunPatchBaseline --targets Key=tag:env,Values=prod --parameters Operation=Install', o: '{ "Command": { "CommandId": "c0ffee...", "Status": "Pending", "TargetCount": 120 } }', k: 'ops' }] },
    { t: 'Humans last', sub: 'Escalate only what automation can\'t fix',
      body: `<p>Not everything should be automatic. Alarms for unknown problems notify people through <b>SNS</b> (email, SMS, chat, incident tools). Each new incident becomes a <b>runbook</b>, and repeated runbooks become automation.</p>`,
      analogy: `The sprinklers handle the fire; the <b>fire department</b> is still called for anything the sprinklers can't.`,
      hook: `<b>Known problem → automate. New problem → page a human → write a runbook.</b>`,
      words: ['SNS', 'on-call', 'runbook', 'escalation', 'incident'],
      flow: { from: 'alarm', to: 'sns', label: 'PAGE', detail: ['p99 latency > 2 s', 'unknown cause → on-call'], color: 'red' }, focus: ['sns', 'alarm'],
      cmds: [{ c: 'aws sns publish --topic-arn arn:aws:sns:ap-southeast-1:111122223333:oncall --message "web p99 latency 2.4s"', o: '{ "MessageId": "5f1c..." }', k: 'ops' }] }
  ],
  summary: { title: 'Your system reacts on its own', sub: 'Observe, alarm, act, escalate', text: `<p>CloudWatch makes problems visible; alarms trigger scaling and instance recovery; EventBridge rules and schedules trigger Lambda and Systems Manager; Systems Manager patches and fixes fleets. Humans get paged through SNS only for what isn't automated yet, and every new incident becomes a runbook.</p>` },
  quiz: [
    { q: 'Which service routes events and runs cron-style schedules to trigger actions?', a: ['Amazon EventBridge', 'Amazon Inspector', 'AWS Artifact', 'Amazon Macie'], c: 0, why: 'EventBridge rules match events or schedules and call targets.' },
    { q: 'Which service patches a fleet of EC2 instances on a schedule?', a: ['AWS Config', 'AWS Systems Manager Patch Manager', 'Amazon GuardDuty', 'AWS Shield'], c: 1, why: 'Patch Manager is part of Systems Manager.' },
    { q: 'A CloudWatch alarm can directly…', a: ['Rewrite your code', 'Trigger an Auto Scaling action or EC2 recovery', 'Create a new AWS account', 'Change your support plan'], c: 1, why: 'Alarms can trigger scaling, recover/reboot actions and SNS.' },
    { q: 'Which managed platform handles deployment, scaling and health monitoring for a web app?', a: ['AWS Elastic Beanstalk', 'Amazon S3 Glacier', 'AWS Snowball', 'Amazon Route 53'], c: 0, why: 'Beanstalk automates provisioning, deployment and scaling.' }
  ],
  challenge: { task: 'Make operations self-driving: metrics are already collected, but nobody is alerted and nothing is written down. Turn on operations.alarms and operations.runbooks.',
    hint: 'operations: alarms: true and runbooks: true',
    starter: WA_START({ operations: { alarms: false, runbooks: false } }),
    check: r => WAFIX(r, ['no-alarms', 'no-runbooks', 'no-monitoring']) },
  next: `Automation reacts to problems; good design stops one problem from spreading. Next: <b>loose coupling</b>: queues, topics and APIs that keep parts independent.`,
  cheat: [['CloudWatch', 'metrics, logs, alarms'], ['alarm → ASG / recover', 'act automatically'], ['EventBridge', 'events + schedules → targets'], ['Systems Manager', 'patch, run command, runbooks'], ['Elastic Beanstalk', 'managed app platform'], ['SNS', 'notify humans']]
});
