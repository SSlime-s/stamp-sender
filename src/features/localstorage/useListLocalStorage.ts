import type { LSKeys } from "./keys";
import { useLocalStorage } from "./useLocalStorage";

export function useListLocalStorage(
	key: LSKeys,
): [string[], (value: string[]) => void] {
	const [value, setValue] = useLocalStorage(key);

	const list = value ? value.split(",") : [];

	function setList(value: string[]) {
		setValue(value.join(","));
	}

	return [list, setList];
}
