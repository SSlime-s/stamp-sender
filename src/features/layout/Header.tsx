import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth, signIn, signOut } from "@/features/auth";
import { CaretDownIcon } from "@radix-ui/react-icons";

export async function Header() {
	const session = await auth();

	return (
		<div className="grid grid-cols-[1fr_max-content_1fr] items-center px-2 min-h-16">
			<h1 className="col-start-2 text-xl font-bold text-slate-500">
				Stamp Sender
			</h1>
			{session?.user === undefined ? (
				<form
					action={async () => {
						"use server";

						await signIn("traq");
					}}
					className="justify-self-end"
				>
					<Button type="submit">Sign in</Button>
				</form>
			) : (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="size-fit justify-self-end">
							<Avatar>
								<AvatarImage src={session.user.image ?? ""} />
								<AvatarFallback>{session.user.name}</AvatarFallback>
							</Avatar>
							<CaretDownIcon />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLabel asChild>
							<form
								action={async () => {
									"use server";

									await signOut();
								}}
							>
								<Button variant="ghost" type="submit" className="size-full p-0">
									Logout
								</Button>
							</form>
						</DropdownMenuLabel>
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</div>
	);
}
