export const RENTAL_BENCHMARKS = {

    security_deposit: {

        topic: "Security Deposit",

        marketStandard: "2–3 months rent in most Indian cities; Bangalore often 5–10 months (market practice exceeds MTA 2021 cap)",

        legalPosition: "Model Tenancy Act 2021 caps at 2 months. Karnataka market practice often higher but legally contestable.",

        percentileData: {

            "2_months_deposit": 28,

            "3_months_deposit": 31,

            "5_months_deposit": 22,

            "10_months_deposit": 11,

            "returned_with_interest": 8,

            "no_return_timeline_specified": 41,

            "landlord_sole_discretion_deductions": 19,

        }

    },

    notice_period: {

        topic: "Notice to Vacate",

        marketStandard: "1–2 months notice standard across India",

        percentileData: {

            "1_month_notice": 53,

            "2_months_notice": 31,

            "less_than_1_month": 9,

            "no_notice_required": 2,

            "immediate_vacate_clause": 1,

        }

    },

    late_payment: {

        topic: "Late Payment Penalty",

        marketStandard: "Rs 100–500 flat or 1–2% of monthly rent",

        percentileData: {

            "flat_fee_under_500": 48,

            "1_percent_per_month": 22,

            "2_percent_per_month": 14,

            "above_2_percent": 7,

            "compounding_daily_penalty": 3,

        }

    },

    maintenance: {

        topic: "Maintenance Responsibility",

        marketStandard: "Minor maintenance (< Rs 2000–5000) by tenant; structural and major repairs by landlord",

        percentileData: {

            "landlord_structural_tenant_minor": 61,

            "all_maintenance_by_tenant": 18,

            "all_maintenance_by_landlord": 9,

            "no_maintenance_clause": 12,

        }

    }

};
