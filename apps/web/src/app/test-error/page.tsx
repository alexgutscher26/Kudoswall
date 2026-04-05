"use client";

export default function TestErrorPage() {
  // Deliberately throw an error to test error.tsx
  throw new Error("This is a deliberate test error to verify the custom error page.");

  return (
    <div>
      <h1>This should not render</h1>
    </div>
  );
}
