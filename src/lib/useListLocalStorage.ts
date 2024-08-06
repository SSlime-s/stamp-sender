import { useLocalStorage } from "./useLocalStorage";

export function useListLocalStorage(
	key: string,
): [string[], (value: string[]) => void] {
	const [value, setValue] = useLocalStorage(key);

	const list = value ? value.split(",") : [];

	function setList(value: string[]) {
		setValue(value.join(","));
	}

	return [list, setList];
}
