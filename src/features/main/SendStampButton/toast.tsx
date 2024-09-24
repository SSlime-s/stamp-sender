import { Button } from "@/components/ui/button";
import { TRAQ_BASE_URL } from "@/features/traq/consts";
import { TrashIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { toast } from "sonner";

interface Data {
	message: string;
	messageId: string;
	createdAt: string;
	channelPath: string;
	onDelete: () => Promise<void>;
}
export function sendSuccessToast({
	message,
	messageId: id,
	createdAt,
	channelPath,
	onDelete,
}: Data) {
	toast.success(`「${message}」を送信しました`, {
		description: (
			<div>
				<div>
					to:{" "}
					<Link href={`${TRAQ_BASE_URL}/channels/${channelPath}`}>
						#{channelPath}
					</Link>
				</div>
				<Button variant="link" asChild>
					<Link
						href={`${TRAQ_BASE_URL}/messages/${id}`}
					>{`${new Date(createdAt).toLocaleString()}`}</Link>
				</Button>
			</div>
		),
		action: {
			label: (
				<>
					削除 <TrashIcon />
				</>
			),
			onClick: onDelete,
		},
	});
}
