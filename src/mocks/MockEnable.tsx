"use client";

import { useEffect } from "react";
import { initMocks } from "./setup";

export function MockEnable() {
	useEffect(() => {
		initMocks();
	}, []);

	return null;
}
