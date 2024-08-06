import { auth, signIn, signOut } from "@/features/auth";
import Inner from "./Inner";

export default async function Home() {
	const session = await auth();

	return (
		<main className="h-full mb-auto">
			<h1 className="text-4xl text-center">traQ Auth.js example</h1>
			<p>
				{session?.user !== undefined ? (
					<>
						Hello {session.user.name} <img src={session.user.image || ""} />
					</>
				) : (
					<>Not signed in</>
				)}
			</p>
			<form
				action={async () => {
					"use server";

					if (session?.user !== undefined) {
						await signOut();
					} else {
						await signIn("traq");
					}
				}}
			>
				<button type="submit" className="border-2 border-black p-2">
					{session?.user !== undefined ? "Sign out" : "Sign in"}
				</button>
			</form>

			<Inner />
		</main>
	);
}
