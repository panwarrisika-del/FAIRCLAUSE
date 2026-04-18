export const GIG_LAWS = [

    {

        id: "india_rajasthan_platform_workers_act",

        jurisdiction: "India — Rajasthan",

        statute: "Rajasthan Platform Based Gig Workers (Registration and Welfare) Act, 2023",

        topic: "gig_worker_rights",

        summary: "India's first gig worker law. Platforms must register gig workers. Workers get social welfare benefits including accident insurance. Platforms cannot deactivate without due notice and explanation.",

        fullText: "Rajasthan Platform Based Gig Workers Act 2023, Section 6: Every aggregator shall register every gig worker on the platform. Section 14: Aggregator shall not terminate or suspend the contract of a gig worker without giving prior notice of 14 days and stating reasons in writing. Section 9: Workers entitled to social security benefits including medical, accident insurance.",

        riskSignal: "deactivation OR termination OR suspension OR account ban",

        redFlag: "platform deactivation without notice; no reason given for suspension; no appeal mechanism",

        favorableForUser: "14-day deactivation notice; written reasons required; welfare benefits",

        source: "https://labour.rajasthan.gov.in",

        tags: ["gig", "platform worker", "deactivation", "ola", "uber", "zomato", "swiggy", "rajasthan"]

    },

    {

        id: "india_code_social_security_gig",

        jurisdiction: "India — Central",

        statute: "Code on Social Security, 2020 — Chapter IX (Gig Workers)",

        topic: "gig_social_security",

        summary: "Defines 'gig workers' for the first time in Indian law. Central govt to establish social security fund for gig workers. Platforms must contribute 1-2% of turnover. Workers to receive life/disability insurance, health benefits.",

        fullText: "Code on Social Security 2020, Section 109: The Central Government shall frame schemes for gig workers and platform workers for benefit of life and disability cover, accident insurance, health and maternity benefits, old age protection. Section 114: Every aggregator shall contribute to the social security fund such amount not exceeding 2% of annual turnover as may be notified.",

        riskSignal: "social security OR insurance OR benefits OR welfare",

        redFlag: "no social security contribution by platform; worker bears all insurance costs; no accident coverage",

        favorableForUser: "platform-funded social security; accident and health coverage scheme",

        source: "https://labour.gov.in/sites/default/files/SS%20Code%202020.pdf",

        tags: ["gig", "social security", "platform", "insurance", "accident", "health benefit"]

    },

    {

        id: "india_gig_income_tax",

        jurisdiction: "India — Central",

        statute: "Income Tax Act, 1961 — Section 194C (TDS on Contractors)",

        topic: "tax",

        summary: "Platforms deducting TDS must issue Form 16A. TDS rate for gig/contractor: 1% (individuals). Platform must deposit TDS by 7th of following month. Worker can claim refund if total income below taxable limit.",

        fullText: "Income Tax Act 1961, Section 194C: TDS shall be deducted at 1% for payments to individual contractors or sub-contractors. Section 203: The person deducting tax shall furnish a certificate (Form 16A) specifying the amount deducted and paid to Central Government. Failure to issue Form 16A is an offence.",

        riskSignal: "TDS OR tax deduction OR income tax OR form 16",

        redFlag: "no TDS certificate promised; TDS deducted but Form 16A not given; incorrect TDS rate applied",

        favorableForUser: "right to Form 16A; ability to claim refund; 1% TDS rate for individuals",

        source: "https://incometaxindia.gov.in",

        tags: ["tds", "tax", "form 16a", "contractor", "income tax", "gig"]

    },

    {

        id: "india_gig_dispute_resolution",

        jurisdiction: "India — Central",

        statute: "Industrial Disputes Act, 1947 + Code on Industrial Relations, 2020",

        topic: "dispute_resolution",

        summary: "Gig workers can file complaints with Labour Commissioner. Code on Industrial Relations 2020 creates Grievance Redressal Committee for workers. Arbitration clauses in gig contracts cannot oust Indian court jurisdiction completely.",

        fullText: "Code on Industrial Relations 2020, Section 9: An industrial establishment shall have a Grievance Redressal Committee for resolution of disputes. Mandatory arbitration that completely ousts Indian court jurisdiction is void under Indian Contract Act read with CPC Section 28.",

        riskSignal: "dispute resolution OR arbitration OR complaints OR grievance",

        redFlag: "foreign jurisdiction arbitration; waiver of Indian court rights; no grievance mechanism; sole platform discretion on disputes",

        favorableForUser: "Indian courts cannot be completely ousted; Labour Commissioner complaints available",

        source: "https://labour.gov.in/sites/default/files/IR%20Code%202020.pdf",

        tags: ["arbitration", "dispute resolution", "grievance", "labour commissioner", "gig"]

    },

];
