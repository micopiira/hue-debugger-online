// Suspense integrations like Relay implement
// a contract like this to integrate with React.
// Real implementations can be significantly more complex.
// Don't copy-paste this into your project!
export function wrapPromise(fn) {
	let status = "pending";
	let result;
	return {
		read(args) {
			if (status === "pending") {
				const p = typeof fn === "function" ? fn(args) : fn;
				throw p.then(
					r => {
						status = "success";
						result = r;
					},
					e => {
						status = "error";
						result = e;
					}
				);
			} else if (status === "error") {
				throw result;
			} else if (status === "success") {
				return result;
			}
		}
	};
}
