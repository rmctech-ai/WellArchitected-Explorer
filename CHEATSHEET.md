# Well-Architected Cheat Sheet

_Auto-generated from the Well-Architected Explorer lessons. One master memory hook + the key commands per lesson._

## 01 · What is Well-Architected?

> ★ Six pillars, one question each: can we run it, protect it, trust it, make it fast, afford it, and sustain it?

| Command | What it does |
|---|---|
| `OS-RPCS` | the six pillars |
| `Sustainability` | newest pillar (2021) |
| `HRI / MRI` | high / medium risk issue |
| `WA Tool` | free, questionnaire review |
| `Trusted Advisor` | automated account checks |
| `lens` | extra domain questions |

**Memory hooks:**

- **Why a framework?**: Not an audit. A conversation that ends in a risk list.
- **The six pillars**: "OS-RPCS" → Ops, Security, Reliability, Performance, Cost, Sustainability. Sustainability is the newest (6th).
- **General design principles**: "Stop guessing, test big, automate, evolve, use data, play game days."
- **Pillars trade off**: Trade cost ↔ reliability ↔ performance. Never trade away security.
- **The tools**: WA Tool = you answer questions. Trusted Advisor = AWS checks your account automatically.

## 02 · Scalability

> ★ Scale UP = bigger box (has a ceiling). Scale OUT = more boxes (needs stateless).

| Command | What it does |
|---|---|
| `scale up` | bigger instance, has a ceiling |
| `scale out` | more instances + ELB + Auto Scaling |
| `elasticity` | capacity follows demand |
| `stateless` | no session on the server |
| `session store` | ElastiCache / DynamoDB |
| `target tracking` | keep CPU at e.g. 50% |

**Memory hooks:**

- **Scale up (vertical)**: Up = bigger, simple, has a ceiling, still one box.
- **Scale out (horizontal)**: Out = more boxes + load balancer + Auto Scaling = elasticity.
- **The state problem**: State on the server = a pet. Stateless = cattle you can replace.
- **Go stateless**: Sessions → ElastiCache or DynamoDB. Files → S3. Servers → identical.
- **Distributed processing**: Big job → many small parallel jobs.

## 03 · Disposable Resources

> ★ Don't fix servers. Replace them from a recipe.

| Command | What it does |
|---|---|
| `golden AMI` | pre-baked image, fast boot |
| `user data` | bootstrap at launch |
| `immutable` | replace, never patch |
| `instance refresh` | roll the ASG to a new image |
| `ECR → ECS/EKS/Fargate` | containers |
| `IaC` | CloudFormation / CDK / Terraform |

**Memory hooks:**

- **Golden images**: Golden AMI = fast boot, identical servers.
- **Bootstrapping**: Bake what's slow and stable; bootstrap what changes.
- **Containers**: Image in ECR → tasks on ECS/EKS/Fargate → replaced, never repaired.
- **Immutable infrastructure**: New version = new fleet. Old fleet → terminated. Rollback = switch back.
- **Infrastructure as code**: If it isn't in code, it's a pet.

## 04 · Automation

> ★ Detect → decide → act, with no human in the loop for known problems.

| Command | What it does |
|---|---|
| `CloudWatch` | metrics, logs, alarms |
| `alarm → ASG / recover` | act automatically |
| `EventBridge` | events + schedules → targets |
| `Systems Manager` | patch, run command, runbooks |
| `Elastic Beanstalk` | managed app platform |
| `SNS` | notify humans |

**Memory hooks:**

- **Observe first**: No metric → no alarm → no automation.
- **Alarms that act**: Alarm → action (scale, recover, reboot), not just an email.
- **Event-driven automation**: EventBridge = if this happens (or at this time), do that.
- **Fleet operations**: Patch, run, remediate, connect: Systems Manager.
- **Humans last**: Known problem → automate. New problem → page a human → write a runbook.

## 05 · Loose Coupling

> ★ Tight coupling: one fails, all fail. Loose coupling: one fails, the queue waits.

| Command | What it does |
|---|---|
| `SQS` | queue · pull · one consumer · DLQ |
| `SNS` | topic · push · many subscribers |
| `EventBridge` | event bus · rules · schedules · SaaS |
| `SNS → SQS` | fan-out with buffers |
| `API Gateway` | well-defined interface |
| `backoff + jitter, idempotent` | fail gracefully |

**Memory hooks:**

- **The tight-coupling trap**: Waiting on a slow neighbor = inheriting its outage.
- **Well-defined interfaces**: Contract in front, freedom behind.
- **Queues buffer work**: SQS = queue = one message → one worker, pulled when ready.
- **Topics and events fan out**: SQS = one consumer, pull. SNS = many subscribers, push. EventBridge = rules + routing.
- **Fail gracefully**: Timeout · retry with backoff · idempotent · degrade gracefully.

## 06 · Services, Not Servers & Databases

> ★ Don't run what AWS can run for you. Don't force every dataset into one database.

| Command | What it does |
|---|---|
| `RDS / Aurora` | relational, SQL, joins |
| `DynamoDB` | key-value, ms latency, any scale |
| `Redshift` | analytics warehouse |
| `OpenSearch · Neptune · Timestream` | search · graph · time series |
| `read replica` | scale reads |
| `Multi-AZ` | availability, failover |

**Memory hooks:**

- **Services, not servers**: Managed = AWS runs it. Serverless = AWS runs and scales it, you pay per use.
- **Shared responsibility shifts**: More managed = less to patch. Your data and IAM are always yours.
- **Relational vs NoSQL**: Joins and transactions → RDS/Aurora. Key lookups at huge scale → DynamoDB.
- **More purpose-built databases**: Analytics → Redshift. Search → OpenSearch. Graph → Neptune. Cache → ElastiCache.
- **Scale the database**: Replicas = scale reads. Multi-AZ = survive failure.

## 07 · Growing Data & No Single Points of Failure

> ★ Data: store once in S3, tier it as it ages. Everything else: two of it, in two places.

| Command | What it does |
|---|---|
| `S3 data lake + Athena + Glue` | store once, query in place |
| `Lifecycle / Intelligent-Tiering` | cold data → cheaper tiers |
| `2+ AZs` | start of high availability |
| `RDS Multi-AZ` | sync standby, auto failover |
| `Route 53 failover` | health-checked DNS |
| `AWS Backup` | central backups, cross-Region |

**Memory hooks:**

- **A data lake on S3**: Land it in S3, query it with Athena, catalog it with Glue.
- **Tier data as it ages**: Hot → IA → Glacier → Deep Archive → delete. Unknown pattern → Intelligent-Tiering.
- **Redundancy across AZs**: High availability starts at 2 AZs. Multi-AZ = synchronous standby + automatic failover.
- **Detect and fail over**: Health check → stop sending traffic → replace → fail over.
- **Durable data, tested backups**: Automate backups, copy them away, prove the restore works.

## 08 · Optimize for Cost, Caching & Security

> ★ Right-size + right price. Cache close to the user. Secure every layer, in code.

| Command | What it does |
|---|---|
| `Compute Optimizer` | right-size recommendations |
| `Savings Plans / RIs` | steady baseline, up to ~72% off |
| `Spot` | interruptible, up to 90% off |
| `ElastiCache / DAX` | app & DynamoDB cache |
| `CloudFront` | edge cache (CDN) |
| `WAF · SG · IAM · KMS · GuardDuty` | defense in depth |

**Memory hooks:**

- **Right-size and use elasticity**: Measure, then shrink. Turn off what nobody uses.
- **Purchasing options**: Steady → Savings Plan. Spiky → On-Demand. Interruptible → Spot.
- **Caching**: Repeated reads → ElastiCache/DAX. Far-away users → CloudFront.
- **Security in every layer**: Edge → network → identity → data → detection. Every layer.
- **Security as code**: Templates set it, Config checks it, automation fixes it.

## 09 · Cloud Architecture Practices

> ★ Experiments are cheap in the cloud, so run them: test big, evolve, measure, rehearse.

| Command | What it does |
|---|---|
| `test at production scale` | IaC copy, load test, delete |
| `evolutionary architecture` | small reversible changes |
| `data-driven` | CloudWatch, X-Ray |
| `game day` | practice failure |
| `AWS FIS` | chaos experiments |
| `blameless review` | learn from every incident |

**Memory hooks:**

- **Test systems at production scale**: Spin up, load test, tear down: pay for hours, not for a second data center.
- **Allow for evolutionary architectures**: Small, reversible changes beat big-bang rewrites.
- **Drive architectures using data**: "In God we trust; all others bring data."
- **Improve through game days**: Break it on purpose, on a schedule, with a stop button.
- **Learn and repeat**: Incident → blameless review → fix in code → test again.

## 10 · Pillar 1: Operational Excellence

> ★ Ops as code, small reversible changes, expect failure, learn from everything.

| Command | What it does |
|---|---|
| `ops as code` | IaC, pipelines, runbooks |
| `small, reversible changes` | safe deployments |
| `anticipate failure` | pre-mortems, game days |
| `Organization · Prepare · Operate · Evolve` | areas |
| `CloudWatch · X-Ray` | observability |
| `Systems Manager` | runbooks & patching |

**Memory hooks:**

- **Design principles (1)**: Ops as code: infrastructure, deployments and runbooks are all code.
- **Design principles (2)**: Small · reversible · rehearsed · reviewed.
- **Best practice areas**: O-P-O-E: Organize, Prepare, Operate, Evolve.
- **Key services**: IaC · pipelines · CloudWatch · X-Ray · Systems Manager · Config.
- **In the exam and in reviews**: "Run & improve" → Operational Excellence.

## 11 · Pillar 2: Security

> ★ Identity first, trace everything, every layer, automate, encrypt, keep people away, rehearse incidents.

| Command | What it does |
|---|---|
| `strong identity foundation` | least privilege, MFA, roles |
| `traceability` | CloudTrail, Config |
| `all layers` | defense in depth |
| `data at rest / in transit` | KMS / TLS |
| `keep people away from data` | automation, no manual access |
| `prepare for events` | IR playbooks, simulations |

**Memory hooks:**

- **Strong identity foundation**: Least privilege + MFA + roles, not keys.
- **Traceability and layers**: Trace every call. Lock every layer.
- **Automate and protect data**: Encrypt at rest (KMS) and in transit (TLS). Enforce it in code.
- **People away from data, prepare for events**: No humans in the data. A rehearsed plan for the bad day.
- **Areas and exam keywords**: "Protect data, systems, assets" → Security pillar.

## 12 · Pillar 3: Reliability

> ★ Recover automatically, test recovery, scale out, stop guessing, change through automation.

| Command | What it does |
|---|---|
| `automatically recover` | monitor KPIs → automation |
| `RTO / RPO` | downtime / data loss |
| `backup & restore` | cheapest, hours |
| `pilot light` | data live, core minimal |
| `warm standby` | small working copy |
| `multi-site` | active/active, near zero |

**Memory hooks:**

- **Design principles**: Recover · test · scale out · stop guessing · automate change.
- **Foundations and change**: Quotas are a reliability risk. Know them before launch day.
- **RTO and RPO**: RTO = Time to recover. RPO = Point (data) you roll back to.
- **Four DR strategies**: BR → PL → WS → MS: cheaper/slower to costlier/faster.
- **Failure management**: "Recover from failure / meet demand" → Reliability.

## 13 · Pillar 4: Performance Efficiency

> ★ Democratize, go global, go serverless, experiment, mechanical sympathy.

| Command | What it does |
|---|---|
| `democratize advanced tech` | consume as a service |
| `go global in minutes` | Regions + edge |
| `use serverless` | no servers to manage |
| `experiment more often` | compare quickly |
| `mechanical sympathy` | match tech to access pattern |
| `CloudFront · ElastiCache · Graviton` | common fixes |

**Memory hooks:**

- **Democratize and go global**: Consume advanced tech as a service. Deploy near your users in minutes.
- **Serverless and experiments**: Serverless removes the server; experiments remove the guessing.
- **Mechanical sympathy**: Match the tool to the access pattern.
- **Areas and key services**: Select, compute, data, network, culture.
- **In the exam and in reviews**: "Efficient as demand changes" → Performance Efficiency. "Recover from failure" → Reliability.

## 14 · Pillar 5: Cost Optimization

> ★ Practice FinOps, pay per use, measure efficiency, stop heavy lifting, attribute spend.

| Command | What it does |
|---|---|
| `cloud financial management` | FinOps, cost visibility |
| `consumption model` | pay per use, schedules |
| `measure efficiency` | cost per business unit |
| `attribute expenditure` | tags |
| `Pricing Calculator / Cost Explorer / Budgets` | estimate / analyze / alert |
| `Savings Plans · Spot · Compute Optimizer` | price & size |

**Memory hooks:**

- **Cloud financial management**: Make cost visible to everyone; pay only for what you consume.
- **Measure, stop heavy lifting, attribute**: Cost per business unit · managed services · tags for attribution.
- **Cost-effective resources**: Right service · right size · right price · right tier.
- **Demand and time**: Scale with demand. Re-optimize when AWS ships something cheaper.
- **Tools and exam keywords**: Estimate → Pricing Calculator. Visualize → Cost Explorer. Alert → Budgets. Detail → CUR.

## 15 · Pillar 6: Sustainability

> ★ Understand impact, set goals, maximize utilization, adopt efficient tech, use managed services, reduce downstream impact.

| Command | What it does |
|---|---|
| `understand impact` | Carbon Footprint Tool |
| `maximize utilization` | no idle resources |
| `efficient hardware` | Graviton, Inferentia |
| `managed services` | shared efficiency |
| `reduce downstream impact` | store, move, send less |
| `shared responsibility` | AWS: of the cloud · you: in the cloud |

**Memory hooks:**

- **Understand impact and set goals**: Measure (Carbon Footprint Tool) → set a goal.
- **Maximize utilization**: Idle = wasted energy. Scale to demand, consolidate.
- **Efficient hardware and managed services**: Graviton + managed/serverless = same work, less energy.
- **Reduce downstream impact**: Store less, move less, send less.
- **Areas and exam keywords**: "Environmental impact / energy" → Sustainability.

## 16 · Run a Well-Architected Review

> ★ Define → ask → find risks → plan → fix → milestone → repeat.

| Command | What it does |
|---|---|
| `define workload + lenses` | scope the review |
| `HRI / MRI` | high / medium risk issues |
| `improvement plan` | HRIs first, in the backlog |
| `milestone` | snapshot to track progress |
| `cadence` | before go-live, after big changes, yearly |
| `Trusted Advisor · Config · Security Hub` | evidence between reviews |

**Memory hooks:**

- **Define the workload**: Workload = components that deliver one business outcome.
- **Answer the questions**: Honest answers → real risks. "Not applicable" needs a reason.
- **Prioritize the improvement plan**: HRIs first. Quick wins early. Everything in the backlog with an owner.
- **Milestones and cadence**: Milestone = snapshot. Review before launch, after big changes, at least yearly.
- **Tools that help**: WA Tool = questions. Trusted Advisor / Config / Security Hub = evidence between reviews.

