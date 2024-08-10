import Button from './components/Button/Button'
import Label from './components/Label/Label'
import icon from './assets/react.svg'
import './App.css'

function App() {

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
            <Button variant='secondary' name='Boton' size='small' rightIcon={icon} />
          </div>
          <div style={{marginRight: '10px'}}>
            <Button className='prueba' variant='normal' name='Boton' size='small' leftIcon={icon} rightIcon={icon} />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
