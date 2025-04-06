import '../styles/home.css';
import QuienesSomos from './QuienesSomos';
import Contactanos from './Contactanos';
import Formulario from './Formulario';

function Home() {
  return (
    <div>
      <section id="inicio" className="home-section fadeIn">
        <h1>Industrias Stark</h1>
        <p>
          Industrias Stark es una empresa líder en innovación y tecnología, dedicada a transformar el mercado con soluciones de alta calidad. Nuestro compromiso es impulsar el futuro a través de la innovación y el desarrollo tecnológico.
        </p>
      </section>
      
      <section id="quienes-somos" className="home-section fadeIn">
        <QuienesSomos />
      </section>
      
      <section id="contactanos" className="home-section fadeIn">
        <Contactanos />
      </section>
      
      <section id="formulario" className="home-section fadeIn">
        <Formulario />
      </section>
    </div>
  );
}

export default Home;
