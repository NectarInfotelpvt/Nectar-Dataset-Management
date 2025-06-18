// adminPanelStyles.js

const orange = {
  primary: "#FF6B00",
  light: "#FFE5D0",
  dark: "#B34700",
};

const styles = {
  orange, // export for convenience

  container: {
    dark: {
      backgroundColor: orange.dark,
      minHeight: "100vh",
    },
    light: {
      backgroundColor: orange.light,
      minHeight: "100vh",
    },
  },

  navbar: {
    backgroundColor: orange.primary,
  },

  card: {
    backgroundColor: orange.primary,
    color: "white",
  },

  formSection: {
    dark: {
      backgroundColor: orange.primary,
    },
    light: {
      backgroundColor: "white",
    },
  },

  submitButton: {
    backgroundColor: orange.primary,
    color: "white",
  },
};

export default styles;
