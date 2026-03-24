export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer>All rights reserved © {currentYear} </footer>
	);
}