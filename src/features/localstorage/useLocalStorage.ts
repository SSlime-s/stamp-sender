import { useSyncExternalStore } from "react";
import type { LSKeys } from "./keys";

/**
 * @returns value は設定されていないとき null で、SSR 時は undefined になる
 */
export function useLocalStorage(
	key: LSKeys,
): [string | null | undefined, (value: string | null) => void] {
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
		() => undefined,
	);

	return [value, setValue];
}

function subscribe(callback: () => void) {
	window.addEventListener("storage", callback);
	return () => {
		window.removeEventListener("storage", callback);
	};
}
