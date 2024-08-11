import Button from './components/Button/Button';
import Label from './components/Label/Label';
import icon from './assets/react.svg';
import Checkbox from './components/Checkbox/Checkbox';
import Rating from './components/Rating/Rating';
import Select from './components/Select/Select';
import './App.css';


function App() {
  
  const handleChangeRating = (newRating: number) => {
    console.log(`Nuevo rating: ${newRating}`);
  };

  const handleSelectChange = (value: string) => {
    console.log(`Opción seleccionada: ${value}`);
  };

  const options = [
    { label: 'Opción 1', value: '1' },
    { label: 'Opción 2', value: '2' },
    { label: 'Opción 3', value: '3' },
  ];

  return (
    <>
      <div className='containerTitle'>
        <h1 className='title'>Libreria de componentes JACM</h1>
      </div>
      <div>
        <h2 className='component'>Labels</h2>
        <div> 
          <Label name='Hola Mundo' type='normal' size='large' />
        </div>
      </div>
      <div>
        <h2 className='component'>Buttons</h2>
        <div style={{display: 'flex'}}> 
          <div style={{marginRight: '10px'}}>
            <Button variant='primary' name='Boton' size='small' leftIcon={icon} />
          </div>
          <div style={{marginRight: '10px'}}>
            <Button variant='secondary' name='Boton' size='medium' rightIcon={icon} />
          </div>
          <div style={{marginRight: '10px'}}>
            <Button className='prueba' variant='normal' name='Boton' size='large' leftIcon={icon} rightIcon={icon} />
          </div>
        </div>
      </div>
      <div>
        <h2 className='component'>Checkboxes</h2>
        <div style={{display: 'flex'}}> 
          <div style={{marginRight: '10px'}}>
            <Checkbox variant='primary' size='small' nameLeft='Hola' />
          </div>
          <div style={{marginRight: '10px'}}>
            <Checkbox variant='primary' size='medium' nameRight='Hola'/>
          </div>
          <div style={{marginRight: '10px'}}>
            <Checkbox variant='primary' size='large' nameLeft='Hola' nameRight='Hola'/>
          </div>
        </div>
      </div>
      <div>
        <h2 className='component'>Rating</h2>
        <div style={{display: 'flex', alignItems: 'center'}}> 
          <div style={{ marginRight: '16px'}}>
            <Rating
                maxRating={3}
                initialRating={1}
                variant='primary'
                size='small'
                onRatingChange={handleChangeRating}
              />
          </div>
          <div style={{ marginRight: '16px'}}>
            <Rating
                maxRating={5}
                initialRating={1}
                variant='secondary'
                size='medium'
                onRatingChange={handleChangeRating}
              />
          </div>
          <div style={{ marginRight: '16px'}}>
            <Rating
                maxRating={7}
                initialRating={1}
                variant='normal'
                size='large'
                onRatingChange={handleChangeRating}
              />
          </div>
        </div>
      </div>
      <div>
        <h2 className='component'>Select</h2>
        <div style={{display: 'flex', alignItems: 'center'}}> 
          <div style={{ marginRight: '16px'}}>
            <Select
                options={options}
                placeholder="Todos"
                variant="primary"
                size="small"
                onChange={handleSelectChange}
              />
          </div>
          <div style={{ marginRight: '16px'}}>
            <Select
                options={options}
                placeholder="Todos"
                variant="secondary"
                size="small"
                onChange={handleSelectChange}
              />
          </div>
          <div style={{ marginRight: '16px'}}>
            <Select
                options={options}
                placeholder="Todos"
                variant="normal"
                size="small"
                onChange={handleSelectChange}
              />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
