export const LSKeys = Object.freeze({
	PostStampEffect: "post-stamp-effect",
	PostStampHistory: "post-stamp-history",
	PostStamp: "post-stamp",
	PostChannel: "post-channel",
});

export type LSKeys = (typeof LSKeys)[keyof typeof LSKeys];
