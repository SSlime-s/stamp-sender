import { useSyncExternalStore } from "react";
import type { LSKeys } from "./keys";

export function useLocalStorage(
	key: LSKeys,
): [string | null, (value: string | null) => void] {
	function setValue(value: string | null) {
		if (value === null) {
			window.localStorage.removeItem(key);
		} else {
			window.localStorage.setItem(key, value);
		}

		window.dispatchEvent(new Event("storage"));
	}

	const value = useSyncExternalStore(
		subscribe,
		() => window.localStorage.getItem(key),
		() => null,
	);

	return [value, setValue];
}

function subscribe(callback: () => void) {
	window.addEventListener("storage", callback);
	return () => {
		window.removeEventListener("storage", callback);
	};
}
