window.EXPLAIN = {
"framework": [
 ["Sustainability was added as the sixth pillar in December 2021. The other five (Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization) are older.", ["Cost Optimization is one of the original five pillars.", "Reliability is one of the original five pillars.", null, "Operational Excellence is one of the original five pillars."]],
 ["A review is a conversation between the team and the framework's questions. It produces a list of risks and an improvement plan, not a pass/fail certificate.", ["There is no certificate; it is not a compliance audit.", null, "It does not attack your systems; that would be a penetration test.", "Billing reports come from Cost Explorer or the CUR."]],
 ["Trusted Advisor inspects your account automatically and flags cost, security, fault tolerance, performance and service-limit issues.", ["The WA Tool is a questionnaire you answer; it does not scan your account by itself.", null, "Artifact gives compliance reports such as SOC and ISO.", "Config records resource configuration and evaluates rules; it is not the cross-category advisor."]],
 ["\"Stop guessing your capacity needs\" is one of the general design principles that apply across the whole framework.", ["It is a general principle, not tied to the Security pillar.", null, "Pricing models are On-Demand, Savings Plans, Spot and so on.", "Support plans do not define design principles."]]
],
"scalability": [
 ["Adding more instances and spreading traffic across them is horizontal scaling (scaling out).", ["Vertical scaling means a bigger instance, not more instances.", null, "Right-sizing changes size to match usage; it does not add instances.", "Caching reduces load; it does not add capacity."]],
 ["Without local state, Auto Scaling can add or remove any instance and users don't lose sessions or data.", ["Stateless doesn't change the hourly price.", null, "Security groups are still required.", "Stateless servers can be EC2, containers or Lambda."]],
 ["A shared store like ElastiCache or DynamoDB keeps sessions available to every server, so servers stay stateless.", ["Instance store is lost when the instance stops and is local to one server.", null, "Snapshots are backups, not a live session store.", "Access logs record requests; they don't serve sessions."]],
 ["Vertical scaling hits the largest available instance, and one big server can still fail and take the app down.", ["Load balancers are needed for horizontal scaling, not vertical.", null, "Resizing needs no code change.", "Vertical scaling applies to any instance, not just containers."]]
],
"disposable": [
 ["A golden image is an AMI pre-baked with OS, patches, agents and the app, so new instances boot ready and identical.", ["Snapshot policies schedule backups; they don't define a server image.", null, "Launch logs don't configure anything.", "A baseline is a set of rules, not a bootable image."]],
 ["Immutable infrastructure never changes running servers: you launch a new fleet from a new image and retire the old one.", ["SSH-ing into each server is mutable, manual change that causes drift.", null, "Resizing doesn't deploy a new version.", "You can't edit the AMI of running instances; you create a new image."]],
 ["User data is a script EC2 runs on first boot to install or configure software.", [null, "An IAM role grants permissions; it doesn't run scripts.", "A security group is a firewall.", "An Elastic IP is a static public address."]],
 ["Disposable resources give consistent, reproducible servers you can replace quickly instead of repairing them.", ["Servers still fail; you just replace them easily.", null, "Monitoring is still essential.", "Compute is still billed."]]
],
"automation": [
 ["EventBridge matches events from AWS services, SaaS and your apps, and runs cron or rate schedules, then calls targets like Lambda.", [null, "Inspector scans for vulnerabilities.", "Artifact provides compliance documents.", "Macie discovers sensitive data in S3."]],
 ["Patch Manager, part of Systems Manager, applies patches to fleets on a schedule using patch baselines and maintenance windows.", ["Config records and evaluates configuration; it doesn't install patches.", null, "GuardDuty detects threats.", "Shield protects against DDoS."]],
 ["CloudWatch alarms can trigger Auto Scaling policies, EC2 actions (recover, reboot, stop) and SNS notifications.", ["Alarms don't change your code.", null, "Accounts are created with Organizations, not alarms.", "Support plans are changed in the console."]],
 ["Elastic Beanstalk provisions and manages capacity, load balancing, scaling, deployment and health monitoring for your app.", [null, "Glacier is archival storage.", "Snowball moves data physically.", "Route 53 is DNS."]]
],
"loose-coupling": [
 ["SQS keeps messages durably until workers pull and delete them, so spikes are buffered and nothing is lost.", ["SNS pushes to subscribers immediately and doesn't hold a backlog for slow workers.", null, "CloudFront is a CDN.", "Direct Connect is a private network link."]],
 ["Publish/subscribe (SNS, or EventBridge rules) delivers one event to many independent subscribers.", ["A queue gives each message to one consumer.", null, "A bigger instance doesn't distribute events.", "Route 53 failover is DNS routing."]],
 ["Loose coupling isolates failures and lets each component scale and change independently.", [null, "Encryption is a security control, unrelated to coupling.", "Billing isn't affected by coupling.", "DNS resolution is unrelated."]],
 ["A dead-letter queue receives messages that failed processing several times, so they can be inspected without blocking the main queue.", [null, "Snapshots back up volumes.", "Placement groups control instance placement.", "NAT gateways give private subnets outbound internet."]]
],
"services-databases": [
 ["DynamoDB serves key-value lookups at single-digit-millisecond latency at virtually any scale, ideal for carts and sessions.", ["Redshift is for analytics, not low-latency lookups.", null, "Glacier is archival storage with retrieval delays.", "Neptune is for graph relationships."]],
 ["Redshift is a columnar data warehouse built for complex analytical SQL over very large datasets.", [null, "ElastiCache is an in-memory cache.", "SQS is a message queue.", "Lambda runs code; it isn't a warehouse."]],
 ["Read replicas take read traffic off the primary, improving read performance.", [null, "Encryption is a storage setting, not what replicas are for.", "Automatic failover is Multi-AZ's job.", "Backup retention is configured separately."]],
 ["Prefer managed and serverless services where they fit, so AWS handles the undifferentiated heavy lifting.", ["EC2 is still the right choice for many workloads.", null, "Running databases yourself is the opposite advice.", "Dedicated hosts are for licensing and compliance needs."]]
],
"data-spof": [
 ["Intelligent-Tiering monitors access and moves objects between tiers automatically, with no retrieval fees for those moves.", ["Standard is a single tier.", null, "Deep Archive is the coldest tier; it doesn't move objects for you.", "Transfer Acceleration speeds uploads."]],
 ["Multi-AZ keeps a synchronous standby in another AZ and fails over automatically.", ["Read capacity comes from read replicas.", null, "It increases cost, not lowers it.", "Global latency is improved with CloudFront or replicas in other Regions."]],
 ["One instance in one AZ means a single instance or AZ failure takes the app down: a single point of failure.", ["Elastic means it scales with demand; this can't.", null, "Nothing isolates faults here.", "EC2 instances are not serverless."]],
 ["Route 53 health checks plus failover routing send users to a healthy secondary endpoint or Region.", [null, "Inspector scans for vulnerabilities.", "Budgets tracks spend.", "Macie finds sensitive data."]]
],
"cost-cache-security": [
 ["Spot uses spare capacity at up to 90% off and suits interruption-tolerant batch work.", ["On-Demand is the most expensive option.", null, "Dedicated Hosts are for licensing and compliance and cost more.", "A 3-year commitment is for steady use, not interruptible batch."]],
 ["A commitment (Savings Plans or Reserved Instances) gives big discounts for predictable, always-on usage.", ["Spot can be interrupted, which is wrong for a steady web app.", null, "On-Demand works but costs the most for steady use.", "The Free Tier is limited and temporary."]],
 ["CloudFront is AWS's CDN; it caches content at edge locations near users worldwide.", ["ElastiCache caches application data inside your VPC, not at the edge.", null, "Global Accelerator optimizes network paths but doesn't cache content.", "EBS is block storage for instances."]],
 ["Several independent layers of controls is defense in depth.", [null, "Vertical scaling is about instance size.", "Loose coupling is about component dependencies.", "Right-sizing is about cost and capacity."]]
],
"cloud-practices": [
 ["Testing at production scale is a general design principle, because the cloud lets you create and delete full-size environments.", ["The framework says stop guessing capacity.", null, "The framework encourages automation.", "Architectures should evolve, not freeze."]],
 ["AWS Fault Injection Service runs controlled chaos experiments such as stopping instances, with stop conditions.", [null, "Inspector scans for vulnerabilities.", "Artifact provides compliance reports.", "Budgets tracks spend."]],
 ["A game day simulates failures so the team practices detection and recovery.", ["It's not a sales event.", null, "It's not related to the Free Tier.", "It's not a billing period."]],
 ["Evolutionary architecture means designs change over time as requirements and services change.", [null, "Newest isn't always best; evolve where it helps.", "Reusing templates is encouraged.", "Big-bang migrations are risky; evolve incrementally."]]
],
"pillar-ops": [
 ["Performing operations as code (IaC, pipelines, runbooks) is central to Operational Excellence.", ["Security has its own principles such as least privilege.", null, "Cost focuses on spend.", "Performance focuses on resource efficiency."]],
 ["Frequent, small, reversible changes reduce risk and make rollback easy.", [null, "Spot for databases is a cost anti-pattern.", "Going global is a Performance principle.", "A consumption model is a Cost principle."]],
 ["Systems Manager provides runbooks (Automation), patching, Run Command and OpsCenter.", [null, "Macie finds sensitive data.", "Shield protects against DDoS.", "Athena queries data in S3."]],
 ["The four areas are Organization, Prepare, Operate and Evolve.", ["Encryption belongs to Security.", null, "Expanding isn't an area.", "Estimating costs is a Cost activity."]]
],
"pillar-security": [
 ["Keeping people away from data reduces manual access and human error.", [null, "Stop guessing capacity is a general and Reliability principle.", "Going global is a Performance principle.", "Measuring efficiency is a Cost principle."]],
 ["Least privilege means granting only what a task needs.", [null, "Elasticity is about capacity.", "Right-sizing is about cost.", "Mechanical sympathy is a Performance idea."]],
 ["CloudTrail records API calls, Config records changes, CloudWatch monitors and alerts: together they give traceability.", [null, "Spot is a pricing option.", "CloudFront is a CDN.", "Elastic Beanstalk is an app platform."]],
 ["SSE-KMS encrypts objects at rest in S3.", [null, "In transit means TLS on the network.", "Incident response is how you react to events.", "Network performance is unrelated."]]
],
"pillar-reliability": [
 ["Warm standby runs a scaled-down but functional copy that can take traffic and scale up on failover.", ["Backup and restore keeps only backups.", "Pilot light keeps data live but core servers off or minimal.", null, "Cold storage isn't a DR strategy name."]],
 ["RPO is the maximum acceptable data loss, measured in time.", ["Downtime is RTO.", null, "AZ count isn't an objective.", "Cost is a separate consideration."]],
 ["Automatically recovering from failure is a Reliability design principle.", [null, "Democratizing technologies is a Performance principle.", "Attributing expenditure is a Cost principle.", "Keeping people away from data is a Security principle."]],
 ["Multi-site active/active runs full capacity in two Regions for near-zero RTO and RPO.", ["Pilot light needs time to start servers.", null, "Backup and restore takes hours.", "Warm standby must scale up first."]]
],
"pillar-performance": [
 ["Going global in minutes is a Performance Efficiency principle: deploy close to users for lower latency.", [null, "Security principles cover identity and protection.", "Cost principles cover spend.", "Ops principles cover running and improving."]],
 ["Consuming complex technology as a service is \"democratize advanced technologies\".", [null, "That is a Security principle.", "That is a Cost principle.", "That is a Reliability principle."]],
 ["Choosing a technology that matches how data is accessed is mechanical sympathy.", [null, "Right-sizing is about capacity and cost.", "Defense in depth is about security layers.", "Backups are about recovery."]],
 ["CloudFront caches images at edge locations near users, cutting latency.", [null, "A bigger database doesn't fix network distance.", "Backups don't affect delivery speed.", "Macie scans for sensitive data."]]
],
"pillar-cost": [
 ["The Pricing Calculator estimates costs of a planned architecture before you deploy it.", [null, "Cost Explorer analyzes spend that already happened.", "Budgets alerts on spend; it doesn't estimate designs.", "Artifact provides compliance reports."]],
 ["Cost allocation tags attribute spend to projects, teams or environments.", [null, "Security groups are firewalls.", "Read replicas scale reads.", "CloudFront is a CDN."]],
 ["Adopting a consumption model (pay only for what you use) is a Cost Optimization principle.", [null, "That is a Security principle.", "That is an Operational Excellence principle.", "That is a Performance principle."]],
 ["AWS Budgets sends alerts when actual or forecast spend crosses a threshold.", [null, "Shield is DDoS protection.", "Inspector scans for vulnerabilities.", "CloudTrail logs API calls."]]
],
"pillar-sustainability": [
 ["Sustainability is the pillar about energy use and environmental impact.", [null, "Cost is about money, though savings often overlap.", "Reliability is about recovery.", "Performance is about efficiency of resources for speed."]],
 ["Maximizing utilization is a Sustainability principle: idle capacity still consumes energy.", [null, "That is a Reliability principle.", "That is a Security principle.", "That is a Performance principle."]],
 ["Graviton (Arm) instances deliver better performance per watt.", [null, "Older generations are less efficient.", "Dedicated Hosts are for licensing, not efficiency.", "Bare metal is not inherently more efficient."]],
 ["The Customer Carbon Footprint Tool in the Billing console estimates emissions from your usage.", [null, "Artifact provides compliance reports.", "Inspector scans for vulnerabilities.", "Shield protects against DDoS."]]
],
"wa-review": [
 ["High risk issues carry the biggest business risk, so they are fixed first.", ["Medium risks come after HRIs.", null, "Unanswered questions should be answered, but HRIs are the priority.", "Price doesn't set priority; risk and impact do."]],
 ["A milestone is a saved snapshot of the review, used to compare progress over time.", ["A lens adds questions.", null, "A stack is CloudFormation.", "A conformance pack is a Config feature."]],
 ["Lenses add domain-specific questions on top of the framework, such as Serverless, SaaS or Generative AI.", [null, "Lenses don't encrypt anything.", "Reviews aren't billed per lens.", "Lenses extend the pillars; they don't replace them."]],
 ["The AWS Well-Architected Tool is available at no extra charge; you pay only for your AWS resources.", [null, "There is no per-review fee.", "No support plan is required.", "There is no per-question pricing."]]
]
};

/* merge into the lessons (loaded after lessons, before app.js) */
(function (E) { (window.LESSONS || []).forEach(l => { const x = E[l.id]; if (!x || !l.quiz) return; x.forEach((e, i) => { const q = l.quiz[i]; if (!q || !e) return; if (e[0]) q.why = e[0]; if (e[1]) q.w = e[1]; }); }); })(window.EXPLAIN || {});
