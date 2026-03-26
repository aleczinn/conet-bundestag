import ServiceBar from '@/components/layout/ServiceBar';
import Container from '@/components/layout/Container';

export default function Header() {
	return (
		<header className="shadow-md shadow-gray-20">
			<ServiceBar />

			<Container className="py-5 bg-white">
				<div>template</div>
			</Container>



		</header>
	);
}