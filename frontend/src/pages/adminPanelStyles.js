// adminPanelStyles.js

const themeColors = {
  primaryGradient: "linear-gradient(to right, #7c3aed, #3b82f6, #ec4899)",
  violet: "#7c3aed",
  orange: "#ec4899",
  lightPurple: "#EAD6FF",
  darkPurple: "#4B00A7",
  white: "#FFFFFF",
  black: "#0f0f0f",
  grayText: "#d1d5db",
  background: "#1E003E",
};

const styles = {
  themeColors, // exportable color palette

  container: {
    dark: {
      background: themeColors.primaryGradient,
      minHeight: "100vh",
      color: themeColors.white,
    },
    light: {
      backgroundColor: themeColors.lightPurple,
      minHeight: "100vh",
      color: themeColors.darkPurple,
    },
  },

  navbar: {
    background: themeColors.primaryGradient,
    color: themeColors.white,
    padding: "1rem",
    fontWeight: "bold",
  },

  card: {
    background: themeColors.white,
    color: themeColors.white,
    borderRadius: "1rem",
    padding: "1.5rem",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
  },

  formSection: {
    dark: {
      backgroundColor: themeColors.white,
      color: themeColors.white,
      padding: "2rem",
    },
    light: {
      backgroundColor: themeColors.white,
      color: themeColors.darkPurple,
      padding: "2rem",
    },
  },

  submitButton: {
    backgroundColor: themeColors.orange,
    color: themeColors.white,
    borderRadius: "0.75rem",
    padding: "0.75rem 1.5rem",
    fontWeight: "bold",
    border: "none",
  },
};

export default styles;