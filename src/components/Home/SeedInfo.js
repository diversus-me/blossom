import React from "react";
import style from "./SeedInfo.module.css";
import Accordion from "./Accordion";

const SeedInfo = () => {
  return (
    <div className={style.container}>
      <Accordion title="Why is the sky blue?">
        Sunlight reaches Earth's atmosphere and is scattered in all directions
        by all the gases and particles in the air. Blue light is scattered more
        than the other colors because it travels as shorter, smaller waves. This
        is why we see a blue sky most of the time.
      </Accordion>
    </div>
  );
};

export default SeedInfo;
