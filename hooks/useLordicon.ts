"use client";

import { useEffect } from "react";

export default function useLordicon() {
    useEffect(() => {
        import("lord-icon-element").then(() => {
            console.log("Lordicon initialized");
        });
    }, []);
}
