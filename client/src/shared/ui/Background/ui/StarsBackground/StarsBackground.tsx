import cls from "./StarsBackground.module.scss";

import { memo } from "react";

export const StarsBackground = memo(() => {
  const generateStars = () => {
    const stars = [];
    for (let i = 0; i < 200; i++) {
      const cx = `${Math.round(Math.random() * 10000) / 100}%`;
      const cy = `${Math.round(Math.random() * 10000) / 100}%`;
      const r = Math.round((Math.random() + 0.5) * 10) / 10;
      stars.push(<circle key={i} className={cls.star} cx={cx} cy={cy} r={r} />);
    }
    return stars;
  };

  return (
    <div className={cls.starsWrapper}>
      {Array.from({ length: 3 }).map((_, index) => (
        <svg
          key={index}
          className={cls.stars}
          width="100%"
          height="100%"
          preserveAspectRatio="none"
        >
          {generateStars()}
        </svg>
      ))}

      <svg
        className={cls.extras}
        width="100%"
        height="100%"
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id="comet-gradient" cx="0" cy=".5" r="0.5">
            <stop offset="0%" stopColor="rgba(255,255,255,.8)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        <g transform="rotate(-135)">
          <ellipse
            className={`${cls.comet} ${cls.cometA}`}
            fill="url(#comet-gradient)"
            cx="0"
            cy="0"
            rx="150"
            ry="2"
          />
        </g>
        <g transform="rotate(20)">
          <ellipse
            className={`${cls.comet} ${cls.cometB}`}
            fill="url(#comet-gradient)"
            cx="100%"
            cy="0"
            rx="150"
            ry="2"
          />
        </g>
        <g transform="rotate(300)">
          <ellipse
            className={`${cls.comet} ${cls.cometC}`}
            fill="url(#comet-gradient)"
            cx="40%"
            cy="100%"
            rx="150"
            ry="2"
          />
        </g>
      </svg>
    </div>
  );
});
