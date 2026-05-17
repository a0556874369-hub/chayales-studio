// Four diffused beams of teal light, fixed to the viewport. They sit at z-0
// so any section with a transparent background reveals them; sections with
// their own opaque background (Hero) cover them — by design.

export default function LightRays() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden
    >
      {/* Ray 1 — strong diagonal from top-right to bottom-left */}
      <div
        className="absolute"
        style={{
          top: "-30%",
          right: "-20%",
          width: "50%",
          height: "160%",
          background:
            "linear-gradient(135deg, transparent 35%, rgba(77, 216, 229, 0.25) 50%, transparent 65%)",
          filter: "blur(60px)",
          transform: "rotate(25deg)",
        }}
      />

      {/* Ray 2 — diagonal from top-left toward bottom-right */}
      <div
        className="absolute"
        style={{
          top: "-20%",
          left: "-15%",
          width: "45%",
          height: "140%",
          background:
            "linear-gradient(45deg, transparent 30%, rgba(110, 191, 201, 0.20) 50%, transparent 70%)",
          filter: "blur(70px)",
          transform: "rotate(-30deg)",
        }}
      />

      {/* Ray 3 — narrow, intense vertical beam, slightly tilted */}
      <div
        className="absolute"
        style={{
          top: "-10%",
          left: "60%",
          width: "15%",
          height: "120%",
          background:
            "linear-gradient(180deg, rgba(184, 232, 237, 0.18) 0%, rgba(77, 216, 229, 0.10) 50%, transparent 100%)",
          filter: "blur(40px)",
          transform: "rotate(10deg)",
        }}
      />

      {/* Ray 4 — wide, soft uplight from the bottom-center */}
      <div
        className="absolute"
        style={{
          bottom: "-20%",
          left: "20%",
          width: "60%",
          height: "80%",
          background:
            "linear-gradient(0deg, rgba(45, 136, 150, 0.15) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
    </div>
  );
}
