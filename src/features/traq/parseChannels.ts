import { type Channel, type ChannelSlim, ChannelSlimScheme } from "./model";
import * as v from "valibot";

export type IdToChannelMap = Map<string, Channel>;
export type IdToChannelSlimMap = Map<string, ChannelSlim>;
export type ChannelTree = {
	node: Channel;
	children?: Map<string, ChannelTree>;
};
export type ChannelFullNameMap = Map<string, string>;

export interface ParsedChannels {
	idToChannelMap: IdToChannelSlimMap;
	channelFullNameMap: ChannelFullNameMap;
}

export function toSlimIdToChannelMap(
	idToChannelMap: IdToChannelMap,
): Map<string, ChannelSlim> {
	const idToChannelSlimMap = new Map<string, ChannelSlim>();
	for (const [id, channel] of idToChannelMap) {
		idToChannelSlimMap.set(id, v.parse(ChannelSlimScheme, channel));
	}
	return idToChannelSlimMap;
}

export function parseChannels(channels: Readonly<Channel[]>): ParsedChannels {
	const idToChannelMap = new Map<string, Channel>();

	for (const channel of channels) {
		idToChannelMap.set(channel.id, channel);
	}

	const channelTree = new Map<string, ChannelTree>();
	const rootChannels = channels.filter((channel) => channel.parentId === null);

	function compareChannelNames(a: Channel, b: Channel) {
		return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
	}

	function buildTree(channel: Channel): ChannelTree {
		const tree = new Map<string, ChannelTree>();
		const children = channel.children ?? [];
		children.sort((a, b) => {
			const aChannel = idToChannelMap.get(a);
			const bChannel = idToChannelMap.get(b);
			if (aChannel === undefined || bChannel === undefined) {
				return 0;
			}
			return compareChannelNames(aChannel, bChannel);
		});
		for (const child of children) {
			const childChannel = idToChannelMap.get(child);
			if (childChannel !== undefined) {
				tree.set(childChannel.name, buildTree(childChannel));
			}
		}

		return {
			node: channel,
			children: tree,
		};
	}

	rootChannels.sort(compareChannelNames);
	for (const rootChannel of rootChannels) {
		channelTree.set(rootChannel.name, buildTree(rootChannel));
	}

	const channelFullNameMap = new Map<string, string>();
	for (const channel of channels) {
		channelFullNameMap.set(
			channel.id,
			getChannelFullName(channel, idToChannelMap),
		);
	}

	return {
		idToChannelMap: toSlimIdToChannelMap(idToChannelMap),
		channelFullNameMap,
	};
}

function getChannelFullName(
	channel: Channel,
	idToChannelMap: IdToChannelMap,
): string {
	const names = [channel.name];
	let currentChannel = channel;
	while (currentChannel.parentId !== null) {
		const parentChannel = idToChannelMap.get(currentChannel.parentId);
		if (parentChannel === undefined) {
			break;
		}
		names.unshift(parentChannel.name);
		currentChannel = parentChannel;
	}

	return names.join("/");
}
