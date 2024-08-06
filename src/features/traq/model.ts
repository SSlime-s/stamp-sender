import * as v from "valibot";

const MessageStampSchema = v.object({
	userId: v.pipe(v.string(), v.uuid()),
	stampId: v.pipe(v.string(), v.uuid()),
	count: v.pipe(v.number(), v.integer(), v.toMinValue(0)),
	createdAt: v.pipe(v.string(), v.isoDateTime()),
	updatedAt: v.pipe(v.string(), v.isoDateTime()),
});

export const MessageSchema = v.object({
	id: v.pipe(v.string(), v.uuid()),
	userId: v.pipe(v.string(), v.uuid()),
	channelId: v.pipe(v.string(), v.uuid()),
	content: v.string(),
	createdAt: v.pipe(v.string(), v.isoDateTime()),
	updatedAt: v.pipe(v.string(), v.isoDateTime()),
	pinned: v.boolean(),
	stamps: v.array(MessageStampSchema),
	threadId: v.optional(v.nullable(v.pipe(v.string(), v.uuid()))),
});
export type Message = v.InferOutput<typeof MessageSchema>;

export const StampScheme = v.object({
	id: v.pipe(v.string(), v.uuid()),
	name: v.string(),
	creatorId: v.pipe(v.string(), v.uuid()),
	createdAt: v.pipe(v.string(), v.isoDateTime()),
	updatedAt: v.pipe(v.string(), v.isoDateTime()),
	fileId: v.pipe(v.string(), v.uuid()),
	isUnicode: v.boolean(),
	hasThumbnail: v.optional(v.boolean()),
});
export type Stamp = v.InferOutput<typeof StampScheme>;

export const ChannelScheme = v.object({
	id: v.pipe(v.string(), v.uuid()),
	parentId: v.nullable(v.pipe(v.string(), v.uuid())),
	archived: v.boolean(),
	force: v.boolean(),
	topic: v.string(),
	name: v.string(),
	children: v.array(v.pipe(v.string(), v.uuid())),
});
export type Channel = v.InferOutput<typeof ChannelScheme>;
