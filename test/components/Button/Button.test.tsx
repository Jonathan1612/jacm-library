import React from 'react';
import renderer from 'react-test-renderer';
import  Button  from '../../../src/components/Button/Button';

describe('Button', () => {
    test('Debe mostrar el componente de boton correctamente ', () => {
      const wrapper = renderer.create(
        <Button name="Prueba" />
      )
      console.log(wrapper.toJSON())
    })
    
})