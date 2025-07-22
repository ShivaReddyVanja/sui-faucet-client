import { Suspense } from "react";
import Component from "./HomePage";
import SuiLoader from "@/components/SuiLoader";

export default function Home() {
  return (
    <div className="font-sans">
      <Suspense fallback={<SuiLoader/>}>
        <Component />
      </Suspense>
    </div>
  );
}
