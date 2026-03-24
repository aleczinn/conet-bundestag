export default function NotFound() {
	return (
		<main className="flex-1 flex flex-col justify-center items-center">
			<h1 className="text-7xl mb-8"><span className="font-bold">404</span> – Seite nicht gefunden</h1>
			<a href="/" className="underline hover:text-blue-400">Zurück zur Startseite</a>
		</main>
	);
}