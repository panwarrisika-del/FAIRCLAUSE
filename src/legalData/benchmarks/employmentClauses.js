export const EMPLOYMENT_BENCHMARKS = {

    notice_period: {

        topic: "Notice Period",

        marketStandard: "30–90 days depending on seniority. 90 days common for senior roles in Indian IT/consulting.",

        percentileData: {

            "30_days": 38,

            "60_days": 29,

            "90_days": 24,

            "above_90_days": 6,

            "immediate_without_pay": 1,

        }

    },

    non_compete: {

        topic: "Non-Compete Clause",

        marketStandard: "Indian courts largely void post-employment non-competes (Percept D'Mark v. Zaheer Khan). Only confidentiality and non-solicitation are enforceable post-employment.",

        percentileData: {

            "no_non_compete": 44,

            "6_month_non_compete": 21,

            "12_month_non_compete": 23,

            "24_month_plus_non_compete": 8,

            "geographic_restriction_india_only": 12,

            "void_under_indian_law": 100,

        }

    },

    moonlighting: {

        topic: "Moonlighting / Dual Employment",

        marketStandard: "Post-COVID, many Indian companies explicitly prohibit moonlighting. Some (Wipro) have terminated employees. Factories Act Section 60 prohibits dual employment for factory workers.",

        percentileData: {

            "explicit_prohibition": 67,

            "disclosure_required": 19,

            "allowed_with_approval": 9,

            "no_clause": 5,

        }

    },

    ip_assignment: {

        topic: "IP / Work Product Assignment",

        marketStandard: "Work done during employment on company time/resources belongs to employer. Personal projects on own time should be excluded.",

        percentileData: {

            "employment_time_only": 58,

            "all_inventions_during_tenure": 29,

            "includes_personal_projects": 8,

            "no_carve_out_for_personal_time": 11,

        }

    }

};
