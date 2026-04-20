// src/pages/TestSupabase.jsx
import { useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function TestSupabase() {
  useEffect(() => {
    const test = async () => {
      const { data, error } = await supabase.from("profiles").select("*");
      console.log("Data:", data);
      console.log("Error:", error);
    };
    test();
  }, []);

  return <div>Open console to see Supabase test result</div>;
}