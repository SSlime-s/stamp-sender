import { TRAQ_API_BASE_URL } from "./consts";

export function fileUrl(fileId: string) {
	return `${TRAQ_API_BASE_URL}/files/${fileId}`;
}
