export async function blobToURI(blob: Blob) {
	const contentType = blob.type;
	const buffer = Buffer.from(await blob.arrayBuffer());

	return `data:${contentType};base64,${buffer.toString("base64")}`;
}
