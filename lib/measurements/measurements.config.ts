export const MEASUREMENT_CONFIG = {
  weight: {
    label: "Peso",
    unit: "kg",
    inverse: true
  },
  waist: {
    label: "Cintura",
    unit: "cm",
    inverse: true
  },

  chest: {
    label: "Pecho",
    unit: "cm",
    inverse: false
  },

  left_arm: {
    label: "Brazo (izq.)",
    unit: "cm",
    inverse: false
  },

  right_arm: {
    label: "Brazo (der.)",
    unit: "cm",
    inverse: false
  },

  left_leg: {
    label: "Pierna (izq.)",
    unit: "cm",
    inverse: false
  },

  right_leg: {
    label: "Pierna (der.)",
    unit: "cm",
    inverse: false
  },

  body_fat: {
    label: "% Grasa",
    unit: "%",
    inverse: true
  }
} as const;