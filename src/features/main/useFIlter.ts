import { useMemo, useState } from "react";
import { defaultFilter } from "cmdk";

export function useFilter<T>(items: T[], getKey: (item: T) => string) {
	const [filter, setFilter] = useState("");

	const filteredItems = useMemo(() => {
		const withRank = items
			.map((item) => {
				if (defaultFilter === undefined) {
					throw new Error("defaultFilter is not defined");
				}

				const rank = defaultFilter(getKey(item), filter);
				return { item, rank };
			})
			.filter(({ rank }) => rank > 0);

		withRank.sort((a, b) => {
			if (a.rank === b.rank) {
				return getKey(a.item).localeCompare(getKey(b.item));
			}

			return a.rank > b.rank ? -1 : 1;
		});

		return withRank.map(({ item }) => item);
	}, [items, filter, getKey]);

	return { filter, setFilter, filteredItems };
}
