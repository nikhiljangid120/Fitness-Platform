export const FITNESS_IMAGES = {
    // Action/Exercise specific
    squat: "https://images.unsplash.com/photo-1574680096141-1cddd32e0340?q=80&w=2069&auto=format&fit=crop",
    pushup: "https://images.unsplash.com/photo-1598971639067-5a6b1c97c934?q=80&w=2070&auto=format&fit=crop",
    plank: "https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?q=80&w=2016&auto=format&fit=crop",
    lunge: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=2070&auto=format&fit=crop",
    burpee: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop",
    run: "https://images.unsplash.com/photo-1552674605-46d536d0d6fb?q=80&w=2070&auto=format&fit=crop",
    yoga: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2020&auto=format&fit=crop",
    stretch: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?q=80&w=2026&auto=format&fit=crop",
    weights: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop",
    hiit: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=2025&auto=format&fit=crop",

    // Nutrition
    meal: "https://images.unsplash.com/photo-1543353071-873f17a7a088?q=80&w=2070&auto=format&fit=crop",
    breakfast: "https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=2070&auto=format&fit=crop",
    lunch: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop",
    dinner: "https://images.unsplash.com/photo-1467003909585-2f8a7270028d?q=80&w=1868&auto=format&fit=crop",
    snack: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=2070&auto=format&fit=crop",

    // Generic
    gym: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
    default: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop"
};

export function getImageForKeyword(keyword: string): string {
    const normalize = keyword.toLowerCase();

    // Specific Exercises
    if (normalize.includes("squat")) return "https://images.unsplash.com/photo-1574680096141-1cddd32e0340?q=80&w=2069&auto=format&fit=crop";
    if (normalize.includes("lunge")) return "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=2070&auto=format&fit=crop";
    if (normalize.includes("plank")) return "https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?q=80&w=2016&auto=format&fit=crop";
    if (normalize.includes("pushup") || normalize.includes("push-up")) return "https://images.unsplash.com/photo-1598971639067-5a6b1c97c934?q=80&w=2070&auto=format&fit=crop";
    if (normalize.includes("burpee")) return "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop";

    // Muscle Groups (Upper)
    if (normalize.includes("chest") || normalize.includes("bench")) return "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop";
    if (normalize.includes("back") || normalize.includes("pull") || normalize.includes("row")) return "https://images.unsplash.com/photo-1603287681836-e566914d72e2?q=80&w=2070&auto=format&fit=crop";
    if (normalize.includes("shoulder") || normalize.includes("press")) return "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop";
    if (normalize.includes("arm") || normalize.includes("bicep") || normalize.includes("tricep")) return "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop";

    // Muscle Groups (Lower)
    if (normalize.includes("leg")) return "https://images.unsplash.com/photo-1434608519344-49d77a699ded?q=80&w=2074&auto=format&fit=crop";
    if (normalize.includes("glute")) return "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop";

    // Cardio / HIIT
    if (normalize.includes("hiit") || normalize.includes("tabata")) return "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=2025&auto=format&fit=crop";
    if (normalize.includes("run") || normalize.includes("jog") || normalize.includes("cardio")) return "https://images.unsplash.com/photo-1552674605-46d536d0d6fb?q=80&w=2070&auto=format&fit=crop";
    if (normalize.includes("jump") || normalize.includes("rope")) return "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop";

    // Styles
    if (normalize.includes("yoga") || normalize.includes("pilates")) return "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2020&auto=format&fit=crop";
    if (normalize.includes("stretch") || normalize.includes("flex")) return "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?q=80&w=2026&auto=format&fit=crop";
    if (normalize.includes("crossfit")) return "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=2070&auto=format&fit=crop";
    if (normalize.includes("strength") || normalize.includes("power")) return "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop";

    // Nutrition
    if (normalize.includes("breakfast") || normalize.includes("oat") || normalize.includes("egg")) return "https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=2070&auto=format&fit=crop";
    if (normalize.includes("lunch") || normalize.includes("salad") || normalize.includes("bowl")) return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop";
    if (normalize.includes("dinner") || normalize.includes("fist") || normalize.includes("steak") || normalize.includes("chicken")) return "https://images.unsplash.com/photo-1467003909585-2f8a7270028d?q=80&w=1868&auto=format&fit=crop";
    if (normalize.includes("snack") || normalize.includes("smoothie") || normalize.includes("yogurt")) return "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=2070&auto=format&fit=crop";

    // Fallbacks based on broad category
    if (normalize.includes("day") || normalize.includes("full")) return "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop";

    return "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"; // Gym default
}
