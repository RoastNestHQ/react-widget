function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Merges `source` onto `target` field-by-field, recursing into nested plain
 * objects instead of replacing them wholesale. A shallow `{...target,
 * ...source}` spread silently drops sibling fields when `source` only sets
 * part of a nested object (e.g. cloud config setting `form.errorMessage`
 * would wipe out a locally-configured `form.submitButton.label`) - this
 * merges them instead. Arrays and primitives in `source` still replace
 * `target`'s value outright; only plain objects recurse.
 */
export function mergeDeep<T extends object>(target: T, source: Partial<T> | undefined | null): T {
	if (!source) return target;

	const result: Record<string, unknown> = { ...(target as Record<string, unknown>) };

	for (const key of Object.keys(source)) {
		const sourceValue = (source as Record<string, unknown>)[key];
		const targetValue = result[key];

		if (sourceValue === undefined) continue;

		result[key] =
			isPlainObject(sourceValue) && isPlainObject(targetValue)
				? mergeDeep(targetValue, sourceValue)
				: sourceValue;
	}

	return result as T;
}
