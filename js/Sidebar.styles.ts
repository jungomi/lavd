import { css, cx } from "emotion";
import { bgColour } from "./App.styles";

export const sidebar = css({
  display: "flex",
  height: "100%",
  width: "18rem",
  position: "relative",
  padding: "1.0rem",
  flexDirection: "column",
  flexShrink: 0,
  // The transition is `In Out - Cubic` in Chrome dev tools.
  transition: "all 0.3s cubic-bezier(0.65, 0.05, 0.36, 1)",
  background: bgColour,
  borderRight: "2px solid #e9e9e9",
  zIndex: 50
});

export const sidebarHidden = cx(
  sidebar,
  css({
    width: 0,
    border: 0,
    padding: 0,
    margin: 0
  })
);

export const entry = css({
  position: "relative",
  display: "flex",
  alignItems: "flex-start",
  fontWeight: 300,
  margin: "0.2rem 0"
});

export const hiddenEntry = cx(
  entry,
  css({
    color: "#929292"
  })
);

export const entryName = css({
  flexGrow: 1,
  marginTop: "0.1rem"
});

export const title = css({
  display: "flex",
  justifyContent: "center",
  fontWeight: 500,
  color: "#616161",
  marginBottom: "0.5rem"
});

export const colour = css({
  width: "1.0rem",
  height: "1.0rem",
  marginRight: "0.6rem",
  flexShrink: 0,
  borderRadius: "50%",
  border: "1px solid #dadada",
  cursor: "pointer"
});

const toggleOffset = "20rem";

export const toggle = css({
  outline: "none",
  position: "absolute",
  top: "2px",
  left: toggleOffset,
  transition: "all 0.3s cubic-bezier(0.65, 0.05, 0.36, 1)",
  cursor: "pointer",
  width: "1.5rem",
  height: "1.5rem",
  fill: "#8c8c8c",
  transform: "rotate(180deg)"
});

export const toggleHidden = cx(
  toggle,
  css({
    // Moves the icon back to 0. At the same time it removes the rotation of the
    // icon, which should be rotated to point in the opposite direction.
    transform: `translateX(-${toggleOffset})`
  })
);

export const nameListContainer = css({
  height: "100%",
  // The visibility is delayed for 0.3s to avoid clamping the text into small
  // spaces.
  transition: "visibility 0s 0.3s"
});

export const nameListHidden = css({
  visibility: "hidden"
});

export const activeNameList = css({
  display: "flex",
  position: "relative",
  flexDirection: "column",
  height: "50%",
  overflow: "hidden"
});

export const inactiveNameList = cx(
  activeNameList,
  css({
    marginTop: "1.5rem"
  })
);

export const nameList = css({
  display: "flex",
  flexDirection: "column",
  overflow: "auto"
});

export const visibility = css({
  width: "1rem",
  height: "1rem",
  marginTop: "0.1rem",
  flexShrink: 0,
  cursor: "pointer"
});

export const visibilityAll = cx(
  visibility,
  css({
    position: "absolute",
    top: 0,
    right: 0,
    marginTop: 0
  })
);

export const visibilityIcon = css({
  fill: "#8c8c8c"
});

export const visibilityIconShown = cx(
  visibilityIcon,
  css({
    "& > path:nth-child(2)": {
      visibility: "hidden"
    },
    ":hover": {
      "& > path:nth-child(1)": {
        visibility: "hidden"
      },
      "& > path:nth-child(2)": {
        visibility: "visible"
      }
    }
  })
);

export const visibilityIconHidden = cx(
  visibilityIcon,
  css({
    "& > path:nth-child(1)": {
      visibility: "hidden"
    },
    ":hover": {
      "& > path:nth-child(2)": {
        visibility: "hidden"
      },
      "& > path:nth-child(1)": {
        visibility: "visible"
      }
    }
  })
);
