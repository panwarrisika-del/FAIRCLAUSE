export const GIG_BENCHMARKS = {

    deactivation: {

        topic: "Account Deactivation / Termination",

        marketStandard: "Rajasthan law requires 14-day notice. Industry practice varies wildly — Swiggy/Zomato have internal policies but most give no prior notice.",

        percentileData: {

            "14_day_notice": 12,

            "7_day_notice": 18,

            "immediate_deactivation_no_notice": 54,

            "appeal_mechanism_provided": 21,

            "no_reason_required": 61,

        }

    },

    payment_timeline: {

        topic: "Payment / Settlement Timeline",

        marketStandard: "Weekly settlements are common for delivery/transport platforms. Longer hold periods are unusual.",

        percentileData: {

            "daily_payment": 14,

            "weekly_payment": 48,

            "fortnightly_payment": 22,

            "monthly_payment": 12,

            "platform_sole_discretion_on_deductions": 39,

        }

    },

    surge_cancellation: {

        topic: "Cancellation / Surge Policy",

        marketStandard: "Cancellation rates and surge policies should be disclosed. Arbitrary cancellation penalties are unusual.",

        percentileData: {

            "cancellation_rate_disclosed": 41,

            "surge_methodology_disclosed": 28,

            "platform_can_change_rates_anytime": 72,

            "no_advance_notice_for_rate_change": 68,

        }

    }

};
