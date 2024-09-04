import { useMemo, useState } from "react";

export function useTriggerRender() {
	const [_, setCount] = useState(0);

	return useMemo(() => {
		return () => setCount((count) => count + 1);
	}, []);
}
