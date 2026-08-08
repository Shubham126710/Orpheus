"use client";

export default function BackgroundRenderer() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-black">
      {/* Pure black background, grain removed per user request */}
    </div>
  );
}
