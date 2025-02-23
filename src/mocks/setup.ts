async function initMocks() {
	if (process.env.NEXT_PUBLIC_MOCK !== "true") {
		return;
	}

	if (typeof window === "undefined") {
		const { server } = await import("./server");
		server.listen();
	} else {
		const { worker } = await import("./browser");
		worker.start();
	}
}

export { initMocks };
