export const GENERAL_LAWS = [

    {

        id: "india_contract_act_unconscionable",

        jurisdiction: "India — Central",

        statute: "Indian Contract Act, 1872 — Sections 16, 19A",

        topic: "unconscionability",

        summary: "Contracts entered under undue influence are voidable. 'Unconscionable bargain' doctrine: court can set aside contracts where one party was mentally distressed, ignorant, or in a weak position and the other obtained an unfair advantage.",

        fullText: "Indian Contract Act 1872, Section 16: A contract is said to be induced by 'undue influence' where the relations subsisting between the parties are such that one of the parties is in a position to dominate the will of the other. Section 19A: When consent to an agreement is caused by undue influence, the agreement is a contract voidable at the option of the party whose consent was so caused.",

        riskSignal: "any extremely one-sided clause",

        redFlag: "standard form contracts with oppressive terms and no opportunity to negotiate",

        favorableForUser: "courts can void contracts obtained through undue influence",

        source: "https://www.indiacode.nic.in/handle/123456789/2187",

        tags: ["undue influence", "unconscionable", "voidable", "contract act", "consumer protection"]

    },

    {

        id: "india_consumer_protection_act_2019",

        jurisdiction: "India — Central",

        statute: "Consumer Protection Act, 2019 — Section 2(46) + Section 49",

        topic: "unfair_contract",

        summary: "Defines 'unfair contract' — clauses causing significant imbalance in rights. Consumer commissions can declare any such term null and void. Covers unilateral modification rights, excessive penalties, unilateral termination, no dispute mechanism.",

        fullText: "Consumer Protection Act 2019, Section 2(46): 'Unfair contract' includes contracts with: unilateral changes without notice; charges without adequate consideration; penalty for breach disproportionate to harm; terms depriving consumer of legal rights; terms imposing unreasonable obligations. Section 49: State Consumer Commission may declare any term of a contract which is unfair as null and void.",

        riskSignal: "penalty OR unilateral OR termination OR modification",

        redFlag: "unilateral modification rights; disproportionate penalties; no dispute mechanism; waiver of consumer rights",

        favorableForUser: "consumer commissions can void any unfair term; complaints to NCDRC available",

        source: "https://consumeraffairs.nic.in/acts-and-rules/consumer-protection-act-2019",

        tags: ["consumer protection", "unfair contract", "unfair terms", "penalty", "unilateral"]

    },

    {

        id: "india_it_act_data_privacy",

        jurisdiction: "India — Central",

        statute: "IT Act 2000 (Section 43A) + DPDP Act, 2023",

        topic: "data_privacy",

        summary: "Digital Personal Data Protection Act 2023: user consent must be free, specific, informed, unconditional. Consent can be withdrawn any time. Data cannot be used beyond stated purpose. Data fiduciaries must notify of breach within 72 hours.",

        fullText: "DPDP Act 2023, Section 6: Consent of the data principal shall be free, specific, informed, unconditional and unambiguous. Section 6(4): Consent can be withdrawn at any time. Section 9: Data shall be used only for the purpose for which consent was given. Section 8(6): Data fiduciary must notify Data Protection Board and data principal within 72 hours of breach.",

        riskSignal: "data OR privacy OR personal information OR consent",

        redFlag: "blanket consent for unspecified data uses; no consent withdrawal mechanism; data shared with third parties without specific consent; no breach notification commitment",

        favorableForUser: "withdrawable consent; purpose limitation; 72-hour breach notice",

        source: "https://meity.gov.in/data-protection-framework",

        tags: ["data", "privacy", "consent", "dpdp", "personal data", "breach notification"]

    },

    {

        id: "india_arbitration_conciliation_act",

        jurisdiction: "India — Central",

        statute: "Arbitration and Conciliation Act, 1996 — Section 8 + Section 34",

        topic: "arbitration",

        summary: "Arbitration agreements enforceable in India. However, arbitration cannot completely oust Indian court jurisdiction for consumer disputes under Consumer Protection Act. Awards can be challenged in court on grounds of public policy. Consumer forum jurisdiction preserved for consumer disputes.",

        fullText: "Arbitration and Conciliation Act 1996, Section 34: An arbitral award may be set aside if it is in conflict with the public policy of India. Consumer Protection Act overrides: Consumer fora retain jurisdiction even where arbitration clause exists, as per Supreme Court in M/s Emaar MGF Land Ltd v. Aftab Singh (2019).",

        riskSignal: "arbitration OR dispute resolution OR legal proceedings",

        redFlag: "mandatory arbitration ousting consumer forum rights; foreign seat of arbitration for consumer contracts; sole arbitrator appointed by company",

        favorableForUser: "consumer forum jurisdiction preserved; awards challengeable on public policy grounds",

        source: "https://www.indiacode.nic.in/handle/123456789/1494",

        tags: ["arbitration", "dispute resolution", "consumer forum", "court", "legal proceedings"]

    },

    {

        id: "india_specific_relief_act",

        jurisdiction: "India — Central",

        statute: "Specific Relief Act, 1963 (amended 2018)",

        topic: "contract_enforcement",

        summary: "Courts can order specific performance of contracts involving unique assets (property, rare goods). Injunctions available to prevent breach. 2018 amendment: courts must normally grant specific performance — discretion reduced.",

        fullText: "Specific Relief Act 1963, Section 10 (as amended 2018): Specific performance of a contract shall be enforced by the court subject to the provisions contained in sub-section (2). The court shall not refuse specific performance of a contract on the grounds that the party in breach is willing to substitute money for performance.",

        riskSignal: "contract performance OR obligations OR delivery",

        redFlag: "only money damages available; no specific performance right; unlimited liability cap waivers",

        favorableForUser: "specific performance available for property contracts; injunctions available",

        source: "https://www.indiacode.nic.in/handle/123456789/2319",

        tags: ["specific performance", "contract enforcement", "injunction", "breach"]

    },

];


