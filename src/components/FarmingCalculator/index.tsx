import { useState } from 'react';
import styled from 'styled-components';
import { WarzoneCalculator } from '../warzonecalculator';


const FarmingCalculator = () => {
  const [categoria, setCategoria] = useState('2');
  const [penalizacion, setPenalizacion] = useState('0');
  const [xpAcumulada, setXpAcumulada] = useState(0);
  const [historial, setHistorial] = useState<string[]>([]);
  const [conteo, setConteo] = useState({
    "Fea": 0,
    "Gorda": 0,
    "Anciana": 0,
    "Discapacitada": 0,
    "Extranjera": 0,
    "Gorda y Fea": 0
  });

  const multiplicadores = {
    "Fea": 2,
    "Gorda": 4,
    "Anciana": 10,
    "Discapacitada": 5,
    "Extranjera": 8,
    "Gorda y Fea": 20
  };

  const categorias = [
    { value: "2", text: "Fea" },
    { value: "4", text: "Gorda" },
    { value: "10", text: "Anciana" },
    { value: "5", text: "Discapacitada" },
    { value: "8", text: "Extranjera" },
    { value: "20", text: "Gorda y Fea" }
  ];

  const penalizaciones = [
    { value: "0", text: "Ninguna" },
    { value: "-500", text: "Prima" },
    { value: "-900", text: "Familiar cercano" },
    { value: "ban", text: "Mujer sin cédula (Baneo)" }
  ];

  const calcularXP = () => {
    const baseXP = 10;
    const categoriaEncontrada = categorias.find(cat => cat.value === categoria);
    const categoriaTexto = categoriaEncontrada ? categoriaEncontrada.text as keyof typeof conteo : null;
    const multiplicador = parseFloat(categoria);
    const penalizacionEncontrada = penalizaciones.find(pen => pen.value === penalizacion);
    const penalizacionTexto = penalizacionEncontrada ? penalizacionEncontrada.text : 'Desconocida';

    if (penalizacion === "ban") {
      setHistorial([...historial, "¡Baneado del servidor!"]);
      return;
    }

    const xpTotal = (baseXP * multiplicador) + parseInt(penalizacion);
    setXpAcumulada(prev => prev + xpTotal);
    setHistorial([...historial, `${categoriaTexto} (${xpTotal} XP) - Penalización: ${penalizacionTexto}`]);
    if (categoriaTexto) {
      setConteo(prev => ({
        ...prev,
        [categoriaTexto]: prev[categoriaTexto] + 1 as number
      }));
    }
  };

  const calcularPromedio = () => {
    const totalCategorias = Object.values(conteo).reduce((sum, val) => sum + val, 0);
    const sumaMultiplicadores = Object.entries(conteo).reduce(
      (sum, [cat, count]) => sum + (count * multiplicadores[cat as keyof typeof multiplicadores]),
      0
    );
    return totalCategorias > 0 ? (sumaMultiplicadores / totalCategorias).toFixed(2) : 0;
  };

  // Styled components
  const Body = styled.div`
    font-family: Arial, sans-serif;
    text-align: center;
    margin: 50px;
    background-color: #f8f9fa;
    
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    color: white;
    min-height: 100vh;
  `;

  const Container = styled.div`
    max-width: 800px;
    background: rgba(0, 0, 0, 0.8);
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
    margin: 0 auto;
  `;

  const Title = styled.h1`
    font-size: 2rem;
  `;

  const Subtitle = styled.h2`
    font-size: 2rem;
  `;

  const Label = styled.label`
    font-size: 2rem;
  `;

  const Select = styled.select`
    font-size: 1.8rem;
    padding: 10px;
  `;

  const Button = styled.button`
    font-size: 2rem;
    font-weight: bold;
    padding: 10px;
  `;

  const Row = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  `;

  const Column = styled.div`
    width: 48%;
    color: black;
    padding: 15px;
    border-radius: 10px;
    font-size: 1.5rem;
  `;

  return (
    <Body>
      <Container>
        <Title>Calculadora de Farmeo</Title>
        <div className="mb-3">
          <Label htmlFor="categoria" className="form-label">Selecciona la categoría:</Label>
          <Select
            id="categoria"
            className="form-select"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            {categorias.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.text}</option>
            ))}
          </Select>
        </div>
        <div className="mb-3">
          <Label htmlFor="penalizacion" className="form-label">Penalización:</Label>
          <Select
            id="penalizacion"
            className="form-select"
            value={penalizacion}
            onChange={(e) => setPenalizacion(e.target.value)}
          >
            {penalizaciones.map(pen => (
              <option key={pen.value} value={pen.value}>{pen.text}</option>
            ))}
          </Select>
        </div>
        <Button className="btn btn-danger" onClick={calcularXP}>Calcular XP</Button>
        
        <Subtitle className="mt-3">
          {penalizacion === "ban" ? "¡Baneado del servidor!" : (
            xpAcumulada < 0 ? (
              <>
                XP Total: {xpAcumulada}<br />
                <span style={{ color: '#ff6666' }}>
                  Necesitas farmear {Math.ceil(Math.abs(xpAcumulada) / 40)} Gorda(s) o {Math.ceil(Math.abs(xpAcumulada) / 20)} Fea(s)<br />
                  para recuperar XP positivo.
                </span>
              </>
            ) : `XP Total: ${xpAcumulada}`
          )}
        </Subtitle>

        <Row>
          <Column id="historial">
            <h3>Historial:</h3>
            <ul>
              {historial.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </Column>
          <Column id="conteo">
            <h3>Conteo:</h3>
            <ul>
              {Object.entries(conteo).map(([cat, count]) => (
                <li key={cat}>{cat} Total: {count}</li>
              ))}
              <li><strong>Promedio de multiplicador:</strong> {calcularPromedio()}</li>
            </ul>
          </Column>
        </Row>
      </Container>
      <WarzoneCalculator/>
    </Body>
  );
};

export default FarmingCalculator;