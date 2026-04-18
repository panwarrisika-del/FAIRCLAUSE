export const EMPLOYMENT_LAWS = [

    {

        id: "india_id_act_termination",

        jurisdiction: "India — Central",

        statute: "Industrial Disputes Act, 1947 — Section 25N + 25F",

        topic: "termination",

        summary: "Establishments with 100+ workers need prior govt permission for retrenchment. All retrenchments need 1 month written notice or pay in lieu. Retrenchment compensation = 15 days wages per completed year of service.",

        fullText: "Industrial Disputes Act 1947, Section 25F: No workman employed for 1+ year shall be retrenched unless: (a) given one month's notice in writing or wages in lieu; (b) paid retrenchment compensation equivalent to 15 days' average pay for every completed year of continuous service. Section 25N: Establishments with 100+ workers must obtain prior permission of appropriate government before retrenchment.",

        riskSignal: "termination OR notice period OR severance OR retrenchment",

        redFlag: "immediate termination with no notice; zero severance; termination at employer's sole discretion with no compensation",

        favorableForUser: "1-month notice required; 15 days per year retrenchment compensation",

        source: "https://www.indiacode.nic.in/handle/123456789/1471",

        tags: ["termination", "notice period", "severance", "retrenchment", "compensation", "employment"]

    },

    {

        id: "india_code_wages_2019",

        jurisdiction: "India — Central",

        statute: "Code on Wages, 2019",

        topic: "wages",

        summary: "Wages must be paid on or before 7th of following month (establishments <1000 workers). Covers all workers including contract and piece-rate. Deductions capped at 50% of wages. Requires written wage slip.",

        fullText: "Code on Wages 2019, Section 17: Wages shall be paid on — (a) a daily basis; (b) where paid weekly, before the expiry of 7th day of completion of week; (c) where paid monthly, before expiry of 7th day of following month for establishments with less than 1000 employees. Section 18: Deductions from wages shall not exceed 50 per cent of wages. Section 29: Employer must give wage slip.",

        riskSignal: "wages OR salary OR payment OR deduction",

        redFlag: "wages payable beyond 7th of month; deductions exceeding 50%; no wage slip; payment 'at employer's discretion'",

        favorableForUser: "7th-day payment deadline; 50% deduction cap; mandatory wage slip",

        source: "https://labour.gov.in/sites/default/files/TheCodeonWages2019.pdf",

        tags: ["wages", "salary", "payment", "deduction", "wage slip", "monthly payment"]

    },

    {

        id: "india_shops_establishments_act",

        jurisdiction: "India — State-specific (Karnataka, Maharashtra, Delhi etc.)",

        statute: "Shops and Establishments Acts (State-level)",

        topic: "working_hours",

        summary: "Working hours capped at 9 hours/day and 48 hours/week. Overtime must be paid at double the ordinary rate. Minimum 30-minute rest interval for 5+ hours of work. Weekly day off mandatory.",

        fullText: "Karnataka Shops and Commercial Establishments Act 1961, Section 7: No employee shall be required to work for more than 9 hours in any day and 48 hours in any week. Section 8: Every employee who works overtime shall be paid at twice the ordinary rate of wages. Section 10: Every employee shall be given one whole holiday per week.",

        riskSignal: "working hours OR overtime OR rest OR holiday",

        redFlag: "unlimited working hours; overtime not compensated; no weekly holiday guaranteed",

        favorableForUser: "9hr/day cap; double overtime pay; mandatory weekly holiday",

        source: "https://labour.karnataka.gov.in",

        tags: ["working hours", "overtime", "rest", "weekly holiday", "shops act"]

    },

    {

        id: "india_posh_act",

        jurisdiction: "India — Central",

        statute: "Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013",

        topic: "workplace_safety",

        summary: "Every employer with 10+ employees must have Internal Complaints Committee (ICC). Employer must display POSH policy. Failure to constitute ICC is punishable with fine up to Rs 50,000.",

        fullText: "POSH Act 2013, Section 4: Every employer of a workplace shall constitute an Internal Complaints Committee at each office or branch with 10 or more employees. Section 19: Employer shall display at any conspicuous place in the workplace the penal consequences of sexual harassment. Section 26: Non-compliance punishable with fine up to Rs 50,000.",

        riskSignal: "harassment OR complaints OR conduct",

        redFlag: "no POSH policy mentioned; no ICC constitution confirmed; waiver of harassment claims",

        favorableForUser: "mandatory ICC; employer liability for POSH compliance",

        source: "https://wcd.nic.in/sites/default/files/Sexual%20Harassment%20at%20Workplace%20Act.pdf",

        tags: ["posh", "harassment", "workplace safety", "icc", "women"]

    },

    {

        id: "india_maternity_benefit_act",

        jurisdiction: "India — Central",

        statute: "Maternity Benefit Act, 1961 (amended 2017)",

        topic: "maternity",

        summary: "26 weeks paid maternity leave for first 2 children. 12 weeks for 3rd child onwards. Cannot be dismissed during maternity leave. Creche facility mandatory for 50+ employees. Cannot reduce salary/benefits for maternity absence.",

        fullText: "Maternity Benefit Act 1961, Section 5: Every woman shall be entitled to maternity benefit of 26 weeks (for first two children). Section 12: Dismissal during maternity leave is prohibited. Section 11A: Creche facility must be provided where 50 or more employees work. Section 6: Employer cannot reduce remuneration during maternity leave.",

        riskSignal: "maternity OR leave OR pregnancy OR dismissal",

        redFlag: "maternity leave less than 26 weeks; dismissal during pregnancy; no creche; salary reduction during leave",

        favorableForUser: "26-week paid leave; dismissal prohibition; creche rights",

        source: "https://labour.gov.in/sites/default/files/MaternityBenefit_0.pdf",

        tags: ["maternity", "leave", "pregnancy", "creche", "dismissal", "women"]

    },

    {

        id: "india_epf_esi",

        jurisdiction: "India — Central",

        statute: "Employees' Provident Funds Act, 1952 + ESI Act, 1948",

        topic: "provident_fund",

        summary: "EPF mandatory for establishments with 20+ employees. 12% of basic salary contributed by employee + 12% by employer. ESI covers employees earning up to Rs 21,000/month — employer contributes 3.25%, employee 0.75%.",

        fullText: "EPF Act 1952, Section 6: The contribution shall be 12% of basic wages, dearness allowance and retaining allowance of the employee. Both employer and employee contribute 12%. ESI Act 1948, Section 40: Employer required to pay ESI contributions for all employees drawing wages up to Rs 21,000 per month.",

        riskSignal: "provident fund OR EPF OR ESI OR PF OR insurance",

        redFlag: "no EPF mention for eligible establishment; EPF deduction without employer contribution; opting out of ESI for eligible employees",

        favorableForUser: "employer must match 12% EPF; ESI medical coverage for eligible employees",

        source: "https://www.epfindia.gov.in",

        tags: ["epf", "pf", "provident fund", "esi", "insurance", "contribution"]

    },

    {

        id: "india_gratuity_act",

        jurisdiction: "India — Central",

        statute: "Payment of Gratuity Act, 1972",

        topic: "gratuity",

        summary: "Gratuity mandatory after 5 years continuous service. Formula: 15 days wages × years of service. Payable within 30 days of termination. Cannot be reduced by contract. Maximum Rs 20 lakh.",

        fullText: "Payment of Gratuity Act 1972, Section 4: Gratuity shall be payable to an employee on termination of employment after completion of five years of continuous service. Gratuity = 15/26 × last drawn wage × completed years of service. Section 7(3): Employer must pay within 30 days. Any contract reducing gratuity entitlement is void.",

        riskSignal: "gratuity OR long-term OR service benefits OR termination",

        redFlag: "gratuity waived by contract; no gratuity clause after 5 years; delayed payment beyond 30 days",

        favorableForUser: "non-waivable; 30-day payment requirement; formula fixed by law",

        source: "https://labour.gov.in/sites/default/files/PaymentofGratuityAct1972.pdf",

        tags: ["gratuity", "5 years", "service benefits", "termination payment"]

    },

    {

        id: "india_contract_labour_act",

        jurisdiction: "India — Central",

        statute: "Contract Labour (Regulation and Abolition) Act, 1970",

        topic: "contract_worker",

        summary: "Contractors must be registered. Principal employer liable for wages if contractor fails to pay. Contract workers entitled to same canteen, rest rooms, first aid as regular employees.",

        fullText: "Contract Labour Act 1970, Section 21: The contractor shall be responsible for payment of wages and other facilities. Where the contractor fails to pay wages, the principal employer shall be liable. Section 16-19: Canteen, rest rooms, and first-aid facilities must be provided by contractor or principal employer.",

        riskSignal: "contractor OR third party contractor OR outsourced",

        redFlag: "principal employer disclaiming all liability for contractor worker wages; no facilities for contract workers",

        favorableForUser: "principal employer backstops contractor wage defaults",

        source: "https://www.indiacode.nic.in/handle/123456789/1498",

        tags: ["contract labour", "contractor", "outsourced", "principal employer", "wages"]

    },

];
