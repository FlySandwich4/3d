export type Interval = {
	start: number;
	end: number;
};


// use useScroll to get total pagesl, and the offset of a page is always betewen 0 and 1
export function getPageIntervalLength(totalPages: number): number {
	return 1.0 / (totalPages - 1);
}

/**
 * @param totalPages total numbers of pages
 * @param page 0 indexing, the index of page you want to get
 * @returns the starting position of the page
 */
export function getPageStart(totalPages: number, pageIndex: number): number {
	const pageInterval = getPageIntervalLength(totalPages);
	const start = pageIndex * pageInterval;
	return start;
}

export function getPageInterval(
	totalPages: number,
	pageIndex: number
): Interval {
	const pageInterval = getPageIntervalLength(totalPages);
	const start = getPageStart(totalPages, pageIndex);
	const end = start + pageInterval;
	return { start, end };
}

/**
 * @param totalPages total numbers of pages
 * @param percentage how much percentage of the page you want to get
 * @returns part of the page interval, e.g return 0.25 if totalPages is 3 and percentage is 0.5
 */
export function getPartialPageIntervalLength(
	totalPages: number,
	percentage: number
): number {
	if (percentage == 0) {
		return 0;
	}
	const pageInterval = getPageIntervalLength(totalPages);
	const partialPageInterval = pageInterval * percentage;
	return partialPageInterval;
}

/**
 * Get the interval of a page, which is the start and end position of the page
 * @param totalPages total numbers of pages
 * @param pageIndex starting page, 0 indexing
 * @param pagePercentage how much percentage of the page interval length you want to get,
 * can be negative or positive, negative means the page is before the pageIndex
 * @returns the interval. e.g if totalPage is 5, page index is 1(means page 2),
 * and pagePercentage is 0.5, the interval will be [0.25, 0.375]
 * which means from page 2 to page 2.5
 */
export function getPageToInterval(
	totalPages: number,
	pageIndex: number,
	pagePercentage: number
): Interval {
	if (pageIndex < 0 || pageIndex > totalPages - 1) {
		throw new Error("pageIndex out of range");
	}
	if (
		(pagePercentage < 0 && -pagePercentage > pageIndex) ||
		(pagePercentage > 0 && pagePercentage > totalPages - 1 - pageIndex)
	) {
		throw new Error("pagePercentage out of range");
	}

	const partialPageInterval = getPartialPageIntervalLength(
		totalPages,
		pagePercentage
	);
	const start = getPageStart(totalPages, pageIndex);
	const end = start + partialPageInterval;
	if (pagePercentage < 0) {
		return { start: end, end: start };
	}
	return { start, end };
}
