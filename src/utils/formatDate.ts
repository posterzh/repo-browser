function formatDate(date: string) {
	let options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	};
	const newDate = new Date(date);
	return new Intl.DateTimeFormat('default', options).format(newDate);
}

export default formatDate;
