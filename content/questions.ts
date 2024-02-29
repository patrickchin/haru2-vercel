



type QuestionNames = "lifestyle" | "future" | "energy" | "outdoors" | "security" | "maintenance" | "special";

export const questions: {
    name: QuestionNames;
    title: string;
    hints: string[];
}[] = [
    {
        name: "lifestyle", title: "Lifestyle", hints: [
            "How many people will be living in the house?",
            "Are there any other specific lifestyle preferences or routines to consider?"
        ]
    },
    {
        name: "future", title: "Future Plans", hints: [
            "Are there any plans for future expansions or modifications to the house?",
            "Do you have any long-term considerations, such as aging in place?"
        ]
    },
    {
        name: "energy", title: "Energy Efficiency and Sustainability", hints: [
            "Are you interested in incorporating energy-efficient or sustainable design elements?",
            "Do you have any preferences for eco-friendly materials?"
        ]
    },
    {
        name: "outdoors", title: "Outdoor Spaces", hints: [
            "Do you have any preferences for outdoor spaces such as gardens, patios, or decks?",
            "Are there specific views or orientations you would like to take advantage of?"
        ]
    },
    {
        name: "security", title: "Privacy and Security", hints: [
            "How important is privacy to you?",
            "Are there specific security considerations we should address?"
        ]
    },
    {
        name: "maintenance", title: "Maintenance Preference", hints: [
            "Are there specific materials or finishes you prefer for ease of maintenance?",
            "What level of maintenance are you comfortable with for the long term?"
        ]
    },
    {
        name: "special", title: "Special Requirements", hints: [
            "Do you have any specific needs such as accessibility features or special accommodations?",
        ]
    },
];
