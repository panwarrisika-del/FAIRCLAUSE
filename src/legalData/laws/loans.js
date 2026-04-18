export const LOAN_LAWS = [

    {

        id: "india_rbi_fair_practices_code",

        jurisdiction: "India — Central",

        statute: "RBI Fair Practices Code for NBFCs + Banks (Master Circular 2015)",

        topic: "loan_disclosure",

        summary: "Lenders must disclose annualised interest rate, all fees, and repayment schedule before sanction. Pre-payment penalty cannot exceed 2% for floating rate loans (nil for individual borrowers per RBI 2014). Loan sanction letter must list all charges.",

        fullText: "RBI Master Circular on Fair Practices Code 2015: Para 2(i): The lender shall convey in writing to the borrower in the vernacular language by means of sanction letter or otherwise, the amount of loan sanctioned along with terms and conditions including annualised rate of interest and method of application. Para 3(vii): No pre-payment penalties on floating rate loans for individual borrowers.",

        riskSignal: "interest rate OR prepayment OR processing fee OR loan charges",

        redFlag: "annualised interest rate not disclosed; prepayment penalty on floating rate loan; charges not itemised in sanction letter",

        favorableForUser: "annualised rate must be disclosed; zero prepayment penalty on floating rate individual loans",

        source: "https://www.rbi.org.in/Scripts/BS_CircularIndexDisplay.aspx",

        tags: ["loan", "rbi", "interest rate", "prepayment", "processing fee", "fair practices", "nbfc"]

    },

    {

        id: "india_rbi_digital_lending",

        jurisdiction: "India — Central",

        statute: "RBI Digital Lending Guidelines, 2022",

        topic: "digital_loan",

        summary: "Digital lenders must disburse loan directly to bank account — no third party pass-through. Full KFS (Key Fact Statement) mandatory before signing. Automatic increase in credit limit without consent is banned. Cooling-off period of 3 days for personal digital loans.",

        fullText: "RBI Digital Lending Guidelines 2022: Para 4: Loan disbursal and repayment shall be executed only between the regulated entity and the borrower. Para 6: A Key Fact Statement (KFS) shall be provided to borrower before sanction. Para 8: No automatic increase in credit limit without explicit consent. Para 9: Cooling off/look-up period to be provided to borrowers for digital loans.",

        riskSignal: "digital loan OR app loan OR credit limit OR auto-debit",

        redFlag: "auto-debit access to full account; no KFS provided; third party receives loan amount; auto credit limit increase",

        favorableForUser: "KFS mandatory; 3-day cooling off; no third-party disbursement; consent required for limit increase",

        source: "https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12382",

        tags: ["digital lending", "app loan", "kfs", "cooling off", "auto debit", "credit limit"]

    },

    {

        id: "india_sarfaesi_act",

        jurisdiction: "India — Central",

        statute: "SARFAESI Act, 2002 — Section 13",

        topic: "secured_loan_default",

        summary: "For secured loans, lender can take possession of asset only after 60-day demand notice and non-payment. Borrower has right to file objection within 15 days. Personal property cannot be seized without due process.",

        fullText: "SARFAESI Act 2002, Section 13(2): Where any borrower, who is under a liability to a secured creditor, makes any default in repayment, the secured creditor may require the borrower by notice in writing to discharge in full his liabilities within sixty days. Section 13(3A): If the borrower makes objections, the secured creditor must communicate the reasons for non-acceptance of the objection.",

        riskSignal: "default OR collateral OR seizure OR possession",

        redFlag: "immediate seizure on default without 60-day notice; no objection mechanism; waiver of SARFAESI protections",

        favorableForUser: "60-day cure period; right to object; reasons must be communicated",

        source: "https://www.indiacode.nic.in/handle/123456789/2046",

        tags: ["loan default", "sarfaesi", "seizure", "collateral", "secured loan", "60 days notice"]

    },

    {

        id: "india_rbi_recovery_guidelines",

        jurisdiction: "India — Central",

        statute: "RBI Guidelines on Recovery Agents, 2008",

        topic: "loan_recovery",

        summary: "Recovery agents cannot call before 7am or after 7pm. Cannot threaten, use abusive language, or visit family members. Borrower can request bank not to use recovery agents. Harassment in recovery is prosecutable under IPC.",

        fullText: "RBI Guidelines on Recovery Agents 2008: Agents shall not resort to intimidation or harassment of any person in the process of recovery. Recovery calls shall be made only between 7am-7pm. Agents shall not make threatening or anonymous calls or calls to family members who are not co-borrowers.",

        riskSignal: "recovery OR collection OR default OR repayment",

        redFlag: "no restriction on recovery contact timing; family member contact permitted; waiver of harassment protections",

        favorableForUser: "7am-7pm restriction; no harassment; family members protected",

        source: "https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=4661",

        tags: ["recovery", "collection", "harassment", "recovery agent", "loan default"]

    },

];
