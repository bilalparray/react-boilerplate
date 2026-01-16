import { useState, useEffect } from "react";
import "./DealsCountdown.css";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function DealsCountdown() {
  const calculateTimeLeft = (): TimeLeft => {
    const difference = +new Date("2025-12-31") - +new Date();
    let timeLeft: TimeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeBox = ({ value, label }: { value: number; label: string }) => (
    <div className="time-box">
      <div className="time-value">{String(value).padStart(2, "0")}</div>
      <div className="time-label">{label}</div>
    </div>
  );

  return (
    <section className="deals-countdown">
      <div className="container">
        <div className="deals-content">
          <div className="deals-text">
            <span className="deals-badge">Limited Time Offer</span>
            <h2 className="deals-title">Flash Sale Ends In</h2>
            <p className="deals-subtitle">
              Get up to 50% off on selected items. Don't miss out!
            </p>
          </div>

          <div className="deals-timer">
            <TimeBox value={timeLeft.days} label="Days" />
            <span className="timer-separator">:</span>
            <TimeBox value={timeLeft.hours} label="Hours" />
            <span className="timer-separator">:</span>
            <TimeBox value={timeLeft.minutes} label="Minutes" />
            <span className="timer-separator">:</span>
            <TimeBox value={timeLeft.seconds} label="Seconds" />
          </div>

          <a href="/shop" className="deals-cta">
            Shop Now <i className="bi bi-arrow-right"></i>
          </a>
        </div>
      </div>
    </section>
  );
}
