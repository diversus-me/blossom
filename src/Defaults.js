import { MdNotInterested } from "react-icons/md";
import { GoBeaker } from "react-icons/go";
import { FaLaughBeam, FaBalanceScale } from "react-icons/fa";
import { IoIosCheckmarkCircle, IoIosHammer } from "react-icons/io";

export const MARKER_SIZE = 20;

export const DOWN_SCALE_FACTOR = 0.6;
export const LOST_PETAL_DOWN_SCALE_FACTOR = 1;

export const MAGNIFY_SPEED = 600;
export const UNMAGNIFY_SPEED = 800;

export const NAVBAR_HEIGHT = 60;
export const SIDEBAR_WIDTH = 320;

export const FLAVORS = [
  {
    name: "Neutral",
    type: "neutral",
    color: "#7A869A",
    icon: FaBalanceScale
  },
  {
    name: "Pro",
    type: "pro",
    color: "#36B37E",
    icon: IoIosCheckmarkCircle
  },
  {
    name: "Contra",
    type: "contra",
    color: "#E74949",
    icon: MdNotInterested
  },
  {
    name: "Science",
    type: "science",
    color: "#6554C0",
    icon: GoBeaker
  },
  {
    name: "Joke",
    type: "joke",
    color: "#ffAB00",
    icon: FaLaughBeam
  },
  {
    name: "Fact Check",
    type: "fact check",
    color: "#2684FF",
    icon: IoIosHammer
  }
];

export function getFlavor(type) {
  return FLAVORS.find(element => {
    return element.type === type;
  });
}
