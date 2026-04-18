export const RENTAL_LAWS = [

    {

        id: "india_model_tenancy_act_2021",

        jurisdiction: "India — Central",

        statute: "Model Tenancy Act, 2021",

        topic: "tenancy_general",

        summary: "Central framework for renting. Security deposit capped at 2 months rent for residential. Rent can only be revised per agreement with 3 months written notice. Eviction only via Rent Court — no self-help eviction.",

        fullText: "Model Tenancy Act 2021: Section 11 — Landlord shall give three months' prior notice in writing before revising rent. Section 13 — Security deposit shall not exceed two months' rent for residential premises. Section 14 — Landlord shall not cut off essential services (electricity, water). Section 33 — Eviction only via Rent Court order; no forcible eviction permitted.",

        riskSignal: "rent increase OR security deposit OR eviction OR notice",

        redFlag: "security deposit exceeding 2 months rent; immediate rent hike; self-help eviction language; cutting utilities",

        favorableForUser: "3-month notice for rent hike; 2-month deposit cap; Rent Court for disputes",

        source: "https://mohua.gov.in/upload/uploadfiles/files/MTA_2021.pdf",

        tags: ["rent", "tenancy", "deposit", "eviction", "india", "residential", "security deposit", "notice period"]

    },

    {

        id: "india_delhi_rent_control_act",

        jurisdiction: "India — Delhi",

        statute: "Delhi Rent Control Act, 1958 (amended 2021)",

        topic: "rent_control",

        summary: "Governs rent in Delhi for premises below Rs 3,500/month. Landlord cannot increase rent without tribunal order. Wrongful eviction is a criminal offence.",

        fullText: "Delhi Rent Control Act, 1958, Section 6: No landlord shall without the order of the Controller increase the rent of any premises. Section 14: Landlord can evict only on specified grounds including non-payment of rent, subletting without permission, or misuse of premises. Section 28: Wrongful eviction is punishable with imprisonment.",

        riskSignal: "rent increase OR eviction OR notice to vacate",

        redFlag: "unilateral rent increases; eviction without Rent Controller order",

        favorableForUser: "strong tenant protection; eviction only via Controller",

        source: "http://delhigovt.nic.in/wps/wcm/connect/doit_revenue/Revenue/Home/Rent+Control",

        tags: ["delhi", "rent control", "eviction", "rent increase"]

    },

    {

        id: "india_maharashtra_rent_control",

        jurisdiction: "India — Maharashtra",

        statute: "Maharashtra Rent Control Act, 1999",

        topic: "rent_control",

        summary: "Governs rent in Maharashtra. Landlord must give minimum 30 days notice to vacate. Tenants have right to receive rent receipt for every payment. Security deposit interest payable by landlord.",

        fullText: "Maharashtra Rent Control Act 1999, Section 16: No order for recovery of possession shall be made by court unless specific statutory grounds exist. Section 8: Landlord must give receipt for rent paid on demand. Section 54: Security deposit must be refunded within 30 days of vacation failing which interest is payable.",

        riskSignal: "notice to vacate OR security deposit OR receipt",

        redFlag: "no receipt for deposit; no refund timeline for deposit; notice less than 30 days",

        favorableForUser: "statutory eviction grounds only; receipt required; deposit refund within 30 days",

        source: "https://maharashtra.gov.in",

        tags: ["maharashtra", "mumbai", "pune", "rent", "deposit refund", "receipt"]

    },

    {

        id: "india_karnataka_rent_control",

        jurisdiction: "India — Karnataka",

        statute: "Karnataka Rent Act, 2001",

        topic: "rent_control",

        summary: "Applies to Bangalore and all Karnataka urban areas. Tenancy disputes resolved by Rent Controller. Landlord must deposit advance rent received with Controller if disputed.",

        fullText: "Karnataka Rent Act 2001, Section 21: Tenant not to be evicted except on specific grounds. Section 4: Rent Controller has jurisdiction over all disputes. Advance rent and deposits exceeding 10 months rent must be reported.",

        riskSignal: "deposit OR advance rent OR eviction",

        redFlag: "advance rent exceeding 10 months; no Rent Controller jurisdiction mentioned; arbitrary eviction clauses",

        favorableForUser: "Rent Controller oversight; eviction only on statutory grounds",

        source: "https://karunaveerabhadra.karnataka.gov.in",

        tags: ["karnataka", "bangalore", "bengaluru", "rent", "advance", "eviction"]

    },

    {

        id: "india_transfer_property_act_lease",

        jurisdiction: "India — Central",

        statute: "Transfer of Property Act, 1882 — Section 108",

        topic: "lease_rights",

        summary: "Governs all leases. Lessee has right to quiet enjoyment. Lessor must disclose material defects in property. Lessee may terminate if property becomes unfit for use.",

        fullText: "Transfer of Property Act, 1882, Section 108: The lessor is bound to disclose any defect in the property which materially interferes with its enjoyment and which the lessee could not with ordinary care discover. The lessee may, if the lessor neglects to make repairs which he is bound to make, make such repairs himself and deduct the cost from the rent.",

        riskSignal: "repairs OR maintenance OR defect OR habitability",

        redFlag: "tenant bears all repair costs; no landlord maintenance obligation; waiver of quiet enjoyment",

        favorableForUser: "repair-and-deduct right; lessor must disclose defects; quiet enjoyment guaranteed",

        source: "https://www.indiacode.nic.in/handle/123456789/2338",

        tags: ["lease", "repair", "maintenance", "defect", "quiet enjoyment", "transfer of property act"]

    },

    {

        id: "india_registration_act_lease",

        jurisdiction: "India — Central",

        statute: "Registration Act, 1908 — Section 17 + Stamp Act",

        topic: "registration",

        summary: "Leases exceeding 11 months MUST be registered. Unregistered leases exceeding 11 months are void and cannot be used as evidence in court. Proper stamp duty must be paid.",

        fullText: "Registration Act 1908, Section 17(1)(d): Leases of immovable property from year to year, or for any term exceeding one year, or reserving a yearly rent, shall be registered. An unregistered document required to be registered cannot be received as evidence.",

        riskSignal: "lease term OR agreement duration",

        redFlag: "lease exceeding 11 months without registration clause; landlord avoiding registration to deny tenant rights",

        favorableForUser: "registered lease is legally enforceable; tenant can insist on registration",

        source: "https://www.indiacode.nic.in/handle/123456789/2355",

        tags: ["registration", "stamp duty", "11 months", "lease registration", "unregistered"]

    },

];

